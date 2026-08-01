import fs from "node:fs/promises";
import path from "node:path";
import { standardHeaderCss, standardHeaderHtml } from "./header-template.mjs";

const root = process.cwd();
const skip = new Set(["google391ef8e1dc0dcd5c.html"]);
const headerPattern = /<header\b[^>]*>[\s\S]*?<\/header>/i;
const firstHeaderTagPattern = /<header\b[^>]*>/i;
const cssBlock = `<style id="acl-standard-header-styles">${standardHeaderCss}</style>`;
let updated = 0;
let insertedBeforeHero = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", "node_modules", ".agents", ".codex"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

for (const file of await walk(root)) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (skip.has(relative)) continue;
  let html = await fs.readFile(file, "utf8");
  const firstTag = html.match(firstHeaderTagPattern)?.[0] || "";
  if (!firstTag) continue;

  if (html.includes('id="acl-standard-header-styles"')) {
    html = html.replace(/<style id="acl-standard-header-styles">[\s\S]*?<\/style>/i, cssBlock);
  } else {
    html = html.replace(/<\/head>/i, `${cssBlock}\n</head>`);
  }

  if (/class=["'][^"']*\btool-header\b/i.test(firstTag)) {
    html = html.replace(firstHeaderTagPattern, `${standardHeaderHtml}\n$&`);
    insertedBeforeHero++;
  } else {
    html = html.replace(headerPattern, standardHeaderHtml);
  }

  await fs.writeFile(file, html, "utf8");
  updated++;
}

console.log(`Applied the standard header to ${updated} HTML pages; preserved ${insertedBeforeHero} leading tool hero header(s).`);
