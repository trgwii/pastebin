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

  const pastes = join(__dirname, "pastes", "meta");
  const thumbs = join(pastes, "..", "thumbs");

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
      const thumbName = `${name}.png`;
      const thumb = join(thumbs, thumbName);
      if (await fs.stat(thumb).catch(() => false)) {
        continue;
      }
      console.log(`generating ${name}.png`);
      await page.goto("http://127.0.0.1:8080/" + name + "." + language);

      await page.screenshot({ path: thumb, fullPage: true });
    }
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
  await browser.close();
})();
