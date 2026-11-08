/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  Menu,
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
          Veille Technique & Tutoriels
        </div>
        <h3
          className={`font-extrabold tracking-tight mb-2 ${
            compact ? 'text-lg text-slate-900 dark:text-white' : 'text-2xl sm:text-3xl text-white'
          }`}
        >
          {SITE_CONFIG.newsletter.title}
        </h3>
        <p
          className={`text-sm leading-relaxed mb-5 ${
            compact ? 'text-slate-600 dark:text-slate-400' : 'text-slate-300'
          }`}
        >
          {SITE_CONFIG.newsletter.description}
        </p>

        {status === 'success' ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Inscription enregistrée. Merci pour votre intérêt !</span>
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
              placeholder="Votre adresse email..."
              aria-label="Adresse email pour la newsletter"
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
              {SITE_CONFIG.newsletter.buttonLabel}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-500 mt-2">
            Veuillez saisir une adresse email valide.
          </p>
        )}
      </div>
    </div>
  );
};

// Reusable Article Card
const ArticleCard: React.FC<{
  article: Article;
  onNavigate: (path: string) => void;
}> = ({ article, onNavigate }) => {
  return (
    <article className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors overflow-hidden flex flex-col justify-between">
      <div>
        <div
          onClick={() => onNavigate(article.url)}
          className="aspect-16/9 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
        >
          <SafeImage
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
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
              {article.categoryName}
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
            {article.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {article.isCompleteGuide ? 'Guide complet' : 'Tutoriel pratique'}
        </span>
        <button
          type="button"
          onClick={() => onNavigate(article.url)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Lire l'article</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};

export default function App() {
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

  // Global internal search across Articles, Categories, Tools, and Guides
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return {
        articles: ARTICLES.slice(0, 4),
        tools: TOOLS.slice(0, 4),
        categories: CATEGORIES.slice(0, 5),
      };
    }

    const matchedArticles = ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.categoryName.toLowerCase().includes(q) ||
        a.sections.some((s) => s.h2.toLowerCase().includes(q))
    );

    const matchedTools = TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );

    const matchedCategories = CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.seoDescription.toLowerCase().includes(q) ||
        c.topics.some((topic) => topic.toLowerCase().includes(q))
    );

    return {
      articles: matchedArticles,
      tools: matchedTools,
      categories: matchedCategories,
    };
  }, [searchQuery]);

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
          Recherche rapide
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchModalOpen(true);
            }}
            onFocus={() => setSearchModalOpen(true)}
            placeholder="Articles, outils, Python, KDP..."
            aria-label="Rechercher sur le site"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Sidebar Categories */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Catégories principales
        </h3>
        <ul className="divide-y divide-slate-200/70 dark:divide-slate-800 text-xs sm:text-sm">
          {CATEGORIES.slice(0, 10).map((cat) => (
            <li key={cat.slug} className="py-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(cat.url)}
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-left cursor-pointer"
              >
                {cat.name}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Articles */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Guides populaires
        </h3>
        <div className="space-y-4">
          {ARTICLES.slice(0, 4).map((art, i) => (
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
                  {art.title}
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">{art.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Newsletter */}
      <NewsletterBox compact />
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            {SITE_CONFIG.name}
          </a>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="Navigation principale"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {SITE_CONFIG.headerNav.map((item) => {
              const isActive =
                item.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(item.path.replace(/\/$/, ''));
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8'
                      : ''
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Search + Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Rechercher sur le site"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Rechercher...</span>
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              title={darkMode ? 'Mode clair (☀️)' : 'Mode sombre (🌙)'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Menu de navigation mobile"
              className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Hamburger */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-5 space-y-4 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              {SITE_CONFIG.headerNav.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Accès direct aux 15 catégories
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => navigate(cat.url)}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 underline cursor-pointer"
                  >
                    {cat.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MODALE DE RECHERCHE INTERNE RAPIDE */}
      {searchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Recherche globale TechIA Lab"
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
                placeholder="Rechercher un article, un outil gratuit (PDF, QR Code), une catégorie..."
                className="w-full bg-transparent text-base sm:text-lg text-slate-900 dark:text-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Effacer
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
                    Outils Gratuits ({searchResults.tools.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {searchResults.tools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => navigate(tool.url)}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:border-blue-500 border border-slate-200 dark:border-slate-800 text-left flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {tool.shortName}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">{tool.summary}</div>
                        </div>
                        <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles correspondants */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Articles & Guides ({searchResults.articles.length})
                </h4>
                {searchResults.articles.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">
                    Aucun article trouvé pour « {searchQuery} ».
                  </p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.articles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => navigate(art.url)}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:border-blue-500 border border-slate-200 dark:border-slate-800 flex items-center gap-4 cursor-pointer"
                      >
                        <SafeImage
                          src={art.image}
                          alt={art.imageAlt}
                          className="w-20 h-14 rounded-lg object-cover shrink-0 hidden sm:block"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {art.categoryName}
                            </span>
                            <span>·</span>
                            <span>{art.date}</span>
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {art.title}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Catégories correspondantes */}
              {searchResults.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Catégories ({searchResults.categories.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.categories.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => navigate(c.url)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {c.name}
                      </button>
                    ))}
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
              title={`${SITE_CONFIG.name} — ${SITE_CONFIG.slogan}`}
              description={SITE_CONFIG.positioning}
              path="/"
              breadcrumbs={[{ name: 'Accueil', path: '/' }]}
            />

            {/* 1. HERO SECTION */}
            <section className="py-10 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        Portail Francophone {SITE_CONFIG.name}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>15 Catégories Spécialisées</span>
                      <span aria-hidden="true">·</span>
                      <span>9 Outils Gratuits en Ligne</span>
                    </div>

                    <h1
                      className="font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-5"
                      style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                    >
                      {SITE_CONFIG.hero.title}
                    </h1>

                    <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-4">
                      {SITE_CONFIG.hero.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mb-8">
                      {SITE_CONFIG.positioning}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigate('/guides/')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{SITE_CONFIG.hero.primaryCta}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/outils/')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{SITE_CONFIG.hero.secondaryCta}</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 p-6 sm:p-7 flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-blue-400 mb-3">
                      <span>DOSSIER PHARE · {ARTICLES[0].categoryName.toUpperCase()}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">GUIDE COMPLET</span>
                    </div>
                    <h2
                      onClick={() => navigate(ARTICLES[0].url)}
                      className="text-lg sm:text-xl font-bold leading-snug hover:text-blue-400 transition-colors cursor-pointer mb-3"
                    >
                      {ARTICLES[0].title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 line-clamp-3">
                      {ARTICLES[0].excerpt}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      {[
                        { label: 'Pôle IA & LLM', sub: 'ChatGPT, Gemini, Prompts', path: '/ia/' },
                        { label: 'Programmation', sub: 'Python, PHP 8, JS/TS', path: '/programmation/' },
                        { label: '9 Outils Gratuits', sub: 'PDF, QR Code, Calculs', path: '/outils/' },
                        { label: 'Édition & KDP', sub: 'Canva, Kindle, Broché', path: '/kdp/' },
                      ].map((pillar) => (
                        <button
                          key={pillar.path}
                          type="button"
                          onClick={() => navigate(pillar.path)}
                          className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors cursor-pointer"
                        >
                          <div className="text-xs font-bold text-white">{pillar.label}</div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{pillar.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span>{ARTICLES[0].readTime} de lecture</span>
                    <button
                      type="button"
                      onClick={() => navigate(ARTICLES[0].url)}
                      className="font-bold text-blue-400 hover:underline cursor-pointer"
                    >
                      Consulter le dossier →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. SECTION "À LA UNE" (4 Dossiers Principaux - Images 100% Uniques) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    Sélection Éditoriale
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    À la Une
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/guides/')}
                  className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Voir tous les guides</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ARTICLES[0], ARTICLES[1], ARTICLES[5], ARTICLES[6]].map((article) => (
                  <ArticleCard key={article.id} article={article} onNavigate={navigate} />
                ))}
              </div>
            </section>

            {/* 3. SECTION "INTELLIGENCE ARTIFICIELLE" (3 Articles IA Dédiés sans doublon) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Pôle Intelligence Artificielle</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Intelligence Artificielle : ChatGPT, Gemini & Automatisation
                  </h2>
                </div>

                {/* Piliers IA cliquables */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'ChatGPT', path: '/chatgpt/' },
                    { label: 'Google AI / Gemini', path: '/google-ai-gemini/' },
                    { label: 'Génération d’images & Design', path: '/canva-creation/' },
                    { label: 'Automatisation IA', path: '/automatisation/' },
                    { label: 'Outils IA', path: '/ia/' },
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
                {[ARTICLES[4], ARTICLES[7], ARTICLES[9]].map((art) => (
                  <ArticleCard key={art.id} article={art} onNavigate={navigate} />
                ))}
              </div>
            </section>

            {/* 4. SECTION "PROGRAMMATION" (3 Articles Programmation Dédiés sans doublon) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <Code2 className="w-4 h-4" />
                    <span>Développement & Ingénierie Logicielle</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Programmation : Python, PHP, JavaScript & Web
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Python', path: '/python/' },
                    { label: 'PHP', path: '/php/' },
                    { label: 'JavaScript', path: '/javascript/' },
                    { label: 'Développement Web', path: '/creation-sites-web/' },
                    { label: 'Applications', path: '/applications-android/' },
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
                {[ARTICLES[2], ARTICLES[3], ARTICLES[8]].map((art) => (
                  <ArticleCard key={art.id} article={art} onNavigate={navigate} />
                ))}
              </div>
            </section>

            {/* 5. SECTION "OUTILS GRATUITS" (Les 9 Outils Numériques) */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <Wrench className="w-4 h-4" />
                    <span>Utilitaires Web 100 % Locaux & Gratuits</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Outils Numériques Gratuits en Ligne
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/outils/')}
                  className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Accéder à tous les outils</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TOOLS.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => navigate(tool.url)}
                    className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {tool.category}
                        </span>
                        <span className="font-mono text-[11px]">{tool.url}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {tool.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>Utiliser l’outil gratuitement</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. SECTION "GUIDES COMPLETS" */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="mb-8">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Dossiers Pas à Pas de A à Z
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Guides Complets pour Créer vos Projets
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Créer une application web de A à Z',
                    desc: 'Architecture frontend/backend, typage TypeScript, sécurité des clés API et mise en production.',
                    path: '/article/comment-creer-une-application-web-avec-l-intelligence-artificielle',
                    tag: 'Application Web',
                  },
                  {
                    title: 'Créer une application Android & Mobile',
                    desc: 'Concevoir une interface mobile fluide, installer une Progressive Web App (PWA) et structurer son projet.',
                    path: '/applications-android/',
                    tag: 'Android & Mobile',
                  },
                  {
                    title: 'Créer un livre Kindle et Broché sur Amazon KDP',
                    desc: 'Formats en pouces/cm, calcul de la tranche, marges avec fond perdu dans Canva et redevances.',
                    path: '/article/comment-creer-un-livre-kindle-avec-canva',
                    tag: 'Kindle & KDP',
                  },
                  {
                    title: 'Créer un site web professionnel avec l’IA',
                    desc: 'Structure HTML5 sémantique, Core Web Vitals, SEO technique et compatibilité Google AdSense.',
                    path: '/article/comment-creer-un-site-web-avec-l-ia',
                    tag: 'Site Web & SEO',
                  },
                ].map((guide) => (
                  <div
                    key={guide.title}
                    onClick={() => navigate(guide.path)}
                    className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-colors cursor-pointer flex flex-col justify-between"
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
                      <span>Consulter le guide complet</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. RÉPERTOIRE DES 15 CATÉGORIES PRINCIPALES */}
            <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
              <div className="mb-8">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Exploration Thématique
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Les 15 Catégories du Portail {SITE_CONFIG.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => navigate(cat.url)}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 text-left transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                        {cat.id < 10 ? `0${cat.id}` : cat.id}. {cat.group}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-1.5">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 line-clamp-2">
                      {cat.seoDescription}
                    </span>
                  </button>
                ))}
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
                name: 'Guides Complets de A à Z',
                shortName: 'Guides Complets',
                group: 'Guides',
                seoTitle: 'Guides Complets : IA, Applications Web, Python et KDP | TechIA Lab',
                seoDescription:
                  'Tous nos dossiers complets étape par étape pour créer une application web, maîtriser Python, publier un livre KDP et automatiser vos projets.',
                longDescription:
                  'Retrouvez ici l’ensemble de nos grands dossiers méthodologiques structurés avec exemples de code, tableaux comparatifs et feuilles de route.',
                image: ARTICLES[0].image,
                topics: ['Application Web A à Z', 'Python Complet', 'Amazon KDP', 'Site Web IA'],
              }
            : route.category;

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
                title={cat.seoTitle}
                description={cat.seoDescription}
                path={cat.url}
                image={cat.image}
                breadcrumbs={[
                  { name: 'Accueil', path: '/' },
                  { name: cat.name, path: cat.url },
                ]}
              />

              {/* Fil d'Ariane */}
              <nav aria-label="Fil d'Ariane" className="text-xs text-slate-500 mb-6 flex items-center gap-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">
                  Accueil
                </button>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-white">{cat.name}</span>
              </nav>

              {/* En-tête Catégorie avec Fiche Thématique */}
              <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-10">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Layers className="w-4 h-4" />
                    <span>Dossier Thématique · {cat.group}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {cat.name}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {cat.longDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Sujets couverts :</span>
                    {cat.topics.map((t, idx) => (
                      <React.Fragment key={t}>
                        <span>{t}</span>
                        {idx < cat.topics.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 rounded-xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Repères du Dossier
                    </span>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {displayArticles.length} guides disponibles
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {cat.topics.slice(0, 4).map((topic) => (
                      <div
                        key={topic}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate"
                      >
                        {topic}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Outils interactifs associés</span>
                    <button
                      type="button"
                      onClick={() => navigate('/outils/')}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Ouvrir les outils →
                    </button>
                  </div>
                </div>
              </header>

              {/* Contenu principal + Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Articles & Tutoriels ({displayArticles.length})
                    </h2>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      Page {safePage} sur {totalPages}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedArticles.map((art) => (
                      <ArticleCard key={art.id} article={art} onNavigate={navigate} />
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
                        <ChevronLeft className="w-4 h-4" />
                        <span>Précédent</span>
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
                        <span>Suivant</span>
                        <ChevronRight className="w-4 h-4" />
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
          const similarArticles = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

          return (
            <div className="py-8 sm:py-12">
              <SeoHead
                title={article.seoTitle}
                description={article.metaDescription}
                path={article.url}
                type="article"
                image={article.image}
                articleData={{
                  author: article.author,
                  datePublished: article.date,
                  dateModified: article.updatedDate,
                  category: article.categoryName,
                }}
                breadcrumbs={[
                  { name: 'Accueil', path: '/' },
                  { name: article.categoryName, path: `/${article.categorySlug}/` },
                  { name: article.title, path: article.url },
                ]}
                faq={article.faq}
              />

              {/* Fil d'Ariane */}
              <nav aria-label="Fil d'Ariane" className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">
                  Accueil
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => navigate(`/${article.categorySlug}/`)}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {article.categoryName}
                </button>
                <span>/</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
                  {article.title}
                </span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Colonne Principale de l'Article */}
                <article className="lg:col-span-8 space-y-8">
                  <header className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={() => navigate(`/${article.categorySlug}/`)}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {article.categoryName}
                      </button>
                      <span aria-hidden="true">·</span>
                      <span>Par {article.author}</span>
                      <span aria-hidden="true">·</span>
                      <span>Publié le {article.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                      {article.title}
                    </h1>
                  </header>

                  {/* Image Principale */}
                  <div className="aspect-16/9 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                    <SafeImage
                      src={article.image}
                      alt={article.imageAlt}
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
                    aria-label="Sommaire de l'article"
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
                      <List className="w-4 h-4 text-blue-600" />
                      <span>Sommaire de l’article</span>
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
                          Conclusion & Points clés à retenir
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
                                    <span>Copié</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copier le code</span>
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
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                              <caption className="p-3 text-left text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
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
                            Notre recommandation
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
                          Comparer les solutions
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
                                Point fort : {rec.strengths}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigate(rec.url)}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold w-fit cursor-pointer"
                            >
                              <span>Voir l’outil</span>
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
                    <h2 className="text-lg sm:text-xl font-bold">Conclusion</h2>
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
                        Questions fréquentes sur ce sujet
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
                      <span>Partager ce tutoriel :</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleShareCopy}
                        className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{shareCopied ? 'Lien copié !' : 'Copier le lien'}</span>
                      </button>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(
                          `${article.title} — ${SITE_CONFIG.siteUrl}${article.url}`
                        )}`}
                        className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-xs font-semibold"
                      >
                        Partager par Email
                      </a>
                    </div>
                  </div>

                  {/* Articles similaires */}
                  <section className="pt-4">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-5">
                      Articles similaires à découvrir
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {similarArticles.map((sim) => (
                        <ArticleCard key={sim.id} article={sim} onNavigate={navigate} />
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
              title={`Outils Numériques Gratuits en Ligne (PDF, QR Code, Texte, Dev) | ${SITE_CONFIG.name}`}
              description="Utilisez gratuitement nos 9 outils numériques en ligne : convertisseur PDF vers images, images vers PDF, fusionner/compresser PDF, QR Code, compteur de mots et calculateurs."
              path="/outils/"
              breadcrumbs={[
                { name: 'Accueil', path: '/' },
                { name: 'Outils Gratuits', path: '/outils/' },
              ]}
            />

            <header className="max-w-3xl">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Boîte à Outils {SITE_CONFIG.name}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                Outils Gratuits en Ligne
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Tous nos utilitaires fonctionnent directement dans votre navigateur,
                sans inscription obligatoire et dans le respect total de la
                confidentialité de vos documents.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOLS.map((tool) => (
                <article
                  key={tool.id}
                  onClick={() => navigate(tool.url)}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {tool.category}
                      </span>
                      <span className="font-mono">{tool.url}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {tool.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {tool.summary}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Ouvrir l’outil</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            ROUTE 5 : PAGE SEO D'UN OUTIL GRATUIT (/outils/:slug/)
           ==================================================================== */}
        {route.type === 'tool-detail' && (() => {
          const { tool } = route;
          return (
            <div className="py-8 sm:py-12 space-y-10">
              <SeoHead
                title={tool.seoTitle}
                description={tool.seoDescription}
                path={tool.url}
                type="software"
                breadcrumbs={[
                  { name: 'Accueil', path: '/' },
                  { name: 'Outils Gratuits', path: '/outils/' },
                  { name: tool.shortName, path: tool.url },
                ]}
                faq={tool.faq}
              />

              <nav aria-label="Fil d'Ariane" className="text-xs text-slate-500 flex items-center gap-2">
                <button type="button" onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">
                  Accueil
                </button>
                <span>/</span>
                <button type="button" onClick={() => navigate('/outils/')} className="hover:text-blue-600 cursor-pointer">
                  Outils Gratuits
                </button>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-white">{tool.shortName}</span>
              </nav>

              <header className="max-w-3xl">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
                  Outil Gratuit · {tool.category}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                  {tool.name}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tool.summary}
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
                      Comment utiliser cet outil étape par étape ?
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
                        Questions fréquentes
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
                      Autres outils gratuits {SITE_CONFIG.name}
                    </h3>
                    <div className="space-y-2">
                      {TOOLS.filter((t) => t.slug !== tool.slug).map((other) => (
                        <button
                          key={other.id}
                          type="button"
                          onClick={() => navigate(other.url)}
                          className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-600 text-left flex items-center justify-between text-xs sm:text-sm font-semibold cursor-pointer"
                        >
                          <span>{other.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
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
              title={`À Propos de ${SITE_CONFIG.name} — Objectif, Philosophie et Équipe`}
              description={`Découvrez la mission éditoriale de ${SITE_CONFIG.name} : tutoriels d'intelligence artificielle, programmation et outils numériques gratuits.`}
              path="/a-propos/"
              breadcrumbs={[
                { name: 'Accueil', path: '/' },
                { name: 'À Propos', path: '/a-propos/' },
              ]}
            />
            <AboutPage onNavigate={navigate} />
          </>
        )}

        {route.type === 'contact' && (
          <>
            <SeoHead
              title={`Contactez ${SITE_CONFIG.name} — Formulaire et Support`}
              description={`Contactez la rédaction de ${SITE_CONFIG.name} pour toute question technique, suggestion de guide ou signalement.`}
              path="/contact/"
              breadcrumbs={[
                { name: 'Accueil', path: '/' },
                { name: 'Contact', path: '/contact/' },
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
                  ? `Politique de Confidentialité & Cookies AdSense | ${SITE_CONFIG.name}`
                  : route.subtype === 'mentions-legales'
                  ? `Mentions Légales | ${SITE_CONFIG.name}`
                  : `Conditions Générales d'Utilisation | ${SITE_CONFIG.name}`
              }
              description={`Informations légales et politique de confidentialité du portail ${SITE_CONFIG.name}.`}
              path={`/${route.subtype}/`}
            />
            <LegalPage type={route.subtype} />
          </>
        )}
      </main>

      {/* PIED DE PAGE (FOOTER) */}
      <footer className="bg-black text-white border-t border-slate-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-neutral-900">
          <div className="space-y-3">
            <div className="text-lg font-extrabold tracking-tight text-white">
              {SITE_CONFIG.name}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {SITE_CONFIG.slogan} {SITE_CONFIG.positioning}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Pôles Thématiques
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button type="button" onClick={() => navigate('/ia/')} className="hover:text-white cursor-pointer">
                  Intelligence artificielle
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/chatgpt/')} className="hover:text-white cursor-pointer">
                  ChatGPT & Google Gemini
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/python/')} className="hover:text-white cursor-pointer">
                  Programmation Python & JS
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/kdp/')} className="hover:text-white cursor-pointer">
                  Kindle & Amazon KDP
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/automatisation/')} className="hover:text-white cursor-pointer">
                  Automatisation & Freelance
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Outils Gratuits Populaires
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button type="button" onClick={() => navigate('/outils/pdf-vers-images/')} className="hover:text-white cursor-pointer">
                  PDF vers Images (PNG/WebP)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/outils/fusionner-pdf/')} className="hover:text-white cursor-pointer">
                  Fusionner & Compresser PDF
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/outils/qr-code/')} className="hover:text-white cursor-pointer">
                  Générateur de QR Code
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/outils/compteur-de-mots/')} className="hover:text-white cursor-pointer">
                  Compteur de Mots SEO
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/outils/calculateur/')} className="hover:text-white cursor-pointer">
                  Calculateur TJM & KDP
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Informations & Conformité
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button type="button" onClick={() => navigate('/a-propos/')} className="hover:text-white cursor-pointer">
                  À propos
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/contact/')} className="hover:text-white cursor-pointer">
                  Contact ({SITE_CONFIG.contactEmail})
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/confidentialite/')} className="hover:text-white cursor-pointer">
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/mentions-legales/')} className="hover:text-white cursor-pointer">
                  Mentions légales
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/conditions-utilisation/')} className="hover:text-white cursor-pointer">
                  Conditions d’utilisation
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-neutral-400 tracking-wide">
            © 2026 Mahfoud - Tous droits réservés | {SITE_CONFIG.name}
          </p>
        </div>
      </footer>

      {/* BANNIÈRE DE CONSENTEMENT COOKIES GOOGLE ADSENSE */}
      {!cookiesAccepted && (
        <div
          role="region"
          aria-label="Consentement aux cookies"
          className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 text-white border-t border-slate-800 px-4 py-3"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-slate-300 text-center sm:text-left">
              Ce site utilise Google AdSense Auto Ads et des cookies pour mesurer
              l’audience et améliorer votre expérience de navigation.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/confidentialite/')}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Politique de confidentialité
              </button>
              <button
                type="button"
                onClick={handleAcceptCookies}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
              >
                J’accepte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
