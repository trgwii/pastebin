import { Response } from "../deps.ts";
import type { bundle } from "../deps.ts";
import type { router } from "./router.ts";

export type staticOpts = ((path: string) => Response) | Response;

export const staticRoute = (
  path = "/",
  opts: staticOpts,
  app: (() => router) | router,
  bundle: bundle,
  index?: ((path: string) => Response) | Response,
): router => {
  if (typeof app === "function") {
    app = app();
  }
  if (bundle instanceof Uint8Array) {
    app.get(
      path,
      (req) =>
        req.respond(
          { ...(typeof opts === "function" ? opts(path) : opts), body: bundle },
        ),
    );
    return app;
  }
  if (index) {
    app.get(
      path,
      (req) => req.respond(typeof index === "function" ? index(path) : index),
    );
  }
  for (const [name, data] of Object.entries(bundle)) {
    staticRoute(`${path}/${name}`, opts, app, data);
  }
  return app;
};
