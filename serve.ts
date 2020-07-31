import { serve, v4 } from "./deps.ts";
import { router } from "./router.ts";
import { apply, index } from "./vs.ts";

// npm i monaco-editor
// deno run --allow-net --allow-read=public,node_modules/monaco-editor/min,app.js,pastes --allow-write=pastes serve.ts

const app = router(serve({ port: 8081 }));

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

app.get("/", (req, next) => {
  console.log(req.method + " " + req.url);
  return next();
});

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
