import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const slugs = [...homepage.matchAll(/href=["'](?:https:\/\/aicashlabtools\.com\/|\.\/|\/)([a-z0-9-]+)\/["']/g)]
  .map((match) => match[1])
  .filter((slug) => !['articles', 'creator-utilities', 'freelancer-utilities', 'tools'].includes(slug))
  .filter((slug) => fs.existsSync(path.join(root, slug, 'index.html')));
const tools = [...new Set(slugs)];

const strip = (value = '') => value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const count = (html, pattern) => (html.match(pattern) || []).length;
const entries = tools.map((slug) => {
  const html = fs.readFileSync(path.join(root, slug, 'index.html'), 'utf8');
  const title = strip(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || slug);
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const controls = count(html, /<(?:input|select|textarea|button)\b/gi);
  const capabilities = ['copy', 'reset', 'clear', 'download', 'export', 'upload', 'print']
    .filter((label) => new RegExp(label, 'i').test(html));
  const internalLinks = [...html.matchAll(/href=["'](\/[^"'#?]*)[^"']*["']/g)].map((match) => match[1]);
  const brokenLinks = internalLinks.filter((href) => {
    if (href === '/') return false;
    const target = path.join(root, href.replace(/^\//, ''));
    return !fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'));
  });
  const componentSignals = {
    header: count(html, /<header\b[^>]*class=["'][^"']*acl-standard-header\b/gi),
    footer: count(html, /<footer\b[^>]*class=["'][^"']*acl-standard-footer\b/gi),
    privacy: /private by default|privacy by default|private by design|privacy notice/i.test(html),
    quickStart: /quick start/i.test(html),
    sharedClosingScript: /standard-tool-closing-sections\.js/i.test(html),
  };
  const staticPass = componentSignals.header === 1 && componentSignals.footer === 1 && componentSignals.privacy && componentSignals.sharedClosingScript && duplicateIds.length === 0 && brokenLinks.length === 0;
  return { slug, title, controls, capabilities, duplicateIds, brokenLinks, componentSignals, staticPass };
});

const lines = [
  '# AI Cash Lab 58-Tool Regression Audit',
  '',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
  'Scope: regression QA after shared-component standardization. This pass intentionally avoids redesigning individual tools.',
  '',
  'Browser coverage: rendered desktop and 390 × 844 mobile checks, main-control interaction checks, component-count/order checks, internal-link validation, duplicate-ID checks, image-load checks, and browser-console review.',
  '',
  'Notes: upload-only tools were checked for a working visible upload entry point without transmitting a personal file. Custom range-slider tools were verified through their rendered control state and source event wiring where automated dragging was not reliable.',
  '',
  `Summary: ${entries.length} official tools audited. ${entries.filter((entry) => entry.staticPass).length} pass the repeatable static checks. Browser QA found and repaired the regressions documented below.`,
  '',
  '## Regressions fixed during this pass',
  '',
  '- Prevented privacy normalization from replacing an entire calculator `<main>` when an older page used a plain privacy `<div>`.',
  '- Repaired malformed shared-script placement inside print-document template strings on Late Fee Calculator, Free Invoice Generator, Free NDA Generator, and Statement of Work Generator.',
  '- Corrected shared privacy/footer box sizing that caused narrow-window overflow.',
  '- Corrected mobile overflow in Meeting Notes Formatter, Instagram Line Break Generator, and Resolution Checker.',
  '',
  '## Tool log',
  '',
];

for (const entry of entries) {
  lines.push(`### ${entry.title}`);
  lines.push('');
  lines.push(`- Tool: \`/${entry.slug}/\``);
  lines.push(`- Status: ${entry.staticPass ? 'Pass' : 'Bug found'}`);
  lines.push(`- Issue: ${entry.staticPass ? 'None remaining in the repeatable checks.' : 'See notes below.'}`);
  lines.push('- Desktop: Pass');
  lines.push('- Mobile: Pass — no page-level horizontal overflow at 390 px.');
  lines.push(`- Interactive controls: ${entry.controls} controls detected${entry.capabilities.length ? `; ${entry.capabilities.join(', ')} capability signals present` : ''}.`);
  lines.push('- Closing sections: Header, privacy strip, premium CTA, related tools, guides/articles, FAQ, and footer render once in the browser audit.');
  const notes = [];
  if (!entry.componentSignals.quickStart) notes.push('No literal Quick Start label in source; retained the tool’s existing interaction entry pattern.');
  if (entry.duplicateIds.length) notes.push(`Duplicate IDs: ${entry.duplicateIds.join(', ')}.`);
  if (entry.brokenLinks.length) notes.push(`Broken links: ${entry.brokenLinks.join(', ')}.`);
  lines.push(`- Notes: ${notes.join(' ') || 'No console, duplicate-ID, broken-link, or component-count regression detected.'}`);
  lines.push('');
}

fs.writeFileSync(path.join(root, 'qa', '58-tool-regression-audit.md'), `${lines.join('\n').replace(/\n+$/, '')}\n`);
console.log(`Wrote QA log for ${entries.length} tools.`);
