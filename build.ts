// deno run -A build.ts all

import { exec } from "./exec.ts";

const noop = () => {};

const rm = (path: string) => Deno.remove(path, { recursive: true }).catch(noop);

const monacoCleanup = () =>
  Promise.all([
    rm("node_modules"),
    rm("package-lock.json"),
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
  await exec([
    "bundler",
    "ts-bundle",
    "monaco-editor.bin",
    "monaco-editor.bin.ts",
  ]);
  await monacoCleanup();
};

const pub = async () => {
  await rm("public.bin");
  await exec(["bundler", "compress", "public", "public.bin"]);
  await rm("public.bin.ts");
  await exec(["bundler", "ts-bundle", "public.bin", "public.bin.ts"]);
  await rm("public.bin");
};

if (import.meta.main && Deno.args[0] && Deno.args[0].includes("all")) {
  await monaco();
  await pub();
} else {
  await exec(["deno", "fmt"]);
  await exec(["deno", "lint", "--unstable"]);
  await exec(["deno", "test", "--coverage", "--unstable"]);
}
