import { assertEquals } from "../deps_test.ts";
import { mime } from "./mime.ts";

Deno.test("[mime] basic usage", () => {
  assertEquals(mime("js"), "application/javascript");
  assertEquals(mime("css"), "text/css");
  assertEquals(mime("ttf"), "font/ttf");
  assertEquals(mime("unknown"), "application/octet-stream");
});
