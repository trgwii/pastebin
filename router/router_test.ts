import { assert } from "https://deno.land/std@0.70.0/testing/asserts.ts";
import { matchUrl } from "./router.ts";

Deno.test("[router matchUrl] basic usage", () => {
  assert(matchUrl("/", "/foo/bar"));
  assert(!matchUrl("/bar", "/foo/bar"));
});
