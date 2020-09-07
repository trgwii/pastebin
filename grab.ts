export const grab = (path: string, cwd = import.meta.url) => {
  const url = new URL(path, cwd);
  return url.protocol === "file:" ? Deno.readFile(url) : (fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => new Uint8Array(data)));
};
