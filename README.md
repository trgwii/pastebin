# Pastebin server

## Keyboard shortcuts

```
Ctrl+S - Save / create a paste
Ctrl+Shift+F - Fork an existing paste
Ctrl+L - Set language / syntax highlighting
```

## API

Do a PUT-request to root (/) with the entire paste data as the request body.

Server will respond with:

`<uuid> <bytes>`

Your paste will be available on:

`http://<server>/<uuid>`

## Docker

For building and running with Docker Compose, use:
```sh
docker-compose build && docker-compose up
```

Alternatively, for building and running with Docker only, use:
```sh
docker build --build-arg TRGWII_DENO_PASTEBIN_SERVE=https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts -f Dockerfile -t trgwii/deno-pastebin . && docker run --name trgwii_deno_pastebin --restart=unless-stopped -p 8080:8080 -v `pwd`/pastes:/deno-dir/pastes -it trgwii/deno-pastebin
```
