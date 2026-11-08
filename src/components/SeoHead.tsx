/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'software';
  image?: string;
  articleData?: {
    author: string;
    datePublished: string;
    dateModified: string;
    category: string;
  };
  breadcrumbs?: BreadcrumbItem[];
  faq?: { question: string; answer: string }[];
}

export const SeoHead: React.FC<SeoProps> = ({
  title,
  description,
  path,
  type = 'website',
  image,
  articleData,
  breadcrumbs,
  faq,
}) => {
  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : SITE_CONFIG.siteUrl;
    const canonicalUrl = `${origin}${path.startsWith('/') ? path : `/${path}`}`;

    document.title = title;

    const setMeta = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type === 'article' ? 'article' : 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_CONFIG.name);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    if (image) {
      const fullImg = image.startsWith('http') ? image : `${origin}${image}`;
      setMeta('meta[property="og:image"]', 'property', 'og:image', fullImg);
    }

    let linkCanonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Build Schema.org JSON-LD graph
    const schemas: Record<string, unknown>[] = [];

    // 1. WebSite Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.positioning,
      url: origin,
    });

    // 2. BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: `${origin}${b.path}`,
        })),
      });
    }

    // 3. Article Schema
    if (type === 'article' && articleData) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        author: {
          '@type': 'Organization',
          name: articleData.author,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
        },
        articleSection: articleData.category,
        datePublished: '2026-11-01',
        dateModified: '2026-11-07',
        mainEntityOfPage: canonicalUrl,
      });
    }

    // 4. SoftwareApplication Schema for Free Tools
    if (type === 'software') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
      });
    }

    // 5. FAQPage Schema (only when relevant FAQ items exist)
    if (faq && faq.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }

    let scriptEl = document.getElementById('techia-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'techia-schema-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemas);
  }, [title, description, path, type, image, articleData, breadcrumbs, faq]);

  return null;
};
