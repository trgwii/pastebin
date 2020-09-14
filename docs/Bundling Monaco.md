# Bundling Monaco for pastebin

```
deno install -f --allow-read --allow-write -n bundler https://git.rory.no/trgwii/Bundler/raw/branch/master/bundler.ts

npm i --production monaco-editor

# linux
rm monaco-editor.bin.ts
# windows
del monaco-editor.bin.ts

bundler compress node_modules/monaco-editor/min/vs monaco-editor.bin

bundler ts-bundle monaco-editor.bin monaco-editor.bin.ts


# linux
rm monaco-editor.bin
rm package-lock.json
rm -rf node_modules


# windows
del monaco-editor.bin
del package-lock.json
rmdir /S /Q node_modules
```
