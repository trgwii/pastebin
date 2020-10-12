"use strict";

const { execSync } = require("child_process");

const { join } = require("path");
const { promises: fs } = require("fs");

(async () => {
  if (
    await fs.stat(join(__dirname, "node_modules")).then(() => false, () => true)
  ) {
    execSync("npm i puppeteer", { stdio: "inherit" });
    await fs.unlink(join(__dirname, "package-lock.json"));
  }

  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  const pastes = join(__dirname, "pastes");
  const thumbs = join(__dirname, "thumbs");

  await fs.mkdir(thumbs).catch(() => {});

  for await (const ent of await fs.opendir(pastes)) {
    const { name } = ent;
    if (name.split(".").length > 1) {
      continue;
    }
    const thumbName = `${name}.png`;
    const thumb = join(thumbs, thumbName);
    if (await fs.stat(thumb).catch(() => false)) {
      continue;
    }
    console.log(`generating ${name}.png`);
    await page.goto("http://127.0.0.1:8080/" + name);

    await page.screenshot({ path: thumb });
  }
  await browser.close();
})();
