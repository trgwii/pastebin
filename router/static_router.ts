import { Response } from "../deps.ts";
import type { router } from "./router.ts";
import type { bundle } from "./static_bundle.ts";

export type staticOpts = ((path: string) => Response) | Response;

export const staticRoute = (
  path: string = "/",
  opts: staticOpts,
  app: (() => router) | router,
  bundle: bundle,
  index?: ((path: string) => Response) | Response,
): router => {
  if (typeof app === "function") {
    app = app();
  }
  if (Array.isArray(bundle)) {
    const body = new Uint8Array(bundle);
    if (typeof opts === "function") {
      app.get(path, (req) => req.respond({ ...opts(path), body }));
      return app;
    }
    app.get(path, (req) => req.respond({ ...opts, body }));
    return app;
  }
  if (index) {
    if (typeof index === "function") {
      app.get(path, (req) => req.respond(index(path)));
    } else {
      app.get(path, (req) => req.respond(index));
    }
  }
  for (const [name, data] of Object.entries(bundle)) {
    staticRoute(`${path}/${name}`, opts, app, data);
  }
  return app;
};
