/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Mail, ShieldCheck, Send, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { useLocale, useTranslations } from '../i18n/next-intl';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

/* ============================================================================
   1. PAGE À PROPOS (/a-propos/)
   ============================================================================ */
export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const t = useTranslations('about');

  return (
    <article className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          {t('badge')}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          {t('title')} — {SITE_CONFIG.name}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('subtitle')}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('missionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('missionDesc')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('philosophyTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('philosophyDesc')}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('contentTypesTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
              {t('type1Title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('type1Desc')}
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
              {t('type2Title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('type2Desc')}
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
              {t('type3Title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('type3Desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('creatorTitle')}
        </h2>
        <div className="space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>{t('editorLabel')}</strong> {SITE_CONFIG.creatorPlaceholder.name}
          </p>
          <p>
            <strong>{t('domainLabel')}</strong> {t('domainValue')}
          </p>
          <p>{t('bio')}</p>
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/contact/')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
          >
            {t('contactBtn')}
          </button>
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600"
          >
            <Mail className="w-4 h-4" />
            <span>{SITE_CONFIG.contactEmail}</span>
          </a>
        </div>
      </section>
    </article>
  );
};

/* ============================================================================
   2. PAGE CONTACT (/contact/) AVEC PROTECTION ANTI-SPAM & VALIDATION
   ============================================================================ */
export const ContactPage: React.FC = () => {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // Anti-spam honeypot field (must remain empty) + math challenge
  const [honeypot, setHoneypot] = useState('');
  const [humanAnswer, setHumanAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const sanitizeInput = (val: string) => val.replace(/[<>]/g, '').trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (honeypot !== '') {
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      setErrorMsg(t('errWait'));
      return;
    }

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanMessage = sanitizeInput(message);

    if (cleanName.length < 2) {
      setErrorMsg(t('errName'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg(t('errEmail'));
      return;
    }
    if (cleanMessage.length < 2) {
      setErrorMsg(t('errMessage'));
      return;
    }
    if (humanAnswer.trim() !== '' && humanAnswer.trim() !== '7') {
      setErrorMsg(t('errCaptcha'));
      return;
    }

    setLastSubmitTime(now);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12">
      <header className="mb-8">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          {t('badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          {t('title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('subtitle')}{' '}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="font-semibold text-blue-600 dark:text-blue-400 underline"
          >
            {SITE_CONFIG.contactEmail}
          </a>
        </p>
      </header>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-bold text-lg">
            <Check className="w-6 h-6 shrink-0" />
            <span>{t('successTitle')}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {t('successDesc')}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(
                sanitizeInput(subject || t('title'))
              )}&body=${encodeURIComponent(
                `${t('nameLabel')}: ${sanitizeInput(name)} (${sanitizeInput(email)})\n\n${sanitizeInput(message)}`
              )}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>{t('sendViaMail')} ({SITE_CONFIG.contactEmail})</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
                setHumanAnswer('');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
            >
              {t('newMessage')}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5"
        >
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Champ Honeypot invisible pour les robots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website-url-hp">Honeypot</label>
            <input
              id="website-url-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold mb-1.5">
                {t('nameLabel')} *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold mb-1.5">
                {t('emailLabel')} *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-sm font-semibold mb-1.5">
              {t('subjectLabel')}
            </label>
            <input
              id="contact-subject"
              type="text"
              maxLength={140}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('subjectPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold mb-1.5">
              {t('messageLabel')} *
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              maxLength={2500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messagePlaceholder')}
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <label htmlFor="contact-captcha" className="text-xs sm:text-sm font-semibold">
                {t('captchaLabel')}
              </label>
              <input
                id="contact-captcha"
                type="text"
                value={humanAnswer}
                onChange={(e) => setHumanAnswer(e.target.value)}
                placeholder="7"
                className="w-16 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-center font-mono text-sm font-bold"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('submitBtn')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

/* ============================================================================
   3. PAGES LÉGALES (/confidentialite/, /mentions-legales/, /conditions-utilisation/)
   ============================================================================ */
export const LegalPage: React.FC<{
  type: 'confidentialite' | 'mentions-legales' | 'conditions-utilisation';
}> = ({ type }) => {
  const { locale } = useLocale();
  const isAr = locale === 'ar';

  if (type === 'confidentialite') {
    return (
      <article className="max-w-4xl mx-auto py-8 sm:py-12 space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            {isAr ? 'سياسة الخصوصية وملفات تعريف الارتباط (Cookies)' : 'Politique de Confidentialité & Cookies'}
          </h1>
          <p className="text-xs font-mono text-slate-500">
            {isAr ? 'آخر تحديث: 2026 · البريد:' : 'Dernière mise à jour : 2026 · Contact :'} {SITE_CONFIG.contactEmail}
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '1. حماية البيانات والأدوات التي تعمل محلياً' : '1. Protection des données et outils exécutés localement'}
          </h2>
          <p>
            {isAr
              ? `في ${SITE_CONFIG.name}، خصوصية الزوار هي أولويتنا. جميع الملفات والنصوص التي تعالجها في أدواتنا المجانية (تحويل PDF، عداد الكلمات، مولد كلمات المرور، رمز QR) تتم معالجتها محلياً داخل متصفحك ولا يتم تخزينها على خوادمنا أبداً.`
              : `Sur ${SITE_CONFIG.name}, la confidentialité des visiteurs est une priorité. Les fichiers et textes que vous traitez dans nos outils gratuits sont traités localement dans votre navigateur et ne sont jamais stockés sur nos serveurs.`}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '2. إعلانات Google AdSense وملفات تعريف الارتباط' : '2. Google AdSense et Cookies publicitaires (DART)'}
          </h2>
          <p>
            {isAr
              ? `يستخدم هذا الموقع Google AdSense (${SITE_CONFIG.adsensePublisherId}) مع الإعلانات التلقائية (Auto Ads) لعرض الإعلانات. تستخدم شركة Google ملفات تعريف الارتباط لعرض إعلانات ملائمة للمستخدمين.`
              : `Ce site utilise Google AdSense (${SITE_CONFIG.adsensePublisherId}) avec les annonces automatiques (Auto Ads) pour afficher des publicités.`}
          </p>
        </section>
      </article>
    );
  }

  if (type === 'mentions-legales') {
    return (
      <article className="max-w-4xl mx-auto py-8 sm:py-12 space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            {isAr ? 'إشعار قانوني' : 'Mentions Légales'}
          </h1>
          <p className="text-xs font-mono text-slate-500">
            {SITE_CONFIG.name} · {SITE_CONFIG.contactEmail}
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? '1. ناشر الموقع' : '1. Éditeur de la publication'}
          </h2>
          <p>
            <strong>{isAr ? 'اسم الموقع:' : 'Nom du site :'}</strong> {SITE_CONFIG.name}
            <br />
            <strong>{isAr ? 'المسؤول:' : 'Responsable éditorial :'}</strong> {SITE_CONFIG.creatorPlaceholder.name}
            <br />
            <strong>{isAr ? 'البريد الإلكتروني:' : 'Email de contact :'}</strong> {SITE_CONFIG.contactEmail}
          </p>
        </section>
      </article>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-8 sm:py-12 space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          {isAr ? 'شروط الاستخدام' : 'Conditions Générales d’Utilisation (CGU)'}
        </h1>
        <p className="text-xs font-mono text-slate-500">
          {SITE_CONFIG.name}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isAr ? '1. الوصول المجاني للمحتوى والأدوات' : '1. Accès gratuit aux contenus et utilitaires'}
        </h2>
        <p>
          {isAr
            ? `الوصول إلى جميع المقالات والدروس والأدوات الرقمية عبر الإنترنت في ${SITE_CONFIG.name} مجاني تماماً ولأغراض تعليمية وتثقيفية.`
            : `L’accès aux articles, tutoriels de programmation et outils numériques en ligne de ${SITE_CONFIG.name} est gratuit.`}
        </p>
      </section>
    </article>
  );
};
