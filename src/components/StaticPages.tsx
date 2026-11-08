/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Mail, ShieldCheck, Send, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

/* ============================================================================
   1. PAGE À PROPOS (/a-propos/)
   ============================================================================ */
export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <article className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          À Propos de la Plateforme
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          {SITE_CONFIG.name} — {SITE_CONFIG.slogan}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {SITE_CONFIG.positioning}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Objectif du site
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {SITE_CONFIG.name} a pour mission de rendre accessibles les technologies
            modernes — intelligence artificielle, programmation Python/JavaScript,
            création d’applications web, auto-édition Kindle KDP et automatisation —
            à travers des guides structurés et des outils gratuits utilisables sans
            inscription.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Philosophie éditoriale
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Nous privilégions systématiquement la clarté technique, les exemples
            de code réellement testables et l’honnêteté intellectuelle : aucune
            fausse promesse de gain irréaliste, aucune statistique inventée et un
            respect strict de l’expérience de lecture.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Types de contenus proposés
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
              1. Tutoriels & Guides de fond
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Dossiers pas à pas couvrant ChatGPT, Google Gemini, Python, PHP,
              JavaScript, la création de sites web et l’édition Amazon KDP.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
              2. Outils numériques gratuits
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Utilitaires exécutés localement dans votre navigateur : conversion et
              fusion PDF, générateur de QR Code, compteur de mots et calculateurs.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
              3. Comparatifs & Recommandations
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Sélections méthodiques de bibliothèques open-source et d’outils
              numériques éprouvés pour accompagner vos projets.
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Présentation du créateur
        </h2>
        <div className="space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>Éditeur / Responsable :</strong> {SITE_CONFIG.creatorPlaceholder.name}
          </p>
          <p>
            <strong>Domaine d’activité :</strong> {SITE_CONFIG.creatorPlaceholder.role}
          </p>
          <p>{SITE_CONFIG.creatorPlaceholder.bio}</p>
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/contact/')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
          >
            Nous contacter
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

    // 1. Honeypot check
    if (honeypot !== '') {
      return;
    }

    // 2. Rate limiting check (minimum 5s between attempts)
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      setErrorMsg('Veuillez patienter quelques secondes avant un nouvel envoi.');
      return;
    }

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanSubject = sanitizeInput(subject);
    const cleanMessage = sanitizeInput(message);

    // 3. Strict validation
    if (cleanName.length < 2) {
      setErrorMsg('Veuillez indiquer votre nom (au moins 2 caractères).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Veuillez saisir une adresse email valide.');
      return;
    }
    if (cleanSubject.length < 3) {
      setErrorMsg('Veuillez préciser le sujet de votre message.');
      return;
    }
    if (cleanMessage.length < 15) {
      setErrorMsg('Votre message doit contenir au moins 15 caractères.');
      return;
    }
    if (humanAnswer.trim() !== '7') {
      setErrorMsg('Vérification anti-spam incorrecte : combien font 4 + 3 ?');
      return;
    }

    setLastSubmitTime(now);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12">
      <header className="mb-8">
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          Support & Échanges Éditoriaux
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Contacter l’équipe {SITE_CONFIG.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Une question sur un tutoriel, une suggestion d’outil gratuit ou une
          demande d’information ? Remplissez le formulaire ci-dessous ou écrivez
          directement à{' '}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="font-semibold text-blue-600 dark:text-blue-400 underline"
          >
            {SITE_CONFIG.contactEmail}
          </a>
          .
        </p>
      </header>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-bold text-lg">
            <Check className="w-6 h-6 shrink-0" />
            <span>Votre message a bien été préparé et validé.</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Merci <strong>{sanitizeInput(name)}</strong>. Vous pouvez également
            transmettre directement votre message par client mail vers notre
            adresse officielle en cliquant sur le bouton ci-dessous :
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(
                sanitizeInput(subject)
              )}&body=${encodeURIComponent(
                `De : ${sanitizeInput(name)} (${sanitizeInput(email)})\n\n${sanitizeInput(message)}`
              )}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>Envoyer via ma messagerie ({SITE_CONFIG.contactEmail})</span>
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
              Nouveau message
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
            <label htmlFor="website-url-hp">Ne pas remplir ce champ</label>
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
                Nom complet *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold mb-1.5">
                Email *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-sm font-semibold mb-1.5">
              Sujet *
            </label>
            <input
              id="contact-subject"
              type="text"
              required
              maxLength={140}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Suggestion de guide, question technique, partenariat..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold mb-1.5">
              Message *
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              maxLength={2500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détaillez votre demande ici..."
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <label htmlFor="contact-captcha" className="text-xs sm:text-sm font-semibold">
                Anti-spam : Combien font 4 + 3 ? *
              </label>
              <input
                id="contact-captcha"
                type="text"
                required
                value={humanAnswer}
                onChange={(e) => setHumanAnswer(e.target.value)}
                placeholder="?"
                className="w-16 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-center font-mono text-sm font-bold"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer</span>
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
  if (type === 'confidentialite') {
    return (
      <article className="max-w-4xl mx-auto py-8 sm:py-12 space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Politique de Confidentialité & Cookies
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Dernière mise à jour : 7 Novembre 2026 · Contact : {SITE_CONFIG.contactEmail}
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Protection des données et outils exécutés localement
          </h2>
          <p>
            Sur <strong>{SITE_CONFIG.name}</strong>, la confidentialité des visiteurs
            est une priorité. Les fichiers et textes que vous traitez dans nos
            outils gratuits (convertisseurs PDF, compteur de mots, générateur de
            mot de passe, QR Code) sont traités localement dans votre navigateur
            et ne sont jamais stockés sur nos serveurs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Google AdSense et Cookies publicitaires (DART)
          </h2>
          <p>
            Ce site utilise <strong>Google AdSense</strong> (identifiant éditeur{' '}
            <code className="font-mono text-xs">{SITE_CONFIG.adsensePublisherId}</code>)
            avec les annonces automatiques (Auto Ads) pour afficher des publicités.
            Google, en tant que fournisseur tiers, utilise des cookies pour
            diffuser des annonces sur ce site.
          </p>
          <p>
            L’utilisation du cookie DART par Google lui permet de diffuser des
            annonces aux utilisateurs en fonction de leur visite sur ce site et
            sur d’autres sites Internet. Les utilisateurs peuvent désactiver
            l’utilisation du cookie DART et personnaliser leurs préférences en
            consultant la page officielle de Google :{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline break-all"
            >
              https://policies.google.com/technologies/ads
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Vos droits (Accès, Rectification et Suppression)
          </h2>
          <p>
            Vous disposez à tout moment d’un droit d’accès, de modification et de
            suppression des données vous concernant (notamment lors d’une demande
            de contact ou d’inscription à la newsletter) en adressant un email à{' '}
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="text-blue-600 dark:text-blue-400 underline"
            >
              {SITE_CONFIG.contactEmail}
            </a>
            .
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
            Mentions Légales
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Informations légales relatives à l’édition du portail {SITE_CONFIG.name}
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Éditeur de la publication
          </h2>
          <p>
            <strong>Nom du site :</strong> {SITE_CONFIG.name}
            <br />
            <strong>Responsable éditorial :</strong> {SITE_CONFIG.creatorPlaceholder.name}
            <br />
            <strong>Email de contact :</strong> {SITE_CONFIG.contactEmail}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Propriété intellectuelle
          </h2>
          <p>
            L’ensemble des guides, articles, structures pédagogiques et outils
            présents sur {SITE_CONFIG.name} sont protégés par le droit d’auteur.
            Les extraits de code publiés dans les tutoriels peuvent être librement
            utilisés dans vos projets personnels et professionnels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Liens externes et transparence
          </h2>
          <p>
            Certains articles peuvent contenir des liens vers des outils tiers ou
            des recommandations logicielles. Lorsqu’un lien revêt un caractère
            affilié, celui-ci est systématiquement signalé de manière explicite au
            lecteur.
          </p>
        </section>
      </article>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-8 sm:py-12 space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Conditions Générales d’Utilisation (CGU)
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Règles d’utilisation des guides et outils gratuits de {SITE_CONFIG.name}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          1. Accès gratuit aux contenus et utilitaires
        </h2>
        <p>
          L’accès aux articles, tutoriels de programmation et outils numériques en
          ligne de {SITE_CONFIG.name} est gratuit. Les informations et simulateurs
          sont fournis à titre pédagogique et informatif.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          2. Responsabilité technique
        </h2>
        <p>
          Bien que chaque tutoriel et outil fasse l’objet de vérifications
          soignées, l’utilisateur reste seul responsable de la sauvegarde de ses
          fichiers et de l’application des scripts dans ses environnements de
          production.
        </p>
      </section>
    </article>
  );
};
