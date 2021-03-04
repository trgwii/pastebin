import { parse, stringify } from "./deps.ts";

const args = Deno.args.filter((arg) => !arg.startsWith("-c"));

const configPath = Deno.args.find((arg) => arg.startsWith("-c"))
  ?.split("=")
  ?.[1];

const defaults = {
  port: Number(args[0] ?? 8080),
  hostname: args[1] ?? "127.0.0.1",
  maxSize: Number(args[3] ?? 1073741824 /* 1GB */),
  nodeThumbnails: args[2]?.startsWith("thumbnails") ?? false,
  nodeThumbnailInterval: Number(args[2]?.split("=")?.[1] || 1000),
  httpsRedirect: 0,
  certFile: "",
  keyFile: "",
};

export const config = {
  ...defaults,
  ...configPath
    ? parse(
      await Deno.readTextFile(configPath).catch(() => ""),
    )
    : {},
};

if (configPath) {
  await Deno.writeTextFile(configPath, stringify(config)).catch(() => {});
}
