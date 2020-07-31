import { serve, ServerRequest, v4 } from "./deps.ts";
import { router, next } from "./router.ts";
import { apply, index } from "./vs.ts";

// deno run --allow-net --allow-read=public,node_modules/monaco-editor/min,pastes --allow-write=pastes serve.ts
// deno install -f -n pastebin-server --allow-net --allow-read=pastes --allow-write=pastes https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts

try {
  await Deno.mkdir('pastes');
} catch (err) {}

const app = router(serve({ port: 8081 }));

const log = (req: ServerRequest, next: next) => {
  console.log(req.method + " " + req.url);
  return next();
};

app.get("/", log);
app.put('/', log);

app.put(
  "/",
  async (req) => {
    const uuid = v4.generate();
    const file = await Deno.open(
      `pastes/${uuid}`,
      { create: true, write: true },
    );
    return req.respond({
      body: uuid + " " + String(await Deno.copy(req.body, file)),
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
