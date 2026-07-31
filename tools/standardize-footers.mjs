import fs from "node:fs/promises";
import path from "node:path";
import { standardFooterCss, standardFooterHtml } from "./footer-template.mjs";

const root = process.cwd();
const excluded = new Set(["node_modules", ".git"]);

async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (excluded.has(entry.name)) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(target));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(target);
  }
  return files;
}

const styleTag = `<style id="acl-standard-footer-styles">${standardFooterCss}</style>`;
async function writeWithRetry(file, html) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await fs.writeFile(file, html, "utf8");
      return;
    } catch (error) {
      if (attempt === 4 || !["EBUSY", "EPERM", "UNKNOWN"].includes(error.code)) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }
}

let updated = 0;
for (const file of await htmlFiles(root)) {
  let html = await fs.readFile(file, "utf8");
  const footers = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/gi)];
  if (!footers.length || !/<\/head>/i.test(html)) continue;
  let footerIndex = 0;
  html = html.replace(/<footer\b[\s\S]*?<\/footer>/gi, () => footerIndex++ === 0 ? standardFooterHtml : "");
  html = html.replace(/<style id="acl-standard-footer-styles">[\s\S]*?<\/style>\s*/gi, "");
  if (!html.includes(".acl-standard-footer{")) html = html.replace(/<\/head>/i, `${styleTag}\n</head>`);
  await writeWithRetry(file, html);
  updated++;
}

console.log(`Standardized ${updated} HTML footers.`);
