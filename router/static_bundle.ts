export type bundle = number[] | { [k: string]: bundle };

export const grab = (path: string, cwd = import.meta.url) => {
  const url = new URL(path, cwd);
  return url.protocol === "file:" ? Deno.readFile(url) : (fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => new Uint8Array(data)));
};

export const bundle = async (path: string): Promise<bundle> => {
  const stat = await Deno.stat(path);
  if (stat.isSymlink) {
    throw new TypeError("Symlinks not implemented");
  }
  if (stat.isFile) {
    return [...await Deno.readFile(path)];
  }
  if (stat.isDirectory) {
    const res: bundle = {};
    for await (const ent of Deno.readDir(path)) {
      res[ent.name] = await bundle(`${path}/${ent.name}`);
    }
    return res;
  }

  throw new TypeError("Unknown stat object");
};

export const save = async (path: string, bundle: bundle) =>
  Deno.writeFile(path, new TextEncoder().encode(JSON.stringify(bundle)));

export const load = async (
  path: string,
  cwd = import.meta.url,
): Promise<bundle> =>
  JSON.parse(new TextDecoder().decode(await grab(path, cwd)));

if (import.meta.main) {
  const [inputDir, outFile] = Deno.args;
  await save(outFile, await bundle(inputDir));
}
