# Standardization Visual Regression Audit

Generated: 2026-08-10

This audit converts the defects found during manual QA into a repeatable rendered-page checklist. It supersedes visual approval claims in the earlier 58-tool report where those claims conflict with later manual screenshots.

## Manual-QA regression checklist

- Header is the standard static header and does not follow the page while scrolling.
- Hero, Quick Start, privacy strip, and calculator/tool shell share the intended page width.
- Quick Start and privacy strip have matching widths, standard typography, and visible breathing room.
- Desktop input and result columns begin on the same horizontal line unless the tool interaction intentionally differs.
- No unexplained empty column, missing sample state, missing preview, or removed tool control.
- Premium CTA, Related Tools, Supporting Guides, and FAQ match the calculator/tool-shell width.
- Closing order is Premium CTA, Related Tools, Supporting Guides, FAQ, then the standard footer.
- Premium CTA has one frame and one visible label/heading treatment.
- Related Tools uses concise tool-name buttons, a balanced grid, working internal links, and contextual section copy.
- Supporting Guides uses styled cards, contains the complete guide plus four supporting articles where the article set exists, and does not leave a sparse oversized container.
- FAQ uses the approved two-column card treatment and does not retain an incompatible legacy inner layout.
- No duplicated visible headings, labels, shared sections, header, or footer.
- No malformed raw links, misplaced sections, abnormal blank space, compressed content, low-contrast text, or desktop/mobile horizontal overflow.

## Current rendered audit

- Catalog pages tested: 58
- Desktop viewport: 1440 × 900
- Mobile viewport: 390 × 844
- Pages with a remaining checklist flag: 0
- Machine-readable results: `qa/standardization-regression-audit-current.json`
- Reusable runner: `scripts/audit-standardized-tool-visuals.mjs`

## Tools corrected in this pass

### Related Tools

- Brand Deal Calculator — shortened three sentence-length buttons to their tool names.

### Supporting Guides

- Viral Content Framework Generator
- Freedom Rate Calculator
- Scope Creep Calculator
- Testimonial Request Generator
- Case Study Outline Generator
- Client Scam Detector

Each sparse one-link Guides block now renders the complete guide and four supporting article cards.

### FAQ inner layout

- Creator Sponsorship Rate Calculator
- Digital Product Break-Even Calculator
- Freelancer Productivity Debt Calculator
- Freelancer SaaS Subscription Cost Leak Detector
- Freelancer Monthly Retainer Pricing Calculator
- Freelancer Referral Reward Calculator
- Freelancer Profile Optimizer
- Testimonial Request Generator
- Case Study Outline Generator
- Client Scam Detector
- Freelancer Proposal Win Probability Calculator

These older custom FAQ interiors now render through the approved standard FAQ card grid instead of keeping a legacy layout inside the standardized outer frame.

## Findings that were checked but not treated as defects

- Safe-zone tools use a 36 px Quick Start/privacy gap; it is consistent across that tool family and remains within the accepted spacing range.
- CTA button borders are not duplicate premium frames.
- Always-open FAQ cards and accordion-origin FAQ content are both normalized into the same visible approved card treatment.
- Hub pages are not tool pages and are excluded from tool-shell checks.
