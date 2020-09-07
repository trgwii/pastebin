# Bundling Monaco for pastebin

```sh
deno install -f --allow-read=. --allow-write=. -n bundler https://git.rory.no/trgwii/Bundler/raw/branch/master/bundler.ts
rm -rf node_modules
rm package-lock.json
npm i --production monaco-editor
bundler compress node_modules/monaco-editor/min/vs public/monaco-editor.bin
rm -rf node_modules
rm package-lock.json
```

```batch
deno install -f --allow-read=. --allow-write=. -n bundler https://git.rory.no/trgwii/Bundler/raw/branch/master/bundler.ts
rmdir /S /Q node_modules
del package-lock.json
npm i --production monaco-editor
bundler compress node_modules/monaco-editor/min/vs public/monaco-editor.bin
rmdir /S /Q node_modules
del package-lock.json
```
