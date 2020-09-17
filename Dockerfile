# Until official deno image is available
FROM hayd/alpine-deno AS cache

WORKDIR /deno-dir/

RUN deno cache https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts

EXPOSE 8080
