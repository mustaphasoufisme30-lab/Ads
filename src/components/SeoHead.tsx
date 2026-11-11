/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';
import { IMAGES } from '../data/categories';
import { useLocale } from '../i18n/next-intl';

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
  imageAlt?: string;
  articleData?: {
    author: string;
    datePublished: string;
    dateModified: string;
    category: string;
  };
  breadcrumbs?: BreadcrumbItem[];
  faq?: { question: string; answer: string }[];
}

const OFFICIAL_DOMAIN = 'https://mahfoud.xyz';

export const SeoHead: React.FC<SeoProps> = ({
  title,
  description,
  path,
  type = 'website',
  image,
  imageAlt,
  articleData,
  breadcrumbs,
  faq,
}) => {
  const { locale } = useLocale();

  useEffect(() => {
    const baseDomain = (SITE_CONFIG.siteUrl || OFFICIAL_DOMAIN).replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${baseDomain}${normalizedPath}`;
    const resolvedImage = image || IMAGES.aiWorkspace;
    const fullImgUrl = resolvedImage.startsWith('http')
      ? resolvedImage
      : `${baseDomain}${resolvedImage.startsWith('/') ? resolvedImage : `/${resolvedImage}`}`;
    const resolvedImageAlt = imageAlt || title;

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

    // Standard SEO & Robots Meta
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setMeta(
      'meta[name="googlebot"]',
      'name',
      'googlebot',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // Open Graph (Facebook, WhatsApp, LinkedIn)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type === 'article' ? 'article' : 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_CONFIG.name);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', locale === 'ar' ? 'ar_AR' : 'fr_FR');
    setMeta('meta[property="og:image"]', 'property', 'og:image', fullImgUrl);
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '675');
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', resolvedImageAlt);

    // Twitter / X Cards
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', fullImgUrl);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', resolvedImageAlt);

    // Canonical URL always pointing to official domain https://mahfoud.xyz
    let linkCanonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Build Schema.org JSON-LD @graph
    const graph: Record<string, unknown>[] = [];

    // 1. Organization Schema
    graph.push({
      '@type': 'Organization',
      '@id': `${baseDomain}/#organization`,
      name: SITE_CONFIG.name,
      url: `${baseDomain}/`,
      email: SITE_CONFIG.contactEmail,
      contactPoint: {
        '@type': 'ContactPoint',
        email: SITE_CONFIG.contactEmail,
        contactType: 'customer support',
        availableLanguage: ['French', 'Arabic'],
      },
    });

    // 2. WebSite Schema
    graph.push({
      '@type': 'WebSite',
      '@id': `${baseDomain}/#website`,
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.positioning,
      url: `${baseDomain}/`,
      inLanguage: ['fr', 'ar'],
      publisher: {
        '@id': `${baseDomain}/#organization`,
      },
    });

    // 3. BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: `${baseDomain}${b.path.startsWith('/') ? b.path : `/${b.path}`}`,
        })),
      });
    }

    // 4. Article Schema
    if (type === 'article' && articleData) {
      graph.push({
        '@type': 'Article',
        '@id': `${canonicalUrl}#article`,
        headline: title,
        description,
        image: [fullImgUrl],
        inLanguage: locale === 'ar' ? 'ar' : 'fr',
        author: {
          '@type': 'Organization',
          name: articleData.author,
          url: `${baseDomain}/a-propos/`,
        },
        publisher: {
          '@id': `${baseDomain}/#organization`,
        },
        articleSection: articleData.category,
        datePublished: '2026-11-01',
        dateModified: '2026-11-09',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      });
    }

    // 5. SoftwareApplication Schema for Free Online Tools
    if (type === 'software') {
      graph.push({
        '@type': 'SoftwareApplication',
        '@id': `${canonicalUrl}#software`,
        name: title,
        url: canonicalUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        description,
        inLanguage: locale === 'ar' ? 'ar' : 'fr',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
      });
    }

    // 6. FAQPage Schema (only when genuine FAQ items are present on the page)
    if (faq && faq.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
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

    const schemaPayload = {
      '@context': 'https://schema.org',
      '@graph': graph,
    };

    let scriptEl = document.getElementById('techia-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'techia-schema-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaPayload);
  }, [title, description, path, type, image, imageAlt, articleData, breadcrumbs, faq, locale]);

  return null;
};
