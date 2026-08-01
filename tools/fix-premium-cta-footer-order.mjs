import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const targets = [
  "instagram-line-break-generator/index.html",
  "linkedin-post-formatter/index.html",
  "meeting-notes-formatter/index.html",
  "teleprompter/index.html",
  "youtube-description-formatter/index.html"
];

const ctaPattern = /<section class="acl-content-os-cta no-print"[\s\S]*?<\/section>/i;
const footerPattern = /<footer class="acl-standard-footer no-print">/i;

for (const relative of targets) {
  const file = path.join(root, relative);
  let html = await fs.readFile(file, "utf8");
  const cta = html.match(ctaPattern)?.[0];
  const footerIndex = html.search(footerPattern);
  const ctaIndex = html.search(ctaPattern);

  if (!cta || footerIndex < 0) throw new Error(`Missing CTA or footer in ${relative}`);
  if (ctaIndex < footerIndex) {
    console.log(`Already ordered: ${relative}`);
    continue;
  }

  html = html.replace(ctaPattern, "");
  html = html.replace(footerPattern, `${cta}\n\n$&`);
  await fs.writeFile(file, html, "utf8");
  console.log(`Moved premium CTA above footer: ${relative}`);
}
