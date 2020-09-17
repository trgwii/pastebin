# Until official deno image is available
FROM hayd/alpine-deno AS cache

WORKDIR /deno-dir/

ARG TRGWII_DENO_PASTEBIN_SERVE
ENV TRGWII_DENO_PASTEBIN_SERVE=${TRGWII_DENO_PASTEBIN_SERVE}

RUN deno cache ${TRGWII_DENO_PASTEBIN_SERVE}

EXPOSE 8080

CMD deno run --allow-net --allow-read=pastes --allow-write=pastes ${TRGWII_DENO_PASTEBIN_SERVE}
