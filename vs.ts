import type { router } from "./router.ts";
export const staticSingle = (
  app: router,
  path: string | RegExp,
  type: string,
  data: string | Uint8Array | Deno.Reader | undefined,
) =>
  app.get(
    path,
    (req) =>
      req.respond(
        {
          headers: new Headers(
            {
              "Content-Type": type,
              "Cache-Control": "public, max-age=2592000",
            },
          ),
          body: data,
        },
      ),
  );

export const require = (path: string) => {
  const url = new URL(path, import.meta.url);
  return url.protocol === "file:" ? Deno.readFile(url) : (fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => new Uint8Array(data)));
};

const m = "node_modules/monaco-editor/min/";

export const index = await require("public/index.html");

const mime = (x: string) =>
  x === "js"
    ? "application/javascript"
    : x === "css"
    ? "text/css"
    : x === "ttf"
    ? "font/ttf"
    : "application/octet-stream";

export const apply = async (app: router) => {
  app.get("/vs", async (req) => {
    const ext = ((x) => x[x.length - 1])(req.url.split("."));
    const url = new URL(req.url.slice(1), new URL(m, import.meta.url));
    req.respond(
      {
        headers: new Headers({
          "Content-Type": mime(ext),
          "Cache-Control": "public, max-age=2592000",
        }),
        body: await Deno.open(url),
      },
    );
  });
  staticSingle(
    app,
    "/js/app.js",
    "application/javascript",
    await require("public/app.js"),
  );
  staticSingle(app, /^\/$/, "text/html", index);
};
