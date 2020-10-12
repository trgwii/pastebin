export const exec = (cmd: string[]) =>
  Deno.run({
    cmd: [
      ...Deno.build.os === "windows" ? ["cmd.exe", "/c"] : [],
      ...cmd,
    ],
  }).status();
