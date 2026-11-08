/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Cpu,
  ExternalLink,
  Layers,
  List,
  Moon,
  Search,
  Share2,
  Sparkles,
  Sun,
  Wrench,
  X,
} from 'lucide-react';
import { SITE_CONFIG } from './config/siteConfig';
import { CATEGORIES, CategoryInfo, getCategoryBySlug } from './data/categories';
import { ARTICLES, Article, getArticleBySlug, getArticlesForCategory } from './data/articles';
import { TOOLS, getToolBySlug } from './data/tools';
import { SeoHead } from './components/SeoHead';
import { InteractiveToolWidget } from './components/InteractiveTools';
import { AboutPage, ContactPage, LegalPage } from './components/StaticPages';
import { useLocale, useTranslations } from './i18n/next-intl';

// Resilient image component with fallback and explicit dimensions
const SafeImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}> = ({ src, alt, className = '', eager = false }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-900 text-slate-200 p-6 text-center ${className}`}
      >
        <Cpu className="w-8 h-8 text-blue-400 mb-2" />
        <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
          {SITE_CONFIG.name}
        </span>
        <span className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-xs">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={800}
      height={450}
      loading={eager ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
      className={className}
    />
  );
};

// Reusable Newsletter Form without false promises
const NewsletterBox: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const tHome = useTranslations('home');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setEmail('');
  };

  return (
    <div
      className={
        compact
          ? 'p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
          : 'p-8 sm:p-10 rounded-2xl bg-slate-900 text-white border border-slate-800'
      }
    >
      <div className="max-w-2xl">
        <div
          className={`text-xs font-semibold mb-2 ${
            compact ? 'text-blue-600 dark:text-blue-400' : 'text-blue-400'
          }`}
        >
          {tHome('newsletterBadge')}
        </div>
        <h3
          className={`font-extrabold tracking-tight mb-2 ${
            compact ? 'text-lg text-slate-900 dark:text-white' : 'text-2xl sm:text-3xl text-white'
          }`}
        >
          {tHome('newsletterTitle')}
        </h3>
        <p
          className={`text-sm leading-relaxed mb-5 ${
            compact ? 'text-slate-600 dark:text-slate-400' : 'text-slate-300'
          }`}
        >
          {tHome('newsletterDesc')}
        </p>

        {status === 'success' ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{tHome('newsletterSuccess')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5" noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder={tHome('newsletterPlaceholder')}
              aria-label={tHome('newsletterPlaceholder')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-blue-500 ${
                compact
                  ? 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                  : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {tHome('newsletterBtn')}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-500 mt-2">
            {tHome('newsletterError')}
          </p>
        )}
      </div>
    </div>
  );
};

// Reusable Article Card with Framer Motion (staggered fade-in, scroll reveal, and 5px hover lift + stronger shadow)
const ArticleCard: React.FC<{
  article: Article;
  onNavigate: (path: string) => void;
  index?: number;
}> = ({ article, onNavigate, index = 0 }) => {
  const tHome = useTranslations('home');
  const tArticles = useTranslations('articles');

  const num = article.id.replace('art-', '');
  const titleKey = `art${num}Title` as Parameters<typeof tArticles>[0];
  const excerptKey = `art${num}Excerpt` as Parameters<typeof tArticles>[0];
  const catKey = `art${num}Cat` as Parameters<typeof tArticles>[0];

  const localizedTitle = tArticles(titleKey) || article.title;
  const localizedExcerpt = tArticles(excerptKey) || article.excerpt;
  const localizedCategory = tArticles(catKey) || article.categoryName;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/50 transition-shadow duration-200 overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div
          onClick={() => onNavigate(article.url)}
          className="aspect-16/9 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
        >
          <SafeImage
            src={article.image}
            alt={localizedTitle}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>

        <div className="p-5 sm:p-6">
          {/* Clean unboxed metadata per Zero-Pill Discipline */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <button
              type="button"
              onClick={() => onNavigate(`/${article.categorySlug}/`)}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {localizedCategory}
            </button>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{article.readTime}</span>
          </div>

          <h3
            onClick={() => onNavigate(article.url)}
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer leading-snug mb-2.5"
          >
            {localizedTitle}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
            {localizedExcerpt}
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {article.isCompleteGuide ? tHome('completeGuideLabel') : tHome('tutorialLabel')}
        </span>
        <button
          type="button"
          onClick={() => onNavigate(article.url)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{tHome('readMore')}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </motion.article>
  );
};

export default function App() {
  const { locale, setLocale } = useLocale();
  const tNav = useTranslations('nav');
  const tHome = useTranslations('home');
  const tCategories = useTranslations('categories');
  const tArticles = useTranslations('articles');
  const tTools = useTranslations('tools');
  const tFooter = useTranslations('footer');

  // Helper to get localized article title, excerpt, and category badge
  const getLocalizedArticle = (art: Article) => {
    const num = art.id.replace('art-', '');
    const titleKey = `art${num}Title` as Parameters<typeof tArticles>[0];
    const excerptKey = `art${num}Excerpt` as Parameters<typeof tArticles>[0];
    const catKey = `art${num}Cat` as Parameters<typeof tArticles>[0];
    return {
      title: tArticles(titleKey) || art.title,
      excerpt: tArticles(excerptKey) || art.excerpt,
      categoryName: tArticles(catKey) || art.categoryName,
    };
  };

  // Helper to get localized tool name and summary
  const getLocalizedTool = (toolId: string, fallbackName: string, fallbackSummary: string) => {
    const map: Record<string, { name: Parameters<typeof tTools>[0]; summary: Parameters<typeof tTools>[0] }> = {
      'pdf-vers-images': { name: 't1Name', summary: 't1Summary' },
      'images-vers-pdf': { name: 't2Name', summary: 't2Summary' },
      'fusionner-pdf': { name: 't3Name', summary: 't3Summary' },
      'compresser-pdf': { name: 't4Name', summary: 't4Summary' },
      'qr-code': { name: 't5Name', summary: 't5Summary' },
      'compteur-de-mots': { name: 't6Name', summary: 't6Summary' },
      'generateur-mot-de-passe': { name: 't7Name', summary: 't7Summary' },
      'convertisseur-unites': { name: 't8Name', summary: 't8Summary' },
      'calculateur': { name: 't9Name', summary: 't9Summary' },
    };
    const keys = map[toolId];
    if (!keys) return { name: fallbackName, summary: fallbackSummary };
    return {
      name: tTools(keys.name),
      summary: tTools(keys.summary),
    };
  };

  // Helper to get localized category name & description
  const getLocalizedCategory = (slug: string, fallbackName: string, fallbackDesc: string) => {
    const map: Record<string, { name: Parameters<typeof tCategories>[0]; desc: Parameters<typeof tCategories>[0] }> = {
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
      guides: { name: 'guidesName', desc: 'guidesDesc' },
    };
    const keys = map[slug];
    if (!keys) return { name: fallbackName, desc: fallbackDesc };
    return {
      name: tCategories(keys.name),
      desc: tCategories(keys.desc),
    };
  };

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('techialab_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryPageIndex, setCategoryPageIndex] = useState<number>(1);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('techialab_cookies_accepted') === 'true';
    } catch {
      return false;
    }
  });
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Detect scroll for sticky header blur + shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial page load spinning logo animation
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('techialab_theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage restrictions
    }
  }, [darkMode]);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (normalized !== currentPath) {
      setIsPageLoading(true);
      setTimeout(() => setIsPageLoading(false), 320);
    }
    setCurrentPath(normalized);
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
    setCategoryPageIndex(1);
    try {
      window.history.pushState({}, '', normalized);
    } catch {
      // Fallback in sandboxed iframe if pushState is restricted
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global internal search across Articles, Categories, Tools, and Guides (supports FR & AR search)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return {
        articles: ARTICLES.slice(0, 4),
        tools: TOOLS.slice(0, 4),
        categories: CATEGORIES.slice(0, 5),
      };
    }

    const matchedArticles = ARTICLES.filter((a) => {
      const loc = getLocalizedArticle(a);
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        loc.title.toLowerCase().includes(q) ||
        loc.excerpt.toLowerCase().includes(q) ||
        loc.categoryName.toLowerCase().includes(q)
      );
    });

    const matchedTools = TOOLS.filter((t) => {
      const loc = getLocalizedTool(t.id, t.name, t.summary);
      return (
        t.name.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        loc.name.toLowerCase().includes(q) ||
        loc.summary.toLowerCase().includes(q)
      );
    });

    const matchedCategories = CATEGORIES.filter((c) => {
      const loc = getLocalizedCategory(c.slug, c.name, c.seoDescription);
      return (
        c.name.toLowerCase().includes(q) ||
        loc.name.toLowerCase().includes(q) ||
        loc.desc.toLowerCase().includes(q)
      );
    });

    return {
      articles: matchedArticles,
      tools: matchedTools,
      categories: matchedCategories,
    };
  }, [searchQuery, locale]);

  // Route matching logic
  const route = useMemo(() => {
    const clean = currentPath.replace(/\/+$/, '') || '/';
    if (clean === '/') return { type: 'home' as const };
    if (clean === '/a-propos') return { type: 'about' as const };
    if (clean === '/contact') return { type: 'contact' as const };
    if (clean === '/confidentialite') return { type: 'legal' as const, subtype: 'confidentialite' as const };
    if (clean === '/mentions-legales') return { type: 'legal' as const, subtype: 'mentions-legales' as const };
    if (clean === '/conditions-utilisation') return { type: 'legal' as const, subtype: 'conditions-utilisation' as const };
    if (clean === '/outils') return { type: 'tools-hub' as const };
    if (clean === '/guides') return { type: 'guides-hub' as const };

    if (clean.startsWith('/outils/')) {
      const slug = clean.replace('/outils/', '');
      const tool = getToolBySlug(slug);
      if (tool) return { type: 'tool-detail' as const, tool };
    }

    if (clean.startsWith('/article/')) {
      const slug = clean.replace('/article/', '');
      const article = getArticleBySlug(slug);
      if (article) return { type: 'article-detail' as const, article };
    }

    const catSlug = clean.replace(/^\//, '');
    const category = getCategoryBySlug(catSlug);
    if (category) return { type: 'category-detail' as const, category };

    return { type: 'home' as const };
  }, [currentPath]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleShareCopy = () => {
    const url = typeof window !== 'undefined' ? window.location.href : SITE_CONFIG.siteUrl;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleAcceptCookies = () => {
    setCookiesAccepted(true);
    try {
      localStorage.setItem('techialab_cookies_accepted', 'true');
    } catch {
      // Ignore storage errors
    }
  };

  // reusable Desktop Sidebar (moves below content on mobile)
  const renderSidebar = () => (
    <aside className="space-y-6">
      {/* Sidebar Search */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {tHome('searchArticle')}
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchModalOpen(true);
            }}
            onFocus={() => setSearchModalOpen(true)}
            placeholder={tHome('searchArticle')}
            aria-label={tHome('searchArticle')}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Sidebar Categories (Catégories / التصنيفات) */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {tHome('categories')}
        </h3>
        <ul className="divide-y divide-slate-200/70 dark:divide-slate-800 text-xs sm:text-sm">
          {[
            { label: tCategories('ai'), path: '/ia/' },
            { label: tCategories('tech'), path: '/programmation/' },
            { label: tCategories('money'), path: '/kdp/' },
            { label: tCategories('tutorials'), path: '/guides/' },
            ...CATEGORIES.slice(0, 6).map((cat) => ({
              label: getLocalizedCategory(cat.slug, cat.name, cat.seoDescription).name,
              path: cat.url,
            })),
          ].map((item, idx) => (
            <li key={`${item.path}-${idx}`} className="py-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-start cursor-pointer"
              >
                {item.label}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 rtl:rotate-180" />
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Articles (Articles populaires / المقالات الأكثر قراءة) */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {tHome('popularArticles')}
        </h3>
        <div className="space-y-4">
          {ARTICLES.slice(0, 4).map((art, i) => {
            const loc = getLocalizedArticle(art);
            return (
              <div
                key={art.id}
                onClick={() => navigate(art.url)}
                className="group cursor-pointer flex items-start gap-3"
              >
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug">
                    {loc.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">{art.readTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Newsletter */}
      <NewsletterBox compact />
    </aside>
  );

  const featuredArt = getLocalizedArticle(ARTICLES[0]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* ANIMATION DE CHARGEMENT : Petit logo qui tourne quand la page charge */}
      <AnimatePresence>
        {isPageLoading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs"
            aria-label="TechIA Lab"
          >
            <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30"
              >
                <Cpu className="w-5 h-5" />
              </motion.div>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                {SITE_CONFIG.name}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER PRINCIPAL (Sticky, flou transparent + ombre au scroll) */}
      <header
        className={`sticky top-0 z-40 h-16 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-slate-800/80'
            : 'bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* 1. À gauche : Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="inline-flex items-center gap-2.5 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
          >
            <motion.span
              animate={isPageLoading ? { rotate: 360 } : { rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs"
            >
              <Cpu className="w-4 h-4" />
            </motion.span>
            <span>{SITE_CONFIG.name}</span>
          </a>

          {/* 2. Au milieu : Liens principaux avec ligne bleue qui glisse de gauche à droite au survol */}
          <nav
            aria-label={tNav('home')}
            className="hidden lg:flex items-center gap-7 text-sm font-semibold"
          >
            {[
              { label: tNav('home'), path: '/' },
              { label: tNav('articles'), path: '/guides/' },
              { label: tNav('tools'), path: '/outils/' },
              { label: tNav('about'), path: '/a-propos' },
              { label: tNav('contact'), path: '/contact' },
            ].map((item) => {
              const isActive =
                item.path === '/'
                  ? currentPath === '/'
                  : item.path === '/guides/'
                    ? currentPath.startsWith('/guides') || currentPath.startsWith('/article/')
                    : currentPath.startsWith(item.path.replace(/\/$/, ''));
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className={`group relative py-1.5 transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Ligne bleue animée qui glisse de gauche à droite */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 w-full bg-blue-600 dark:bg-blue-400 rounded-full origin-left transition-transform duration-300 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* 3. À droite : Sélecteur FR | عربي + Recherche + Mode Clair/Sombre + Bouton "Lire les articles" + Burger Mobile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Bouton Multilingue FR | عربي */}
            <div
              role="group"
              aria-label="FR | عربي"
              className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 text-xs font-bold shrink-0"
            >
              <button
                type="button"
                onClick={() => setLocale('fr')}
                aria-pressed={locale === 'fr'}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  locale === 'fr'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                FR
              </button>
              <span className="text-slate-300 dark:text-slate-700 px-0.5 select-none">|</span>
              <button
                type="button"
                onClick={() => setLocale('ar')}
                aria-pressed={locale === 'ar'}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  locale === 'ar'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                عربي
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label={tNav('searchPlaceholder')}
              title={tNav('searchPlaceholder')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Bouton "Lire les articles" sur ordinateur */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/guides/')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-600/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>{tNav('readArticles')}</span>
            </motion.button>

            {/* Bouton Burger Mobile (3 lignes qui se transforment en X avec animation douce) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-5 h-0.5 bg-current rounded-full block origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="w-5 h-0.5 bg-current rounded-full block"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-5 h-0.5 bg-current rounded-full block origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE COULISSANT DEPUIS LA DROITE (Slide-over avec liens un par un) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Voile d'arrière-plan */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
            />

            {/* Panneau latéral droit */}
            <motion.aside
              key="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              aria-label="Menu mobile"
              className="fixed top-16 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto px-5 py-6 flex flex-col justify-between lg:hidden"
            >
              <div className="space-y-6">
                {/* Liens principaux apparaissant un par un */}
                <nav className="flex flex-col space-y-1.5">
                  {[
                    { label: tNav('home'), path: '/' },
                    { label: tNav('articles'), path: '/guides/' },
                    { label: tNav('tools'), path: '/outils/' },
                    { label: tNav('ai'), path: '/ia/' },
                    { label: tNav('technology'), path: '/programmation/' },
                    { label: tNav('earnMoney'), path: '/kdp/' },
                    { label: tNav('tutorials'), path: '/outils-pdf/' },
                    { label: tNav('about'), path: '/a-propos' },
                    { label: tNav('contact'), path: '/contact' },
                  ].map((item, idx) => {
                    const isActive =
                      item.path === '/'
                        ? currentPath === '/'
                        : currentPath.startsWith(item.path.replace(/\/$/, ''));
                    return (
                      <motion.button
                        key={item.path}
                        type="button"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{
                          duration: 0.28,
                          delay: 0.05 + idx * 0.05,
                          ease: 'easeOut',
                        }}
                        onClick={() => navigate(item.path)}
                        className={`w-full px-4 py-3 rounded-xl text-start text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="w-4 h-4 opacity-60 rtl:rotate-180" />
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Bouton CTA mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  <button
                    type="button"
                    onClick={() => navigate('/guides/')}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{tNav('readArticles')}</span>
                  </button>
                </motion.div>

                {/* Accès rapide aux catégories */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.52 }}
                  className="pt-4 border-t border-slate-200 dark:border-slate-800"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    {tNav('categoriesTitle')}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const loc = getLocalizedCategory(cat.slug, cat.shortName, cat.seoDescription);
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => navigate(cat.url)}
                          className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 underline cursor-pointer"
                        >
                          {loc.name}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MODALE DE RECHERCHE INTERNE RAPIDE */}
      {searchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={tNav('searchPlaceholder')}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tNav('searchPlaceholder')}
                className="w-full bg-transparent text-base sm:text-lg text-slate-900 dark:text-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {tNav('clear')}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Outils correspondants */}
              {searchResults.tools.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    {tNav('tools')} ({searchResults.tools.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {searchResults.tools.map((tool) => {
                      const loc = getLocalizedTool(tool.id, tool.shortName, tool.summary);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => navigate(tool.url)}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:border-blue-500 border border-slate-200 dark:border-slate-800 text-start flex items-center justify-between gap-3 cursor-pointer"
                        >
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {loc.name}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">{loc.summary}</div>
                          </div>
                          <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Articles correspondants */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  {tNav('articles')} ({searchResults.articles.length})
                </h4>
                {searchResults.articles.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">
                    {tNav('noResults')} « {searchQuery} ».
                  </p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.articles.map((art) => {
                      const loc = getLocalizedArticle(art);
                      return (
                        <div
                          key={art.id}
                          onClick={() => navigate(art.url)}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:border-blue-500 border border-slate-200 dark:border-slate-800 flex items-center gap-4 cursor-pointer"
                        >
                          <SafeImage
                            src={art.image}
                            alt={loc.title}
                            className="w-20 h-14 rounded-lg object-cover shrink-0 hidden sm:block"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {loc.categoryName}
                              </span>
                              <span>·</span>
                              <span>{art.date}</span>
                            </div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {loc.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">{loc.excerpt}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Catégories correspondantes */}
              {searchResults.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {tHome('categories')} ({searchResults.categories.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.categories.map((c) => {
                      const loc = getLocalizedCategory(c.slug, c.name, c.seoDescription);
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => navigate(c.url)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {loc.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL SELON LA ROUTE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* ====================================================================
            ROUTE 1 : PAGE D'ACCUEIL (/)
           ==================================================================== */}
        {route.type === 'home' && (
          <>
            <SeoHead
              title={`${SITE_CONFIG.name} — ${tHome('welcome')}`}
              description={tHome('heroSubtitle')}
              path="/"
              breadcrumbs={[{ name: tNav('home'), path: '/' }]}
            />

            {/* 1. HERO SECTION */}
            <section className="py-10 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:col-span-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {tHome('welcome')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{tHome('badgeCategories')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tHome('badgeTools')}</span>
                    </div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-5"
                      style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                    >
                      {tHome('heroTitle')}
                    </motion.h1>

                    <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-4">
                      {tHome('heroSubtitle')}
                    </p>

                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mb-6">
                      {tHome('heroDesc')}
                    </p>

                    {/* Barre de recherche rapide sur la page d'accueil */}
                    <div className="relative max-w-xl mb-6">
                      <Search className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSearchModalOpen(true);
                        }}
                        onFocus={() => setSearchModalOpen(true)}
                        placeholder={tHome('searchArticle')}
                        aria-label={tHome('searchArticle')}
                        className="w-full ps-11 pe-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigate('/guides/')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{tHome('primaryCta')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/outils/')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{tHome('secondaryCta')}</span>
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
                  className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 p-6 sm:p-7 flex flex-col justify-between text-white shadow-sm hover:shadow-xl hover:shadow-slate-900/20 transition-shadow duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-blue-400 mb-3">
                      <span>{tHome('featuredBadge')} · {featuredArt.categoryName}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {tHome('completeGuideBadge')}
                      </span>
                    </div>
                    <h2
                      onClick={() => navigate(ARTICLES[0].url)}
                      className="text-lg sm:text-xl font-bold leading-snug hover:text-blue-400 transition-colors cursor-pointer mb-3"
                    >
                      {featuredArt.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                      {featuredArt.excerpt}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      {[
                        { label: tHome('pillarAiTitle'), sub: tHome('pillarAiSub'), path: '/ia/' },
                        { label: tHome('pillarTechTitle'), sub: tHome('pillarTechSub'), path: '/programmation/' },
                        { label: tHome('pillarMoneyTitle'), sub: tHome('pillarMoneySub'), path: '/kdp/' },
                        { label: tHome('pillarTutoTitle'), sub: tHome('pillarTutoSub'), path: '/outils/' },
                      ].map((pillar) => (
                        <button
                          key={pillar.path}
                          type="button"
                          onClick={() => navigate(pillar.path)}
                          className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-start transition-colors cursor-pointer"
                        >
                          <div className="text-xs font-bold text-white">{pillar.label}</div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{pillar.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span>{ARTICLES[0].readTime} {tHome('readTimeSuffix')}</span>
                    <button
                      type="button"
                      onClick={() => navigate(ARTICLES[0].url)}
                      className="font-bold text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{tHome('readMore')}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 2. SECTION "DERNIERS ARTICLES / À LA UNE" */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    {tHome('editorialSelection')}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {tHome('latestArticles')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/guides/')}
                  className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{tHome('viewAllArticles')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ARTICLES[0], ARTICLES[1], ARTICLES[5], ARTICLES[6]].map((article, idx) => (
                  <ArticleCard key={article.id} article={article} onNavigate={navigate} index={idx} />
                ))}
              </div>
            </section>

            {/* 3. SECTION "INTELLIGENCE ARTIFICIELLE" (3 Articles IA Dédiés sans doublon) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{tHome('aiPoleBadge')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {tHome('aiSectionTitle')}
                  </h2>
                </div>

                {/* Piliers IA cliquables */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: tCategories('chatgptName'), path: '/chatgpt/' },
                    { label: tCategories('geminiName'), path: '/google-ai-gemini/' },
                    { label: tCategories('canvaName'), path: '/canva-creation/' },
                    { label: tCategories('automatisationName'), path: '/automatisation/' },
                    { label: tCategories('iaName'), path: '/ia/' },
                  ].map((pill) => (
                    <button
                      key={pill.path}
                      type="button"
                      onClick={() => navigate(pill.path)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[ARTICLES[4], ARTICLES[7], ARTICLES[9]].map((art, idx) => (
                  <ArticleCard key={art.id} article={art} onNavigate={navigate} index={idx} />
                ))}
              </div>
            </section>

            {/* 4. SECTION "TECHNOLOGIE & PROGRAMMATION" (3 Articles Programmation Dédiés sans doublon) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <Code2 className="w-4 h-4" />
                    <span>{tHome('progPoleBadge')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {tHome('progSectionTitle')}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: tCategories('pythonName'), path: '/python/' },
                    { label: tCategories('phpName'), path: '/php/' },
                    { label: tCategories('javascriptName'), path: '/javascript/' },
                    { label: tCategories('sitesWebName'), path: '/creation-sites-web/' },
                    { label: tCategories('androidName'), path: '/applications-android/' },
                  ].map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[ARTICLES[2], ARTICLES[3], ARTICLES[8]].map((art, idx) => (
                  <ArticleCard key={art.id} article={art} onNavigate={navigate} index={idx} />
                ))}
              </div>
            </section>

            {/* 5. SECTION "OUTILS GRATUITS" (Les 9 Outils Numériques) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <Wrench className="w-4 h-4" />
                    <span>{tHome('toolsPoleBadge')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {tHome('toolsSectionTitle')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/outils/')}
                  className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{tHome('accessAllTools')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TOOLS.map((tool, idx) => {
                  const locTool = getLocalizedTool(tool.id, tool.name, tool.summary);
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{ duration: 0.4, delay: (idx % 3) * 0.08, ease: 'easeOut' }}
                      whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
                      onClick={() => navigate(tool.url)}
                      className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 shadow-xs hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {tTools('freeToolBadge')}
                          </span>
                          <span className="font-mono text-[11px]">{tool.url}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                          {locTool.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {locTool.summary}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span>{tHome('useToolFree')}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* 6. SECTION "TUTORIELS & GUIDES COMPLETS" + ARTICLES POPULAIRES */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="mb-8">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {tHome('guidesPoleBadge')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {tHome('guidesSectionTitle')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: tHome('guide1Title'),
                    desc: tHome('guide1Desc'),
                    path: '/article/comment-creer-une-application-web-avec-l-intelligence-artificielle',
                    tag: tHome('guide1Tag'),
                  },
                  {
                    title: tHome('guide2Title'),
                    desc: tHome('guide2Desc'),
                    path: '/applications-android/',
                    tag: tHome('guide2Tag'),
                  },
                  {
                    title: tHome('guide3Title'),
                    desc: tHome('guide3Desc'),
                    path: '/article/comment-creer-un-livre-kindle-avec-canva',
                    tag: tHome('guide3Tag'),
                  },
                  {
                    title: tHome('guide4Title'),
                    desc: tHome('guide4Desc'),
                    path: '/article/comment-creer-un-site-web-avec-l-ia',
                    tag: tHome('guide4Tag'),
                  },
                ].map((guide, idx) => (
                  <motion.div
                    key={guide.path}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.4, delay: (idx % 2) * 0.1, ease: 'easeOut' }}
                    whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
                    onClick={() => navigate(guide.path)}
                    className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 shadow-xs hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                        {guide.tag}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                        {guide.desc}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                      <span>{tHome('readMore')}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 7. RÉPERTOIRE DES CATÉGORIES (Catégories / التصنيفات) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="mb-8">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {tHome('categoriesPoleBadge')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {tHome('categoriesSectionTitle')}
                </h2>
              </div>

              {/* Les 4 grandes catégories mises en avant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { name: tCategories('ai'), desc: tCategories('iaDesc'), url: '/ia/' },
                  { name: tCategories('tech'), desc: tCategories('programmationDesc'), url: '/programmation/' },
                  { name: tCategories('money'), desc: tCategories('freelanceDesc'), url: '/kdp/' },
                  { name: tCategories('tutorials'), desc: tCategories('guidesDesc'), url: '/guides/' },
                ].map((mainCat) => (
                  <button
                    key={mainCat.url}
                    type="button"
                    onClick={() => navigate(mainCat.url)}
                    className="p-5 rounded-2xl bg-blue-600/5 dark:bg-blue-950/30 border border-blue-500/30 hover:border-blue-600 text-start transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-base font-extrabold text-blue-600 dark:text-blue-400 mb-1.5">
                        {mainCat.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {mainCat.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {CATEGORIES.map((cat) => {
                  const loc = getLocalizedCategory(cat.slug, cat.name, cat.seoDescription);
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => navigate(cat.url)}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 text-start transition-colors cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                          {cat.id < 10 ? `0${cat.id}` : cat.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-1.5">
                          {loc.name}
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-500 line-clamp-2">
                        {loc.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 8. NEWSLETTER */}
            <section className="py-12 sm:py-16">
              <NewsletterBox />
            </section>
          </>
        )}

        {/* ====================================================================
            ROUTE 2 : PAGE CATÉGORIE (/ia/, /python/, /kdp/, etc.) OU /guides/
           ==================================================================== */}
        {(route.type === 'category-detail' || route.type === 'guides-hub') && (() => {
          const isGuidesHub = route.type === 'guides-hub';
          const cat: CategoryInfo = isGuidesHub
            ? {
                id: 0,
                slug: 'guides',
                url: '/guides/',
                name: tCategories('guidesName'),
                shortName: tCategories('guidesName'),
                group: 'Guides',
                seoTitle: `${tCategories('guidesName')} | ${SITE_CONFIG.name}`,
                seoDescription: tCategories('guidesDesc'),
                longDescription: tCategories('guidesDesc'),
                image: ARTICLES[0].image,
                topics: [tCategories('ai'), tCategories('tech'), tCategories('money'), tCategories('tutorials')],
              }
            : route.category;

          const locCat = getLocalizedCategory(cat.slug, cat.name, cat.longDescription);
          const allCatArticles = getArticlesForCategory(cat.slug);
          const displayArticles = allCatArticles.length > 0 ? allCatArticles : ARTICLES;
          const itemsPerPage = 4;
          const totalPages = Math.max(1, Math.ceil(displayArticles.length / itemsPerPage));
          const safePage = Math.min(categoryPageIndex, totalPages);
          const paginatedArticles = displayArticles.slice(
            (safePage - 1) * itemsPerPage,
            safePage * itemsPerPage
          );

          return (
            <div className="py-8 sm:py-12">
              <SeoHead
                title={`${locCat.name} | ${SITE_CONFIG.name}`}
                description={locCat.desc}
                path={cat.url}
                image={cat.image}
                breadcrumbs={[
                  { name: tNav('home'), path: '/' },
                  { name: locCat.name, path: cat.url },
                ]}
              />

              {/* Fil d'Ariane */}
              <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6 flex items-center gap-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">
                  {tNav('home')}
                </button>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-white">{locCat.name}</span>
              </nav>

              {/* En-tête Catégorie avec Fiche Thématique */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-10"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Layers className="w-4 h-4" />
                    <span>{tCategories('thematicDossier')}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {locCat.name}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {locCat.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{tCategories('coveredTopics')}</span>
                    {[tCategories('ai'), tCategories('tech'), tCategories('money'), tCategories('tutorials')].map((t, idx) => (
                      <React.Fragment key={t}>
                        <span>{t}</span>
                        {idx < 3 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 rounded-xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {tCategories('dossierHighlights')}
                    </span>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {displayArticles.length} {tCategories('availableGuides')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[tCategories('ai'), tCategories('tech'), tCategories('money'), tCategories('tutorials')].map((topic) => (
                      <div
                        key={topic}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate"
                      >
                        {topic}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{tCategories('associatedTools')}</span>
                    <button
                      type="button"
                      onClick={() => navigate('/outils/')}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {tCategories('openTools')}
                    </button>
                  </div>
                </div>
              </motion.header>

              {/* Contenu principal + Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {tCategories('articlesAndTutorials')} ({displayArticles.length})
                    </h2>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {tCategories('page')} {safePage} {tCategories('of')} {totalPages}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedArticles.map((art, idx) => (
                      <ArticleCard key={art.id} article={art} onNavigate={navigate} index={idx} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() => setCategoryPageIndex((p) => Math.max(1, p - 1))}
                        className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                        <span>{tCategories('prev')}</span>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCategoryPageIndex(pageNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                            pageNum === safePage
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={safePage >= totalPages}
                        onClick={() => setCategoryPageIndex((p) => Math.min(totalPages, p + 1))}
                        className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{tCategories('next')}</span>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4">{renderSidebar()}</div>
              </div>
            </div>
          );
        })()}

        {/* ====================================================================
            ROUTE 3 : MODÈLE DE PAGE ARTICLE (/article/:slug)
           ==================================================================== */}
        {route.type === 'article-detail' && (() => {
          const { article } = route;
          const locArt = getLocalizedArticle(article);
          const similarArticles = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

          return (
            <div className="py-8 sm:py-12">
              <SeoHead
                title={locArt.title}
                description={locArt.excerpt}
                path={article.url}
                type="article"
                image={article.image}
                articleData={{
                  author: article.author,
                  datePublished: article.date,
                  dateModified: article.updatedDate,
                  category: locArt.categoryName,
                }}
                breadcrumbs={[
                  { name: tNav('home'), path: '/' },
                  { name: locArt.categoryName, path: `/${article.categorySlug}/` },
                  { name: locArt.title, path: article.url },
                ]}
                faq={article.faq}
              />

              {/* Fil d'Ariane */}
              <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">
                  {tNav('home')}
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => navigate(`/${article.categorySlug}/`)}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {locArt.categoryName}
                </button>
                <span>/</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
                  {locArt.title}
                </span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Colonne Principale de l'Article */}
                <article className="lg:col-span-8 space-y-8">
                  <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={() => navigate(`/${article.categorySlug}/`)}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {locArt.categoryName}
                      </button>
                      <span aria-hidden="true">·</span>
                      <span>{tArticles('by')} {article.author}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tArticles('publishedOn')} {article.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                      {locArt.title}
                    </h1>

                    <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                      {locArt.excerpt}
                    </p>
                  </motion.header>

                  {/* Image Principale */}
                  <div className="aspect-16/9 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                    <SafeImage
                      src={article.image}
                      alt={locArt.title}
                      eager
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Introduction */}
                  <div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed max-w-prose">
                    {article.introduction.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {/* Table des matières automatique (TOC) */}
                  <nav
                    aria-label={tArticles('tocTitle')}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
                      <List className="w-4 h-4 text-blue-600" />
                      <span>{tArticles('tocTitle')}</span>
                    </div>
                    <ol className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {article.sections.map((sec) => (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                          >
                            {sec.h2}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href="#conclusion-article"
                          className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                        >
                          {tArticles('conclusionToc')}
                        </a>
                      </li>
                    </ol>
                  </nav>

                  {/* Corps de l'article : Sections H2 / H3, Exemples, Code, Tableaux */}
                  <div className="space-y-10">
                    {article.sections.map((sec) => (
                      <section key={sec.id} id={sec.id} className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                          {sec.h2}
                        </h2>
                        {sec.h3 && (
                          <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                            {sec.h3}
                          </h3>
                        )}
                        <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-prose">
                          {sec.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>

                        {/* Encadré d'exemple pratique */}
                        {sec.exampleBox && (
                          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                              {sec.exampleBox.title}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line font-mono leading-relaxed">
                              {sec.exampleBox.content}
                            </p>
                          </div>
                        )}

                        {/* Bloc de code avec copie en 1 clic */}
                        {sec.codeBlock && (
                          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
                            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
                              <span className="font-mono text-slate-300 truncate">
                                {sec.codeBlock.title} ({sec.codeBlock.language})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(sec.id, sec.codeBlock!.code)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer shrink-0"
                              >
                                {copiedCodeId === sec.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{tArticles('copied')}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>{tArticles('copyCode')}</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
                              <code>{sec.codeBlock.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Tableau comparatif */}
                        {sec.table && (
                          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-start border-collapse text-xs sm:text-sm">
                              <caption className="p-3 text-start text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                {sec.table.caption}
                              </caption>
                              <thead>
                                <tr className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                                  {sec.table.headers.map((h) => (
                                    <th
                                      key={h}
                                      className="p-3.5 font-bold border-b border-slate-200 dark:border-slate-800"
                                    >
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {sec.table.rows.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td
                                        key={cIdx}
                                        className={`p-3.5 align-top ${
                                          cIdx === 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                                        }`}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>
                    ))}
                  </div>

                  {/* Bloc Affiliation / Recommandation d'outils */}
                  {article.recommendations && (
                    <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {tArticles('recommendationBadge')}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {article.recommendations.title}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/outils/')}
                          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 underline cursor-pointer"
                        >
                          {tArticles('compareSolutions')}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {article.recommendations.items.map((rec) => (
                          <div
                            key={rec.name}
                            className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3"
                          >
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {rec.name}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {rec.purpose}
                              </p>
                              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1.5">
                                {tArticles('strengthLabel')} {rec.strengths}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigate(rec.url)}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold w-fit cursor-pointer"
                            >
                              <span>{tArticles('viewTool')}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Conclusion */}
                  <section
                    id="conclusion-article"
                    className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 scroll-mt-24"
                  >
                    <h2 className="text-lg sm:text-xl font-bold">{tArticles('conclusionTitle')}</h2>
                    {article.conclusion.map((c, idx) => (
                      <p key={idx} className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {c}
                      </p>
                    ))}
                  </section>

                  {/* FAQ éventuelle (avec Schema.org FAQPage automatique) */}
                  {article.faq && article.faq.length > 0 && (
                    <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {tArticles('faqTitle')}
                      </h2>
                      <div className="space-y-3">
                        {article.faq.map((f, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                          >
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                              {f.question}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {f.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Boutons de partage */}
                  <div className="py-5 border-t border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span>{tArticles('shareLabel')}</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleShareCopy}
                        className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{shareCopied ? tArticles('linkCopied') : tArticles('copyLink')}</span>
                      </button>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(locArt.title)}&body=${encodeURIComponent(
                          `${locArt.title} — ${SITE_CONFIG.siteUrl}${article.url}`
                        )}`}
                        className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-xs font-semibold"
                      >
                        {tArticles('shareEmail')}
                      </a>
                    </div>
                  </div>

                  {/* Articles similaires */}
                  <section className="pt-4">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-5">
                      {tArticles('relatedArticles')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {similarArticles.map((sim, idx) => (
                        <ArticleCard key={sim.id} article={sim} onNavigate={navigate} index={idx} />
                      ))}
                    </div>
                  </section>
                </article>

                {/* Sidebar sur ordinateur (passe sous le contenu sur mobile) */}
                <div className="lg:col-span-4">{renderSidebar()}</div>
              </div>
            </div>
          );
        })()}

        {/* ====================================================================
            ROUTE 4 : HUB DES OUTILS GRATUITS (/outils/)
           ==================================================================== */}
        {route.type === 'tools-hub' && (
          <div className="py-8 sm:py-12 space-y-10">
            <SeoHead
              title={`${tTools('hubTitle')} | ${SITE_CONFIG.name}`}
              description={tTools('hubDesc')}
              path="/outils/"
              breadcrumbs={[
                { name: tNav('home'), path: '/' },
                { name: tNav('tools'), path: '/outils/' },
              ]}
            />

            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                {tTools('hubBadge')}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                {tTools('hubTitle')}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {tTools('hubDesc')}
              </p>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOLS.map((tool, idx) => {
                const locTool = getLocalizedTool(tool.id, tool.name, tool.summary);
                return (
                  <motion.article
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.4, delay: (idx % 3) * 0.08, ease: 'easeOut' }}
                    whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
                    onClick={() => navigate(tool.url)}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 shadow-xs hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {tTools('freeToolBadge')}
                        </span>
                        <span className="font-mono">{tool.url}</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {locTool.name}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {locTool.summary}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>{tHome('openTool')}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            ROUTE 5 : PAGE SEO D'UN OUTIL GRATUIT (/outils/:slug/)
           ==================================================================== */}
        {route.type === 'tool-detail' && (() => {
          const { tool } = route;
          const locTool = getLocalizedTool(tool.id, tool.name, tool.summary);
          return (
            <div className="py-8 sm:py-12 space-y-10">
              <SeoHead
                title={`${locTool.name} | ${SITE_CONFIG.name}`}
                description={locTool.summary}
                path={tool.url}
                type="software"
                breadcrumbs={[
                  { name: tNav('home'), path: '/' },
                  { name: tNav('tools'), path: '/outils/' },
                  { name: locTool.name, path: tool.url },
                ]}
                faq={tool.faq}
              />

              <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">
                  {tNav('home')}
                </button>
                <span>/</span>
                <button type="button" onClick={() => navigate('/outils/')} className="hover:text-blue-600 cursor-pointer">
                  {tNav('tools')}
                </button>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-white">{locTool.name}</span>
              </nav>

              <header className="max-w-3xl">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
                  {tTools('freeToolBadge')} · {tool.category}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                  {locTool.name}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {locTool.summary}
                </p>
              </header>

              {/* Espace Interactif de l'Outil */}
              <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
                <InteractiveToolWidget toolSlug={tool.slug} />
              </section>

              {/* Guide d'utilisation SEO & FAQ de l'outil */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                <div className="lg:col-span-7 space-y-6">
                  <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {tTools('howToTitle')}
                    </h2>
                    <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                      {tool.howToSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            0{idx + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {tool.faq.length > 0 && (
                    <section className="space-y-3">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {tTools('faqTitle')}
                      </h2>
                      {tool.faq.map((f, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                        >
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                            {f.question}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {f.answer}
                          </p>
                        </div>
                      ))}
                    </section>
                  )}
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                      {tTools('otherToolsTitle')}
                    </h3>
                    <div className="space-y-2">
                      {TOOLS.filter((t) => t.slug !== tool.slug).map((other) => {
                        const locOther = getLocalizedTool(other.id, other.name, other.summary);
                        return (
                          <button
                            key={other.id}
                            type="button"
                            onClick={() => navigate(other.url)}
                            className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-600 text-start flex items-center justify-between text-xs sm:text-sm font-semibold cursor-pointer"
                          >
                            <span>{locOther.name}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 rtl:rotate-180" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ====================================================================
            ROUTE 6 : PAGES STATIQUES (/a-propos/, /contact/, pages légales)
           ==================================================================== */}
        {route.type === 'about' && (
          <>
            <SeoHead
              title={`${tNav('about')} — ${SITE_CONFIG.name}`}
              description={tFooter('tagline')}
              path="/a-propos/"
              breadcrumbs={[
                { name: tNav('home'), path: '/' },
                { name: tNav('about'), path: '/a-propos/' },
              ]}
            />
            <AboutPage onNavigate={navigate} />
          </>
        )}

        {route.type === 'contact' && (
          <>
            <SeoHead
              title={`${tNav('contact')} — ${SITE_CONFIG.name}`}
              description={tFooter('tagline')}
              path="/contact/"
              breadcrumbs={[
                { name: tNav('home'), path: '/' },
                { name: tNav('contact'), path: '/contact/' },
              ]}
            />
            <ContactPage />
          </>
        )}

        {route.type === 'legal' && (
          <>
            <SeoHead
              title={
                route.subtype === 'confidentialite'
                  ? `${tFooter('privacy')} | ${SITE_CONFIG.name}`
                  : route.subtype === 'mentions-legales'
                  ? `${tFooter('legal')} | ${SITE_CONFIG.name}`
                  : `${tFooter('terms')} | ${SITE_CONFIG.name}`
              }
              description={tFooter('tagline')}
              path={`/${route.subtype}/`}
            />
            <LegalPage type={route.subtype} />
          </>
        )}
      </main>

      {/* PIED DE PAGE (FOOTER) */}
      <footer className="bg-black text-white border-t border-slate-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-neutral-900">
          {/* 1. Présentation TechIA Lab */}
          <div className="space-y-3">
            <div className="text-lg font-extrabold tracking-tight text-white">
              {SITE_CONFIG.name}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {tFooter('tagline')}
            </p>
          </div>

          {/* 2. Liens rapides / روابط سريعة */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              {tFooter('quickLinks')}
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button type="button" onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
                  {tNav('home')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/guides/')} className="hover:text-white cursor-pointer">
                  {tNav('articles')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/outils/')} className="hover:text-white cursor-pointer">
                  {tNav('tools')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/a-propos/')} className="hover:text-white cursor-pointer">
                  {tNav('about')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/contact/')} className="hover:text-white cursor-pointer">
                  {tNav('contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Catégories / التصنيفات */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              {tFooter('categoriesCol')}
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button type="button" onClick={() => navigate('/ia/')} className="hover:text-white cursor-pointer">
                  {tCategories('ai')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/programmation/')} className="hover:text-white cursor-pointer">
                  {tCategories('tech')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/kdp/')} className="hover:text-white cursor-pointer">
                  {tCategories('money')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/guides/')} className="hover:text-white cursor-pointer">
                  {tCategories('tutorials')}
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Suivez-nous / تابعنا & Conformité */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              {tFooter('followUs')}
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button type="button" onClick={() => navigate('/contact/')} className="hover:text-white cursor-pointer">
                  {SITE_CONFIG.contactEmail}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/confidentialite/')} className="hover:text-white cursor-pointer">
                  {tFooter('privacy')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/mentions-legales/')} className="hover:text-white cursor-pointer">
                  {tFooter('legal')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/conditions-utilisation/')} className="hover:text-white cursor-pointer">
                  {tFooter('terms')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-neutral-400 tracking-wide">
            {tFooter('copyright')}
          </p>
        </div>
      </footer>

      {/* BANNIÈRE DE CONSENTEMENT COOKIES GOOGLE ADSENSE */}
      {!cookiesAccepted && (
        <div
          role="region"
          aria-label="Cookies"
          className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 text-white border-t border-slate-800 px-4 py-3"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-slate-300 text-center sm:text-start">
              {tFooter('cookieText')}
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/confidentialite/')}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                {tFooter('privacy')}
              </button>
              <button
                type="button"
                onClick={handleAcceptCookies}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
              >
                {tFooter('cookieAccept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
