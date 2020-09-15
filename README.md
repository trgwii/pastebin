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

For running with Docker, use:
```sh
docker run --name trgwii_deno_pastebin --restart=unless-stopped -p 8080:8080 -v ~/pastes:/deno-dir/pastes -it hayd/alpine-deno run --allow-net --allow-read=pastes --allow-write=pastes https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts
```

For running with Docker Compose, use:
```sh
docker-compose up
```
