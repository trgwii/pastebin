import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";
import { decode } from "https://deno.land/std@0.74.0/encoding/ascii85.ts";
import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";
export default parse(
  decompress(
    decode(
      { standard: "Z85" },
    ),
  ),
);