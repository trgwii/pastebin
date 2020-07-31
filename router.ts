import type {
  Server,
  ServerRequest,
} from "./deps.ts";

export const matchUrl = (path: string | RegExp, req: string) =>
  path instanceof RegExp ? path.test(req) : req.startsWith(path);

export type next = () => void;
export type handler = (req: ServerRequest, next: next) => void;
export type handlers = Record<string, [string | RegExp, handler][]>;
export type catcher = (err: any, req: ServerRequest) => void;
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
  & { catch: (catcher: catcher) => void };

export const defaultHandler: handler = (req) =>
  req.respond({ status: 404, body: `Cannot ${req.method} ${req.url}` });

export const defaultCatcher: catcher = (err, req) => {
  console.error("Unhandled error:", err);
  return req.respond({ status: 500, body: "Unhandled error:\n" + String(err) });
};

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
      .find(([path]) => matchUrl(path, req.url));
    const [, handler] = pair!;
    try {
      await handler(req, () => handle(handlers, catchers, req, n + 1));
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
    catch: (catcher: catcher) => {
      catchers.push(catcher);
    },
  };
  return r;
};
