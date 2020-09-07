/*
root: 0 or 1 (file or dir)
	0:
		length of file buffer
			file buffer
	1:
		amount of entries
			length of name buffer
			name buffer
			root

deno run --allow-read=node_modules/monaco-editor/min/vs --allow-write=public/monaco-editor2.bin router/static_bundle2.ts bundle node_modules/monaco-editor/min/vs public/monaco-editor2.bin
deno run --allow-read=public/monaco-editor2.bin router/static_bundle2.ts load public/monaco-editor2.bin
*/

import { enc } from "../deps.ts";

export type bundle = Uint8Array | { [k: string]: bundle };

export const bundle = async (path: string, out: Deno.Writer): Promise<void> => {
  const stat = await Deno.stat(path);
  console.log("[bundle] starting", path);
  if (stat.isSymlink) {
    throw new TypeError("Symlinks not implemented");
  }
  if (stat.isFile) {
    console.log("[bundle] is file", path);
    await enc.writeVarnum(out, 0);
    await enc.writeVarnum(out, stat.size);
    await Deno.copy(await Deno.open(path), out);
  }
  if (stat.isDirectory) {
    console.log("[bundle] is dir", path);
    await enc.writeVarnum(out, 1);
    const entries: string[] = [];
    for await (const ent of Deno.readDir(path)) {
      entries.push(ent.name);
    }
    console.log("[bundle] dir has", entries.length, "entries");
    await enc.writeVarnum(out, entries.length);
    for await (const name of entries) {
      const nameBytes = new TextEncoder().encode(name);
      await enc.writeVarnum(out, nameBytes.byteLength);
      await Deno.writeAll(out, nameBytes);
      await bundle(`${path}/${name}`, out);
    }
  }
};

export const load = async (
  input: Deno.Reader,
): Promise<bundle> => {
  console.log("[load] starting");
  const isFile = (await enc.readVarnum(input)) === 0;
  if (isFile) {
    console.log("[load] is file");
    const length = await enc.readVarnum(input);
    console.log("[load] length", length);
    const data = await enc.getNBytes(input, length);
    return data;
  } else {
    console.log("[load] is dir");
    const entries = await enc.readVarnum(input);
    console.log("[load] dir has", entries, "entries");
    const res: { [k: string]: bundle } = {};
    for (let i = 0; i < entries; i++) {
      const nameLength = await enc.readVarnum(input);
      const name = new TextDecoder().decode(
        await enc.getNBytes(input, nameLength),
      );
      console.log("[load] entry:", name);
      res[name] = await load(input);
    }
    return res;
  }
};

if (import.meta.main) {
  const [mode, inputDir, outFile] = Deno.args;
  if (mode === "bundle") {
    const out = await Deno.open(outFile, { create: true, write: true });
    await bundle(inputDir, out);
    // out.close();
  } else if (mode === "load") {
    const data = await load(await Deno.open(inputDir));
    (function print(i, data) {
      if (!(data instanceof Uint8Array)) {
        for (const [k, v] of Object.entries(data)) {
          console.log(" ".repeat(i) + k);
          print(i + 1, v);
        }
      } else {
        console.log(new TextDecoder().decode(data.slice(0, 1000)));
      }
    })(0, data);
  }
}
