import type { ServerRequest } from "https://deno.land/std@0.70.0/http/server.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.70.0/testing/asserts.ts";
import {
  defaultCatcher,
  defaultHandler,
  defaultStaticOpts,
  ensure,
  matchUrl,
  params,
} from "./router.ts";

Deno.test("[router matchUrl] basic usage", () => {
  assert(matchUrl("/", "/foo/bar"));
  assert(!matchUrl("/bar", "/foo/bar"));
});

Deno.test("[router params] basic usage", () => {
  assertEquals(params("/foo/:bar", "/foo/meme42"), { bar: "meme42" });
  assertEquals(
    params("/:foo/:bar/:baz", "/foo/meme42/boiiiii"),
    { foo: "foo", bar: "meme42", baz: "boiiiii" },
  );
});

Deno.test("[router defaultHandler] basic usage", () => {
  defaultHandler(
    {
      method: "GET",
      url: "/",
      respond: async (r: Response) => {
        assertEquals(r, { status: 404, body: "Cannot GET /" });
      },
    } as unknown as ServerRequest & { params: Record<string, string> },
    () => {},
  );
});

Deno.test("[router defaultCatcher] basic usage", () => {
  defaultCatcher("meme", {
    respond: async (r: Response) => {
      assertEquals(r, {
        status: 500,
        body: "Unhandled error:\nmeme",
      });
    },
  } as unknown as ServerRequest, () => {});
});

Deno.test("[router defaultStaticOpts] basic usage", () => {
  assertEquals(defaultStaticOpts("/foo/bar"), {
    headers: new Headers({
      "Content-Type": "application/octet-stream",
      "Cache-Control": "public, max-age=2592000",
    }),
  });
});

Deno.test("[router ensure] basic usage", () => {
  const x = { foo: "bar" };
  ensure(x, "bar", "baz");
  assertEquals(x, { foo: "bar", bar: "baz" });
});
