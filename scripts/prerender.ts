/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Pre-renders static HTML for TechIA Lab routes into dist/ so search engines
 * (Googlebot) receive full HTML content, H1, 300+ words, meta tags, and JSON-LD
 * without needing JavaScript execution.
 */

import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import { NextIntlClientProvider } from '../src/i18n/next-intl';
import { ARTICLES } from '../src/data/articles';
import { CATEGORIES } from '../src/data/categories';
import { TOOLS } from '../src/data/tools';
import { SITE_CONFIG } from '../src/config/siteConfig';
import arMessages from '../src/i18n/ar.json';

// Polyfill minimal import.meta.env defaults if needed during tsx Node execution
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://mahfoud.xyz';

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen - 1).trim()}…`;
}

interface RouteMeta {
  routePath: string;
  title: string;
  description: string;
  type: 'website' | 'article' | 'software';
  image: string;
}

function buildRoutes(): RouteMeta[] {
  const defaultImg = `${BASE_URL}/images/techia_ai_workspace_1794109988578.jpg`;
  const routes: RouteMeta[] = [
    {
      routePath: '/',
      title: 'TechIA Lab — دورات الذكاء الاصطناعي وبايثون',
      description:
        'تعلّم الذكاء الاصطناعي وبايثون بخطوات مبسطة واستفد من 9 أدوات رقمية مجانية في متصفحك بدون تسجيل على TechIA Lab.',
      type: 'website',
      image: defaultImg,
    },
    {
      routePath: '/guides/',
      title: truncate(`${arMessages.categories.guidesName} | TechIA Lab`, 59),
      description: truncate(arMessages.categories.guidesDesc, 154),
      type: 'website',
      image: defaultImg,
    },
    {
      routePath: '/outils/',
      title: truncate(`${arMessages.tools.hubTitle} | TechIA Lab`, 59),
      description: truncate(arMessages.tools.hubDesc, 154),
      type: 'website',
      image: defaultImg,
    },
    {
      routePath: '/a-propos/',
      title: truncate(`${arMessages.nav.about} — TechIA Lab`, 59),
      description: truncate(arMessages.about.missionDesc, 154),
      type: 'website',
      image: defaultImg,
    },
    {
      routePath: '/contact/',
      title: truncate(`${arMessages.nav.contact} — TechIA Lab`, 59),
      description: truncate(arMessages.contact.subtitle, 154),
      type: 'website',
      image: defaultImg,
    },
    {
      routePath: '/confidentialite/',
      title: truncate(`${arMessages.footer.privacy} | TechIA Lab`, 59),
      description: truncate(arMessages.footer.tagline, 154),
      type: 'website',
      image: defaultImg,
    },
    {
      routePath: '/mentions-legales/',
      title: truncate(`${arMessages.footer.legal} | TechIA Lab`, 59),
      description: truncate(arMessages.footer.tagline, 154),
      type: 'website',
      image: defaultImg,
    },
    {
      routePath: '/conditions-utilisation/',
      title: truncate(`${arMessages.footer.terms} | TechIA Lab`, 59),
      description: truncate(arMessages.footer.tagline, 154),
      type: 'website',
      image: defaultImg,
    },
  ];

  const catKeys: Record<string, { name: keyof typeof arMessages.categories; desc: keyof typeof arMessages.categories }> = {
    ia: { name: 'iaName', desc: 'iaDesc' },
    chatgpt: { name: 'chatgptName', desc: 'chatgptDesc' },
    'google-ai-gemini': { name: 'geminiName', desc: 'geminiDesc' },
    'canva-creation': { name: 'canvaName', desc: 'canvaDesc' },
    programmation: { name: 'programmationName', desc: 'programmationDesc' },
    python: { name: 'pythonName', desc: 'pythonDesc' },
    php: { name: 'phpName', desc: 'phpDesc' },
    javascript: { name: 'javascriptName', desc: 'javascriptDesc' },
    'creation-sites-web': { name: 'sitesWebName', desc: 'sitesWebDesc' },
    'applications-android': { name: 'androidName', desc: 'androidDesc' },
    'outils-pdf': { name: 'pdfName', desc: 'pdfDesc' },
    kdp: { name: 'kdpName', desc: 'kdpDesc' },
    'outils-en-ligne': { name: 'outilsLigneName', desc: 'outilsLigneDesc' },
    automatisation: { name: 'automatisationName', desc: 'automatisationDesc' },
    'freelance-revenus-numeriques': { name: 'freelanceName', desc: 'freelanceDesc' },
  };

  for (const cat of CATEGORIES) {
    const keys = catKeys[cat.slug];
    const name = keys ? arMessages.categories[keys.name] : cat.name;
    const desc = keys ? arMessages.categories[keys.desc] : cat.seoDescription;
    routes.push({
      routePath: cat.url,
      title: truncate(`${name} | ${SITE_CONFIG.name}`, 59),
      description: truncate(desc, 154),
      type: 'website',
      image: `${BASE_URL}${cat.image}`,
    });
  }

  for (const art of ARTICLES) {
    const num = art.id.replace('art-', '');
    const titleKey = `art${num}Title` as keyof typeof arMessages.articles;
    const excerptKey = `art${num}Excerpt` as keyof typeof arMessages.articles;
    const title = arMessages.articles[titleKey] || art.title;
    const desc = arMessages.articles[excerptKey] || art.metaDescription;
    routes.push({
      routePath: art.url,
      title: truncate(`${title} | ${SITE_CONFIG.name}`, 59),
      description: truncate(desc, 154),
      type: 'article',
      image: `${BASE_URL}${art.image}`,
    });
  }

  const toolMap: Record<string, { name: keyof typeof arMessages.tools; summary: keyof typeof arMessages.tools }> = {
    'pdf-vers-images': { name: 't1Name', summary: 't1Summary' },
    'images-vers-pdf': { name: 't2Name', summary: 't2Summary' },
    'fusionner-pdf': { name: 't3Name', summary: 't3Summary' },
    'compresser-pdf': { name: 't4Name', summary: 't4Summary' },
    'qr-code': { name: 't5Name', summary: 't5Summary' },
    'compteur-de-mots': { name: 't6Name', summary: 't6Summary' },
    'generateur-mot-de-passe': { name: 't7Name', summary: 't7Summary' },
    'convertisseur-unites': { name: 't8Name', summary: 't8Summary' },
    calculateur: { name: 't9Name', summary: 't9Summary' },
  };

  for (const tool of TOOLS) {
    const keys = toolMap[tool.id];
    const name = keys ? arMessages.tools[keys.name] : tool.name;
    const desc = keys ? arMessages.tools[keys.summary] : tool.summary;
    routes.push({
      routePath: tool.url,
      title: truncate(`${name} | ${SITE_CONFIG.name}`, 59),
      description: truncate(desc, 154),
      type: 'software',
      image: defaultImg,
    });
  }

  return routes;
}

function injectMeta(html: string, route: RouteMeta): string {
  const canonical = `${BASE_URL}${route.routePath.startsWith('/') ? route.routePath : `/${route.routePath}`}`;
  const safeTitle = escapeAttr(route.title);
  const safeDesc = escapeAttr(route.description);
  const safeImg = escapeAttr(route.image);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:type" content="${route.type === 'article' ? 'article' : 'website'}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${safeImg}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${safeImg}" />`
    );
}

function prerender() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Template not found at ${TEMPLATE_PATH}. Run vite build first.`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const routes = buildRoutes();

  for (const route of routes) {
    const appHtml = renderToString(
      React.createElement(NextIntlClientProvider, {
        initialLocale: 'ar',
        children: React.createElement(App, { initialPath: route.routePath }),
      })
    );

    let pageHtml = templateHtml.replace(
      /<div id="root">[\s\S]*?<\/div>/,
      `<div id="root" data-ssr="true">${appHtml}</div>`
    );
    pageHtml = injectMeta(pageHtml, route);

    const cleanSubdir = route.routePath.replace(/^\/+|\/+$/g, '');
    const outPath = cleanSubdir
      ? path.join(DIST_DIR, cleanSubdir, 'index.html')
      : path.join(DIST_DIR, 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, pageHtml, 'utf-8');
  }

  console.log(`Pre-rendered ${routes.length} static HTML pages into dist/`);
}

prerender();
