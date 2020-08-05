import { serve, ServerRequest, v4 } from "./deps.ts";
import { next, router } from "./router.ts";
import { apply, index } from "./vs.ts";

// deno run --allow-net --allow-read=public,node_modules/monaco-editor/min,pastes --allow-write=pastes serve.ts
// deno install -f -n pastebin-server --allow-net --allow-read=pastes --allow-write=pastes https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts

try {
  await Deno.mkdir("pastes");
} catch {
  void 0;
}

const spaceLimit = Number(Deno.args[1] ?? 1073741824 /* 1GB */);
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

const app = router(serve({ port: Number(Deno.args[0] ?? 8080) }));

const log = (req: ServerRequest, next: next) => {
  console.log(req.method + " " + req.url);
  return next();
};

app.get("/", log);
app.put("/", log);

app.put(
  "/",
  async (req) => {
    const uuid = v4.generate();
    const file = await Deno.open(
      `pastes/${uuid}`,
      { create: true, write: true },
    );
    let total = 0;
    for await (const chunk of Deno.iter(req.body)) {
      let bytes = 0;
      try {
        checkSpace(spaceLimit, usedSpace + total + chunk.length);
      } catch (err) {
        file.close();
        await Deno.remove(`pastes/${uuid}`);
        return req.respond({ status: 400, body: "File too large" });
      }
      while (bytes < chunk.length) {
        bytes += await file.write(chunk.subarray(bytes));
      }
      total += bytes;
    }
    usedSpace += total;
    file.close();
    return req.respond({
      body: uuid + " " + String(total),
    });
  },
);

app.get(
  /^\/[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}(\.\w+)?$/,
  async (req) => {
    if (req.headers.get("Accept")?.includes("html")) {
      return req.respond({ body: index });
    }
    const file = await Deno.open(`pastes/${req.url.slice(1)}`);
    return req.respond({ body: file });
  },
);
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

apply(app);
