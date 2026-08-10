import fs from 'node:fs';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';

const runtimeRequire = createRequire('C:/Users/Katherine/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/runtime-loader.cjs');
const { chromium } = runtimeRequire('playwright');

const root = path.resolve(import.meta.dirname, '..');
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const requested = process.argv.slice(2);
const slugs = [...new Set([...homepage.matchAll(/href=["'](?:https:\/\/aicashlabtools\.com\/|\.\/|\/)([a-z0-9-]+)\/["']/g)]
  .map((match) => match[1])
  .filter((slug) => !['articles', 'creator-utilities', 'freelancer-utilities'].includes(slug))
  .filter((slug) => fs.existsSync(path.join(root, slug, 'index.html')))
  .filter((slug) => !requested.length || requested.includes(slug)))];

const mime = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const target = path.resolve(root, `.${relative}`);
  if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, { 'content-type': mime[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });

const results = [];
for (const slug of slugs) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route(/googletagmanager|google-analytics|clarity\.ms/, (route) => route.abort());
  const consoleErrors = [];
  const failedResources = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400 && response.url().startsWith(`http://127.0.0.1:${port}/`)) failedResources.push(`${response.status()} ${response.url()}`); });
  await page.goto(`http://127.0.0.1:${port}/${slug}/`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(150);
  const data = await page.evaluate(() => {
    const visible = (element) => element && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
    const rect = (element) => element ? Object.fromEntries(['left', 'right', 'top', 'bottom', 'width', 'height'].map((key) => [key, Math.round(element.getBoundingClientRect()[key])])) : null;
    const quick = [...document.querySelectorAll('section,div,nav')].find((el) => visible(el) && /quick start/i.test(el.textContent || ''));
    const quickCandidates = [...document.querySelectorAll('.acl-quick-start,.cmpf-quick-start,section,nav')].filter((el) => visible(el) && /quick start/i.test(el.textContent || ''));
    const quickBest = quickCandidates.sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width).find((el) => el.getBoundingClientRect().width > 300) || quick;
    const privacy = document.querySelector('.acl-privacy-section');
    const premium = document.querySelector('.acl-premium-standard');
    const related = document.querySelector('.acl-related-standard');
    const guides = document.querySelector('.acl-guides-standard');
    const faq = document.querySelector('.acl-faq-standard');
    const footer = document.querySelector('footer');
    const header = document.querySelector('.acl-standard-header,header');
    const closing = [premium, related, guides, faq].filter(Boolean);
    const relatedLinks = related ? [...related.querySelectorAll('.acl-related-links > a')] : [];
    const guideLinks = guides ? [...guides.querySelectorAll('.acl-guides-grid > a')] : [];
    const sectionOrder = [premium, related, guides, faq, footer].filter(Boolean).map((el) => ({ name: el === premium ? 'premium' : el === related ? 'related' : el === guides ? 'guides' : el === faq ? 'faq' : 'footer', top: rect(el).top }));
    const quickRect = rect(quickBest), privacyRect = rect(privacy);
    const closingWidths = closing.map((el) => rect(el).width);
    const issues = [];
    if (!quickBest) issues.push('missing Quick Start');
    if (!privacy) issues.push('missing standardized privacy strip');
    if (quickRect && privacyRect && Math.abs(quickRect.width - privacyRect.width) > 3) issues.push(`Quick Start/privacy width mismatch (${quickRect.width}/${privacyRect.width})`);
    if (quickRect && privacyRect) { const gap = privacyRect.top - quickRect.bottom; if (gap < 8 || gap > 40) issues.push(`Quick Start/privacy spacing ${gap}px`); }
    if (closing.length !== 4) issues.push(`closing section count ${closing.length}/4`);
    if (closingWidths.length && Math.max(...closingWidths) - Math.min(...closingWidths) > 3) issues.push(`closing widths differ (${closingWidths.join('/')})`);
    if (sectionOrder.some((item, index) => index && item.top < sectionOrder[index - 1].top)) issues.push(`closing order ${sectionOrder.map((item) => item.name).join(' > ')}`);
    if (related && !related.querySelector('.acl-related-layout')) issues.push('malformed Related Tools layout');
    if (relatedLinks.length < 3 || relatedLinks.length > 6) issues.push(`Related Tools link count ${relatedLinks.length}`);
    if (relatedLinks.some((link) => link.textContent.replace(/\s+/g, ' ').trim().length > 48)) issues.push('verbose Related Tools button copy');
    if (guides && !guides.querySelector('.acl-guides-grid')) issues.push('malformed Guides layout');
    if (guideLinks.length < 4) issues.push(`Supporting Guides link count ${guideLinks.length}`);
    if (faq && !faq.querySelector('.acl-faq-grid,.faq-grid,[class*="faq-grid"]')) issues.push('malformed FAQ layout');
    if (header && !['static', 'relative'].includes(getComputedStyle(header).position)) issues.push(`header position ${getComputedStyle(header).position}`);
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) issues.push(`desktop horizontal overflow ${document.documentElement.scrollWidth - document.documentElement.clientWidth}px`);
    return { title: document.querySelector('h1')?.textContent.trim(), issues, quick: quickRect, privacy: privacyRect, closingWidths, sectionOrder, relatedLinks: relatedLinks.map((a) => a.textContent.replace(/\s+/g, ' ').trim()), guideCount: guideLinks.length };
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  const mobileOverflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  if (mobileOverflow > 2) data.issues.push(`mobile horizontal overflow ${mobileOverflow}px`);
  data.consoleErrors = [...new Set(consoleErrors)].filter((message) => !/clarity|google|favicon|Failed to load resource/i.test(message));
  data.failedResources = [...new Set(failedResources)].filter((message) => !/favicon\.ico/i.test(message));
  if (data.failedResources.length) data.issues.push(`${data.failedResources.length} failed local resource(s)`);
  if (data.consoleErrors.length) data.issues.push(`${data.consoleErrors.length} console error(s)`);
  results.push({ slug, ...data });
  await page.close();
}

await browser.close();
server.close();
const output = path.join(root, 'qa', 'standardization-regression-audit-current.json');
fs.writeFileSync(output, `${JSON.stringify(results, null, 2)}\n`);
console.log(`Audited ${results.length} tools; ${results.filter((result) => result.issues.length).length} flagged. Wrote ${path.relative(root, output)}.`);
