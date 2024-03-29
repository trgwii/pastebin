import assets from "./assets.b.ts";
import { config } from "./config.ts";
import { createHash, encode, serve, serveTLS, v4 } from "./deps.ts";
import { exec } from "./exec.ts";
import editor from "./monaco-editor.b.ts";
import { mime } from "./router/mime.ts";
import { defaultStaticOpts, router } from "./router/router.ts";

const assetFiles = await assets;
const staticFiles = assetFiles.public;
const index = staticFiles["index.html"];
const js = staticFiles["app.js"];

// deno run --allow-net --allow-read=pastes --allow-write=pastes serve.ts
// deno run --allow-net --allow-read=pastes --allow-write=pastes --allow-run serve.ts 8080 127.0.0.1 thumbnails
// deno install -f -n pastebin-server --allow-net --allow-read=pastes --allow-write=pastes serve.ts
// deno install -f -n pastebin-server --allow-net --allow-read=pastes --allow-write=pastes https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts

type Permissions = {
  permissions: {
    request(
      desc: { name: "net" | "run" } | { name: "read" | "write"; path: string },
    ): Promise<{ state: "granted" | "denied" | "prompt" }>;
  };
};

const perms = "permissions" in Deno;

const missingPerms = (state: string, err: string, fatal = true) => {
  if (state !== "granted") {
    console.error(`Missing permissions for ${err}`);
    return fatal ? Deno.exit(1) : true;
  }
  return false;
};

if (perms) {
  const net = await (Deno as unknown as Permissions).permissions
    .request({ name: "net" });
  missingPerms(net.state, "creating a server");
  const read = await (Deno as unknown as Permissions).permissions
    .request({ name: "read", path: "pastes" });
  missingPerms(read.state, "reading stored pastes");
  const write = await (Deno as unknown as Permissions).permissions
    .request({ name: "write", path: "pastes" });
  missingPerms(write.state, "saving new pastes");
}

try {
  await Deno.mkdir("pastes/meta", { recursive: true });
} catch {
  void 0;
}

const {
  maxSize,
  port,
  hostname,
  nodeThumbnails,
  nodeThumbnailInterval,
} = config;
let usedSpace = 0;

for await (const ent of Deno.readDir("pastes")) {
  usedSpace += (await Deno.stat(`pastes/${ent.name}`)).size;
}

const checkSpace = (limit: number, used: number) => {
  if (used >= limit) {
    throw new TypeError("Global space limit exceeded");
  }
};

checkSpace(maxSize, usedSpace);

const app = router(
  ((config.certFile && config.keyFile) ? serveTLS : serve)({
    hostname,
    port,
    certFile: config.certFile,
    keyFile: config.keyFile,
  }),
);

if (config.httpsRedirect) {
  const server = serve({ hostname, port: config.httpsRedirect });
  (async () => {
    for await (const req of server) {
      req.respond({
        status: 302,
        headers: new Headers({
          "Location": "https://" + req.headers.get("Host") + req.url,
        }),
      });
    }
  })();
}

console.log(`Listening on ${hostname}:${port}`);

for await (const de of Deno.readDir("pastes")) {
  if (!de.isFile) {
    continue;
  }
  const stats = await Deno.stat(`pastes/meta/${de.name}`)
    .catch(() => false as const);
  if (!stats) {
    await Deno.writeTextFile(
      `pastes/meta/${de.name}`,
      JSON.stringify({ language: "plaintext" }),
    );
  }
}

if (nodeThumbnails) {
  const missing = perms
    ? missingPerms(
      (await (Deno as unknown as Permissions).permissions
        .request({ name: "run" })).state,
      "thumbnail generation, disabling thumbnails",
      false,
    )
    : false;
  if (!missing) {
    await Deno.mkdir("pastes/thumbs", { recursive: true });
    await Deno.writeFile(
      "pastes/thumbs/thumbnail_gen.js",
      assetFiles["thumbnail_gen.js"],
    );
    if (await exec(["node", "-v"]).then((x) => x.success)) {
      exec([
        "node",
        "pastes/thumbs/thumbnail_gen.js",
        String(port),
        String(nodeThumbnailInterval),
        `http${config.certFile && config.keyFile ? "s" : ""}://127.0.0.1`,
      ]);
    } else {
      console.warn(
        "thumbnail support specified but node.js not installed, disabling thumbnails",
      );
    }
  }
}

app.put("/", async (req) => {
  const uuid = v4.generate();
  const language = req.headers.get("X-Language");
  const path = `pastes/${uuid}`;
  const file = await Deno.open(path, { create: true, write: true });
  let total = 0;
  const hash = createHash("sha1");
  if (language) {
    hash.update(language + "\n");
  }
  try {
    for await (const chunk of Deno.iter(req.body)) {
      let bytes = 0;
      try {
        checkSpace(maxSize, usedSpace + total + chunk.length);
      } catch (err) {
        file.close();
        await Deno.remove(path);
        return req.respond({ status: 400, body: "File too large" });
      }
      while (bytes < chunk.length) {
        const subchunk = chunk.subarray(bytes);
        bytes += await file.write(subchunk);
        hash.update(subchunk);
      }
      total += bytes;
    }
    usedSpace += total;
    file.close();
    const id = encode(new Uint8Array(hash.digest()));
    const idPath = `pastes/${id}`;
    const stats = await Deno.stat(idPath).catch(() => null);
    if (stats) {
      await Deno.remove(path);
      usedSpace -= stats.size;
      return req.respond({ status: 400, body: "File already exists: " + id });
    }
    await Deno.rename(path, idPath);
    await Deno.writeTextFile(`pastes/meta/${id}`, JSON.stringify({ language }));
    return req.respond({
      body: id + " " + String(total),
    });
  } catch (err) {
    file.close();
    await Deno.remove(path);
    req.conn.close();
  }
});

app.get(
  "/js/app.js",
  (req) => req.respond({ ...defaultStaticOpts(req.url), body: js }),
);

app.static("/js/dts", staticFiles.dts);

app.static("/vs", await editor);

app.get("/r", async (req) => {
  while (true) {
    for await (const de of Deno.readDir("pastes")) {
      if (Math.random() < 0.001) {
        const uuid = de.name;
        return req.respond(
          { status: 302, headers: new Headers({ Location: "/" + uuid }) },
        );
      }
    }
  }
});

app.get("/t/:id", async (req) => {
  try {
    const path = `pastes/thumbs/${req.params.id.split(".")[0]}`;
    const file = await Deno.open(path);
    await req.respond({
      headers: new Headers({ "Content-Type": "image/png" }),
      body: file,
    });
    await req.done;
    return file.close();
  } catch (err) {
    console.error(err.message);
    return req.respond({ status: 404 });
  }
});

app.get("/:id", async (req) => {
  const metadata = JSON.parse(
    await Deno.readTextFile(`pastes/meta/${req.params.id}`)
      .catch(() => JSON.stringify({ language: "plaintext" })),
  ) as { language: string };
  if (req.headers.get("Accept")?.includes("html")) {
    const data = {
      ...metadata,
      image: req.params.id,
    };
    return req.respond({
      body: new TextDecoder().decode(index).replace(
        /\{(\w+)\}/g,
        (_, name: keyof typeof data) => data[name],
      ),
    });
  }
  try {
    const file = await Deno.open(`pastes/${req.params.id.split(".")[0]}`);
    await req.respond({
      headers: new Headers({
        "Content-Type": mime(metadata.language),
      }),
      body: file,
    });
    await req.done;
    return file.close();
  } catch {
    return req.respond({ status: 404 });
  }
});

app.get(
  "/",
  (req) => {
    const data = {
      language: "plaintext",
      image: "unknown",
    };
    return req.respond({
      body: new TextDecoder().decode(index).replace(
        /\{(\w+)\}/g,
        (_, name: keyof typeof data) => data[name],
      ),
    });
  },
);
