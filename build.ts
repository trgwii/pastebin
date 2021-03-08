// deno run -A build.ts all

import { readerFromStreamReader } from "https://deno.land/std@0.89.0/io/streams.ts";

import { exec } from "./exec.ts";

const noop = () => {};

const bundlerURL =
  "https://raw.githubusercontent.com/trgwii/bundler/master/bundler.ts";

const bundler = [
  "deno",
  "run",
  "--allow-read=.",
  "--allow-write=.",
  bundlerURL,
];

const rm = (path: string) => Deno.remove(path, { recursive: true }).catch(noop);

const reload = (path: string) => exec(["deno", "cache", "--reload", path]);

const monacoCleanup = () =>
  Promise.all([
    rm("node_modules"),
    rm("package-lock.json"),
    rm("package.json"),
    rm("monaco-editor.bin"),
  ]);

const monaco = async () => {
  await monacoCleanup();
  await exec(["npm", "init", "-y"]);
  await exec(["npm", "install", "--production", "monaco-editor"]);
  await rm("monaco-editor.b.ts");
  await exec([
    ...bundler,
    "ts-bundle",
    "node_modules/monaco-editor/min/vs",
    "monaco-editor.b.ts",
  ]);
  await Deno.copyFile(
    "node_modules/monaco-editor/monaco.d.ts",
    "assets/public/dts/lib.monaco.d.ts",
  );
  await monacoCleanup();
};

const assets = async () => {
  await rm("assets.b.ts");
  await exec([...bundler, "ts-bundle", "assets", "assets.b.ts"]);
  await rm("assets.bin");
};

if (import.meta.main) {
  await reload(bundlerURL);
  await Deno.mkdir("assets/public/dts", { recursive: true }).catch(() => {});
  await exec(["deno", "types", ">", "assets/public/dts/lib.deno.d.ts"]);
  const file = await Deno.open("assets/public/dts/lib.dom.d.ts", {
    create: true,
    write: true,
    truncate: true,
  });
  await Deno.copy(
    readerFromStreamReader((await fetch(
      "https://raw.githubusercontent.com/microsoft/TypeScript/master/lib/lib.dom.d.ts",
    )).body!.getReader()),
    file,
  );
  file.close();
  await reload("./serve.ts");
  await reload("./deps_test.ts");
  await monaco();
  await assets();
  await exec(["deno", "fmt", "--ignore=deps,node_modules"]);
  await exec([
    "deno",
    "lint",
    "--unstable",
    "--ignore=deps,node_modules,assets/public/dts",
  ]);
  await exec(["deno", "test"]);
}
