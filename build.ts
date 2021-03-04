// deno run -A build.ts all

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
  await exec([
    ...bundler,
    "compress",
    "node_modules/monaco-editor/min/vs",
    "monaco-editor.bin",
  ]);
  await rm("monaco-editor.bin.ts");
  await rm("monaco-editor.b.ts");
  await exec([
    ...bundler,
    "ts-bundle",
    "monaco-editor.bin",
    "monaco-editor.b.ts",
  ]);
  await monacoCleanup();
};

const assets = async () => {
  await rm("assets.bin");
  await exec([...bundler, "compress", "assets", "assets.bin"]);
  await rm("assets.bin.ts");
  await rm("assets.b.ts");
  await exec([...bundler, "ts-bundle", "assets.bin", "assets.b.ts"]);
  await rm("assets.bin");
};

if (import.meta.main) {
  await reload(bundlerURL);
  await reload("./serve.ts");
  await reload("./deps_test.ts");
  await monaco();
  await assets();
  await exec(["deno", "fmt", "--ignore=deps,node_modules"]);
  await exec(["deno", "lint", "--unstable", "--ignore=deps,node_modules"]);
  await exec(["deno", "test"]);
}
