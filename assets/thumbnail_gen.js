// deno-lint-ignore-file
"use strict";

const { execSync } = require("child_process");

const { join } = require("path");
const { promises: fs } = require("fs");

const [port, timeout, url] = process.argv.slice(2);

(async () => {
  if (
    await fs.stat(join(__dirname, "..", "..", "node_modules")).then(
      () => false,
      () => true,
    )
  ) {
    execSync("npm init -y", { stdio: "inherit" });
    execSync("npm i puppeteer", { stdio: "inherit" });
    await fs.unlink(join(__dirname, "..", "..", "package-lock.json"))
      .catch(() => {});
    await fs.unlink(join(__dirname, "..", "..", "package.json"))
      .catch(() => {});
  }

  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    acceptInsecureCerts: true,
    args: [
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--enable-features=NetworkService",
    ],
  });

  const page = await browser.newPage();

  const pastes = join(__dirname, "..", "meta");
  const thumbs = __dirname;

  await fs.mkdir(thumbs).catch(() => {});

  const forever = true;
  while (forever) {
    for await (const ent of await fs.opendir(pastes)) {
      if (!ent.isFile()) {
        continue;
      }
      const { language } = JSON.parse(
        await fs.readFile(join(pastes, ent.name), "utf8"),
      );
      const name = ent.name.split(".")[0];
      const thumbName = `${name}`;
      const thumb = join(thumbs, thumbName);
      if (await fs.stat(thumb).catch(() => false)) {
        continue;
      }
      console.log(`generating thumbnail: ${name}`);
      await page.goto(`${url}:${port}/${name}.${language}`);

      await page.screenshot({ type: "png", path: thumb });
    }
    await new Promise((resolve) => setTimeout(resolve, Number(timeout)));
  }
  await browser.close();
})();
