import type {
  Response,
  Server,
  ServerRequest,
} from "../deps.ts";
import { mime } from "./mime.ts";
import { bundle } from "./static_bundle.ts";
import { staticOpts, staticRoute } from "./static_router.ts";

const replaceParams = (path: string) =>
  new RegExp(
    "^/" +
      new URL(path, "http://localhost").pathname.split("/").slice(1).map((x) =>
        x.startsWith(":") ? "[^/]+" : x
      ).join("/"),
  );

export const matchUrl = (path: string | RegExp, req: string) =>
  path instanceof RegExp ? path.test(req) : replaceParams(path).test(req);

export const params = (
  path: string,
  url: string,
): Record<string, string> => {
  const keys = new URL(path, "http://localhost").pathname.split("/").slice(1);
  const values = new URL(url, "http://localhost").pathname.split("/").slice(1);
  return Object.fromEntries(
    keys.flatMap((key, i) =>
      key.startsWith(":") ? [[key.slice(1), values[i]]] : []
    ),
  );
};

export type next = () => void;
export type handler = (
  req: ServerRequest & { params: Record<string, string> },
  next: next,
) => void;
export type handlers = Record<string, [string | RegExp, handler][]>;
export type catcher = (err: unknown, req: ServerRequest) => void;
export type methods =
  | "get"
  | "head"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace"
  | "patch";
export type router =
  & Record<
    methods,
    (path: string | RegExp, handler: handler) => router
  >
  & {
    static: (
      path: string,
      bundle: bundle,
      opts?: staticOpts,
    ) => router;
    catch: (catcher: catcher) => router;
  };

export const defaultHandler: handler = (req) =>
  req.respond({ status: 404, body: `Cannot ${req.method} ${req.url}` });

export const defaultCatcher: catcher = (err, req) => {
  console.error("Unhandled error:", err);
  return req.respond({ status: 500, body: "Unhandled error:\n" + String(err) });
};

export const defaultStaticOpts = (path: string): Response => ({
  headers: new Headers({
    "Content-Type": mime(path.split(".").pop()!),
    "Cache-Control": "public, max-age=2592000",
  }),
});

export const handle = async (
  handlers: handlers,
  catchers: catcher[],
  req: ServerRequest,
  n = 0,
) => {
  if (req.method in handlers) {
    const methodHandlers = handlers[req.method];
    const pair = [
      ...methodHandlers,
      ["/", defaultHandler] as const,
    ].slice(n)
      .find((
        [path],
      ) => matchUrl(path, req.url));
    const [path, handler] = pair!;
    try {
      await handler(
        Object.assign(
          req,
          { params: typeof path === "string" ? params(path, req.url) : {} },
        ),
        () => handle(handlers, catchers, req, n + 1),
      );
    } catch (err) {
      for (const catcher of [...catchers, defaultCatcher]) {
        try {
          await catcher(err, req);
          break;
        } catch (err) {
          continue;
        }
      }
    }
  }
};

export const mainLoop = (server: Server) => {
  const handlers: handlers = {};
  const catchers: catcher[] = [];
  (async () => {
    for await (const req of server) {
      handle(handlers, catchers, req);
    }
  })();
  return { handlers, catchers };
};

export const ensure = <T>(obj: Record<string, T>, key: string, val: T) =>
  obj[key] = obj[key] ?? val;

export const addRoute = <T>(
  method: string,
  handlers: handlers,
  f: () => T,
): (path: string | RegExp, handler: handler) => T =>
  (path, handler) => {
    ensure(handlers, method, []);
    handlers[method].push([path, handler]);
    return f();
  };

export const router = (server: Server) => {
  const { handlers, catchers } = mainLoop(server);
  const self = () => r;
  const r: router = {
    get: addRoute("GET", handlers, self),
    head: addRoute("HEAD", handlers, self),
    post: addRoute("POST", handlers, self),
    put: addRoute("PUT", handlers, self),
    delete: addRoute("DELETE", handlers, self),
    connect: addRoute("CONNECT", handlers, self),
    options: addRoute("OPTIONS", handlers, self),
    trace: addRoute("TRACE", handlers, self),
    patch: addRoute("PATCH", handlers, self),
    static: (
      path: string,
      bundle: bundle,
      opts: staticOpts = defaultStaticOpts,
    ) => staticRoute(path, opts, self, bundle),
    catch: (catcher: catcher) => {
      catchers.push(catcher);
      return self();
    },
  };
  return r;
};
