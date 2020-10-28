// deno run -A build.ts all

import { exec } from "./exec.ts";

const noop = () => {};

const rm = (path: string) => Deno.remove(path, { recursive: true }).catch(noop);

const monacoCleanup = () =>
  Promise.all([
    rm("node_modules"),
    rm("package-lock.json"),
    rm("package.json"),
    rm("monaco-editor.bin"),
  ]);

const monaco = async () => {
  await monacoCleanup();
  await exec(["npm", "install", "--production", "monaco-editor"]);
  await exec([
    "bundler",
    "compress",
    "node_modules/monaco-editor/min/vs",
    "monaco-editor.bin",
  ]);
  await rm("monaco-editor.bin.ts");
  await rm("monaco-editor.b.ts");
  await exec([
    "bundler",
    "ts-bundle",
    "monaco-editor.bin",
    "monaco-editor.b.ts",
  ]);
  await monacoCleanup();
};

const assets = async () => {
  await rm("assets.bin");
  await exec(["bundler", "compress", "assets", "assets.bin"]);
  await rm("assets.bin.ts");
  await rm("assets.b.ts");
  await exec(["bundler", "ts-bundle", "assets.bin", "assets.b.ts"]);
  await rm("assets.bin");
};

if (import.meta.main) {
  await monaco();
  await assets();
  await exec(["deno", "fmt"]);
  await exec(["deno", "lint", "--unstable"]);
  await exec(["deno", "test"]);
}
