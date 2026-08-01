import fs from "node:fs/promises";
import path from "node:path";

const root=process.cwd();
const excluded=new Set(["articles","assets","creator-utilities","freelancer-utilities","tools"]);
const styleTag='<link rel="stylesheet" href="/assets/standard-tool-closing-sections.css">';
const scriptTag='<script src="/assets/standard-tool-closing-sections.js" defer></script>';
const articleMap=new Map();
const articleRoot=path.join(root,"articles");
for(const entry of await fs.readdir(articleRoot,{withFileTypes:true})){
  if(!entry.isDirectory())continue;
  const file=path.join(articleRoot,entry.name,"index.html");
  let article;
  try{article=await fs.readFile(file,"utf8")}catch{continue}
  const title=(article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||entry.name).replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&(?:rarr|#8594);/g,'→').trim();
  const toolMatch=Array.from(article.matchAll(/href=["']\/([^/"']+)\/["']/g)).find(match=>!['articles','creator-utilities','freelancer-utilities'].includes(match[1]));
  if(toolMatch){if(!articleMap.has(toolMatch[1]))articleMap.set(toolMatch[1],[]);articleMap.get(toolMatch[1]).push({slug:entry.name,title})}
}
function insertBeforeFooter(html,markup){const index=html.search(/<footer\b/i);return index>=0?html.slice(0,index)+markup+html.slice(index):html.replace('</body>',markup+'</body>')}
function cleanTitle(html,slug){return (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||slug.replace(/-/g,' ')).replace(/<[^>]+>/g,'').trim()}
let changed=0;
for(const entry of await fs.readdir(root,{withFileTypes:true})){
  if(!entry.isDirectory()||excluded.has(entry.name)||entry.name.startsWith('.'))continue;
  const file=path.join(root,entry.name,"index.html");
  let html;
  try{html=await fs.readFile(file,"utf8")}catch{continue}
  if(!/SoftwareApplication|WebApplication|calculator|generator|checker|formatter|analyzer/i.test(html))continue;
  const before=html;
  if(entry.name==="caption-formatter")html=html.replace(/<section data-acl-generated-guides>[\s\S]*?<\/section>/gi,'');
  html=html.replace(/<section data-acl-generated-faq>[\s\S]*?<\/section>/gi,'');
  const title=cleanTitle(html,entry.name),beforeFooter=html.split(/<footer\b/i)[0];
  if(!/<section[^>]*(?:data-acl-generated-premium|class=["'][^"']*(?:premium|cta))/i.test(beforeFooter)&&!/<a[^>]+href=["']https?:\/\/[^"']*gumroad\.com/i.test(beforeFooter)){
    html=insertBeforeFooter(html,`<section data-acl-generated-premium><span>Creator Publishing System</span><h2>Turn formatted content into a repeatable publishing workflow</h2><p>Use AI Cash Lab premium workspaces to connect content planning, production, publishing, and monetization.</p><a href="https://aicashlabofficial.gumroad.com" target="_blank" rel="noopener noreferrer">Explore Premium Workspaces →</a></section>`);
  }
  if(entry.name==="caption-formatter"&&!html.includes('data-acl-generated-premium'))html=insertBeforeFooter(html,`<section data-acl-generated-premium><span>Creator Publishing System</span><h2>Turn formatted content into a repeatable publishing workflow</h2><p>Use AI Cash Lab premium workspaces to connect content planning, production, publishing, and monetization.</p><a href="https://aicashlabofficial.gumroad.com" target="_blank" rel="noopener noreferrer">Explore Premium Workspaces →</a></section>`);
  if(!/<section[^>]*(?:related-tool|data-acl-generated-related)/i.test(beforeFooter)&&!/<h[23][^>]*>[^<]*(?:related .*tools|keep building|next .*tool|plan the next .*step)/i.test(beforeFooter)){
    const paragraph=Array.from(beforeFooter.matchAll(/<p[^>]*>[\s\S]*?related tools:[\s\S]*?<\/p>/gi)).pop()?.[0]||'';
    const related=Array.from(paragraph.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)).slice(0,6).map(match=>({href:match[1],title:match[2].replace(/<[^>]+>/g,'').trim()}));
    if(related.length){
      const links=related.map(item=>`<a href="${item.href}">${item.title}</a>`).join('');
      html=insertBeforeFooter(html,`<section data-acl-generated-related><h2>Continue with a related tool</h2><p>Use the next utility that matches your workflow.</p><div>${links}</div></section>`);
    }
  }
  if(!/href=["']\/articles\//i.test(beforeFooter)){
    const articles=(articleMap.get(entry.name)||[]).slice(0,5);
    if(articles.length){
      const links=articles.map(article=>`<a href="/articles/${article.slug}/"><strong>${article.title}</strong><p>Practical guidance connected to this free tool.</p></a>`).join('');
      html=insertBeforeFooter(html,`<section data-acl-generated-guides><h2>${title} Guides</h2><p>Use these supporting articles to apply the result with more context.</p><div>${links}</div></section>`);
    }
  }
  if(!/<h[23][^>]*>[^<]*(?:frequently asked questions|\bfaq\b)/i.test(beforeFooter)){
    const faq=`<section data-acl-generated-faq><h2>${title} FAQ</h2><details><summary>Is the ${title} free?</summary><p>Yes. You can use this tool free in your browser.</p></details><details><summary>Do I need to create an account?</summary><p>No account or signup is required.</p></details><details><summary>Is my information uploaded?</summary><p>No. The tool is designed to process your inputs locally in the browser.</p></details><details><summary>Does it work on mobile?</summary><p>Yes. The interface adapts to phones, tablets, and desktop screens.</p></details></section>`;
    html=insertBeforeFooter(html,faq);
  }
  if(!html.includes('/assets/standard-tool-closing-sections.css'))html=html.replace('</head>',`${styleTag}</head>`);
  if(!html.includes('/assets/standard-tool-closing-sections.js'))html=html.replace('</body>',`${scriptTag}</body>`);
  if(html!==before){await fs.writeFile(file,html,"utf8");changed++}
}
console.log(`Applied standard closing sections to ${changed} tool pages.`);
