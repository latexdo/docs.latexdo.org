import { cp, mkdir, rm } from "node:fs/promises";

const rootDir = new URL("../", import.meta.url);
const distDir = new URL("../dist/", import.meta.url);

const staticEntries = [
  "index.html",
  "style.css",
  "site.js",
  "robots.txt",
  "sitemap.xml",
  "CNAME",
  ".nojekyll",
  "assets",
];

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const entry of staticEntries) {
  try {
    await cp(new URL(entry, rootDir), new URL(entry, distDir), {
      recursive: true,
    });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
