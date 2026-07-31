export const standardFooterCss = `.acl-standard-footer{width:100%;margin-top:48px;padding:40px 20px 24px;border-top:1px solid #1f2937;background:#111827;color:#94a3b8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.acl-standard-footer *{box-sizing:border-box}.acl-standard-footer a{text-decoration:none}.acl-standard-footer-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:4fr 3fr 5fr;gap:32px;align-items:start}.acl-standard-footer-brand-main{display:flex;align-items:center;gap:12px;color:#fff;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.acl-standard-footer-logo{width:24px;height:24px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid #1e293b;border-radius:5px;background:#020617}.acl-standard-footer-logo img{width:100%;height:100%;object-fit:contain}.acl-standard-footer-copy{max-width:390px;margin:12px 0 0;color:#94a3b8;font-size:11px;line-height:1.7}.acl-standard-footer-heading{display:block;margin-bottom:10px;color:#f8fafc;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}.acl-standard-footer-heading.is-gold{color:#f59e0b}.acl-standard-footer-newest ul{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}.acl-standard-footer-newest li{display:flex;align-items:flex-start;gap:7px}.acl-standard-footer-dot{width:4px;height:4px;margin-top:7px;border-radius:999px;background:#f59e0b;flex:0 0 auto}.acl-standard-footer a{color:#94a3b8;font-size:11px;font-weight:600;line-height:1.55}.acl-standard-footer a:hover{color:#dbeafe}.acl-standard-footer-links{display:grid;grid-template-columns:1fr 1fr;gap:24px}.acl-standard-footer-stack{display:flex;flex-direction:column;gap:7px}.acl-standard-footer a.is-gold{color:#f59e0b}.acl-standard-footer a.is-gold:hover{color:#fbbf24}.acl-standard-footer-bottom{max-width:1280px;margin:30px auto 0;padding-top:20px;border-top:1px solid #0f172a;color:#64748b;text-align:center;font-size:10px}@media(max-width:820px){.acl-standard-footer-inner{grid-template-columns:1fr}.acl-standard-footer-links{grid-template-columns:1fr 1fr}}@media(max-width:520px){.acl-standard-footer-links{grid-template-columns:1fr}}`;

export const standardFooterHtml = `<footer class="acl-standard-footer no-print">
  <div class="acl-standard-footer-inner">
    <div>
      <div class="acl-standard-footer-brand-main"><span class="acl-standard-footer-logo"><img src="/assets/ai-cash-lab-logo-600.png" alt="AI Cash Lab footer logo"></span><span>AI Cash Lab Tools</span></div>
      <p class="acl-standard-footer-copy">Simple business tools for freelancers, creators, and digital service providers.</p>
    </div>
    <div class="acl-standard-footer-newest">
      <span class="acl-standard-footer-heading is-gold">Newest Tools</span>
      <ul>
        <li><span class="acl-standard-footer-dot"></span><a href="/creator-sponsorship-rate-calculator/">Creator Sponsorship Rate Calculator</a></li>
        <li><span class="acl-standard-footer-dot"></span><a href="/freelancer-saas-subscription-cost-leak-detector/">Freelancer SaaS Subscription Cost Leak Detector</a></li>
        <li><span class="acl-standard-footer-dot"></span><a href="/freelancer-productivity-debt-calculator/">Freelancer Productivity Debt Calculator</a></li>
      </ul>
    </div>
    <div class="acl-standard-footer-links">
      <div><span class="acl-standard-footer-heading">Production Hub</span><div class="acl-standard-footer-stack"><a href="/">All Tools</a><a href="/articles/">Articles</a><a href="/creator-utilities/">Creator Utilities</a><a href="/freelancer-utilities/">Freelancer Utilities</a></div></div>
      <div><span class="acl-standard-footer-heading">Commercial Engine</span><div class="acl-standard-footer-stack"><a class="is-gold" href="/#premium-workspaces">Premium Workspaces</a><a class="is-gold" href="https://aicashlabofficial.gumroad.com" target="_blank" rel="noopener noreferrer">Storefront Hub &rarr;</a></div></div>
    </div>
  </div>
  <div class="acl-standard-footer-bottom">&copy; 2026 AI Cash Lab. All Rights Reserved.</div>
</footer>`;
