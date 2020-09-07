# Bundling Monaco for pastebin

```batch
rmdir /S /Q node_modules
del package-lock.json
npm i --production monaco-editor
deno run --allow-read=node_modules/monaco-editor/min/vs --allow-write=public/monaco-editor.bin router/static_bundle.ts node_modules/monaco-editor/min/vs public/monaco-editor.bin
rmdir /S /Q node_modules
del package-lock.json
```