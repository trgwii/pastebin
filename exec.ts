const prefix = Deno.build.os === "windows" ? ["cmd.exe", "/c"] : [];

export const exec = (cmd: string[]) =>
  Deno.run({ cmd: [...prefix, ...cmd] }).status();

export const run = (cmd: string[]) =>
  Deno.run({ cmd: [...prefix, ...cmd], stdout: "piped" });
