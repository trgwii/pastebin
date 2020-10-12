import { createHash, encode, serve, v4 } from "./deps.ts";
import { exec } from "./exec.ts";
import editor from "./monaco-editor.bin.ts";
import pub from "./public.bin.ts";
import { defaultStaticOpts, router } from "./router/router.ts";

const staticFiles = await pub;

if (
  staticFiles instanceof Uint8Array ||
  !(staticFiles["index.html"] instanceof Uint8Array) ||
  !(staticFiles["app.js"] instanceof Uint8Array)
) {
  throw new TypeError("public.bin.ts: wrong format");
}

export const index = staticFiles["index.html"];
export const js = staticFiles["app.js"];

// deno run --allow-net --allow-read=pastes --allow-write=pastes serve.ts
// deno run --allow-net --allow-read=pastes --allow-write=pastes --allow-run serve.ts 8080 127.0.0.1 thumbnails
// deno install -f -n pastebin-server --allow-net --allow-read=pastes --allow-write=pastes serve.ts
// deno install -f -n pastebin-server --allow-net --allow-read=pastes --allow-write=pastes https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts

try {
  await Deno.mkdir("pastes/meta", { recursive: true });
} catch {
  void 0;
}

const spaceLimit = Number(Deno.args[3] ?? 1073741824 /* 1GB */);
let usedSpace = 0;

for await (const ent of Deno.readDir("pastes")) {
  usedSpace += (await Deno.stat(`pastes/${ent.name}`)).size;
}

const checkSpace = (limit: number, used: number) => {
  if (used >= limit) {
    throw new TypeError("Global space limit exceeded");
  }
};

checkSpace(spaceLimit, usedSpace);

const port = Number(Deno.args[0] ?? 8080);
const hostname = Deno.args[1] ?? "127.0.0.1";

const app = router(serve({ hostname, port }));

console.log(`Listening on ${hostname}:${port}`);

if (Deno.args[2] === "thumbnails") {
  if (await exec(["node", "-v"]).then((x) => x.success)) {
    exec(["node", "thumbnail_gen.js"]);
  } else {
    console.warn(
      "thumbnail support specified but node.js not installed, disabling thumbnails",
    );
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
  for await (const chunk of Deno.iter(req.body)) {
    let bytes = 0;
    try {
      checkSpace(spaceLimit, usedSpace + total + chunk.length);
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
  const id = encode(hash.digest());
  const idPath = `pastes/${id}`;
  const stats = await Deno.stat(idPath).catch(() => null);
  if (stats) {
    await Deno.remove(path);
    usedSpace -= stats.size;
    return req.respond({ status: 400, body: "File already exists: " + id });
  }
  await Deno.rename(path, idPath);
  await Deno.writeFile(
    `pastes/meta/${id}.json`,
    new TextEncoder().encode(JSON.stringify({ language })),
  );
  return req.respond({
    body: id + " " + String(total),
  });
});

app.get(
  "/js/app.js",
  (req) => req.respond({ ...defaultStaticOpts(req.url), body: js }),
);

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
    const file = await Deno.open(path + ".png");
    await req.respond({
      headers: new Headers({ "Content-Type": "image/png" }),
      body: file,
    });
    return file.close();
  } catch (err) {
    console.error(err.message);
    return req.respond({ status: 404 });
  }
});

app.get("/:id", async (req) => {
  if (req.headers.get("Accept")?.includes("html")) {
    const data = {
      ...JSON.parse(
        await Deno.readTextFile(`pastes/meta/${req.params.id}.json`),
      ) as { language: string },
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
    await req.respond({ body: file });
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
