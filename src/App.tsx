/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const PAYHIP_URL = 'https://payhip.com/b/8cbQk';
const CONTACT_EMAIL = 'mustaphasoufisme@gmail.com';
const HERO_IMAGE_PATH = '/src/assets/images/hero_mahfoud_method_1794016407072.jpg';

interface ModuleItem {
  id: number;
  numberLabel: string;
  title: string;
  darijaSubtitle: string;
  description: string;
  deliverable: string;
  duration: string;
  steps: string[];
  featured?: boolean;
}

const MODULES: ModuleItem[] = [
  {
    id: 1,
    numberLabel: 'Module 1',
    title: 'Module 1 : Les bases',
    darijaSubtitle: 'Kifach kaykhdem l’business digital f l’Maghrib bla ta39id',
    description:
      'Comprends exactement comment fonctionne la vente de produits digitaux sur internet au Maroc et à l’international, sans stock, sans livraison et sans capital de départ.',
    deliverable: 'Feuille de route de démarrage + checklist des outils 100% gratuits',
    duration: '45 min',
    steps: [
      'Comprendre le modèle des produits numériques à marge 100%',
      'Les erreurs classiques des débutants (et comment les éviter dès le jour 1)',
      'Préparer ton téléphone ou PC pour travailler efficacement en 1h par jour',
    ],
  },
  {
    id: 2,
    numberLabel: 'Module 2',
    title: 'Module 2 : Trouver une idée rentable',
    darijaSubtitle: 'L9a fikra li nass مستعدين ikhalsou 3liha daba',
    description:
      'La méthode exacte pour repérer un problème précis que les gens cherchent à résoudre aujourd’hui et le transformer en une offre simple qui se vend.',
    deliverable: 'Liste de 15 niches rentables validées + grille de sélection rapide',
    duration: '50 min',
    steps: [
      'Identifier les sujets qui génèrent des achats impulsifs entre 50 DH et 200 DH',
      'Valider la demande réelle sur TikTok et Instagram en 15 minutes',
      'Choisir ton positionnement clair même si tu n’as aucune expertise technique',
    ],
  },
  {
    id: 3,
    numberLabel: 'Module 3',
    title: 'Module 3 : Créer ton produit en 1 jour',
    darijaSubtitle: 'Sawb l’produit dyalek f nhar wahed b tari9a ihtirafiya',
    description:
      'Pas besoin d’écrire 200 pages. Apprends à structurer et produire un guide pratique, un mini-atelier ou un pack de templates prêt à être téléchargé en moins de 24 heures.',
    deliverable: 'Modèles Canva prêts à remplir + structure de guide étape par étape',
    duration: '1h 15',
    featured: true,
    steps: [
      'La structure en 5 parties d’un guide numérique que les clients lisent vraiment',
      'Mise en page propre et professionnelle sur Canva (sans être designer)',
      'Exporter ton fichier PDF final et préparer le lien de livraison automatique',
    ],
  },
  {
    id: 4,
    numberLabel: 'Module 4',
    title: 'Module 4 : Créer ta page de vente',
    darijaSubtitle: 'Page de vente kat9ne3 l’client ichri bla ma t7taj t7awer m3ah',
    description:
      'Construis une page claire, rapide et persuasive sur Payhip qui présente ton offre, répond aux objections et encaisse automatiquement 24h/24.',
    deliverable: 'Template de texte de vente (Français + Darija) prêt à copier-coller',
    duration: '1h 00',
    steps: [
      'Écrire un titre accrocheur qui capte l’attention immédiatement',
      'Présenter tes modules et ta garantie pour inspirer confiance',
      'Paramétrer Payhip en 15 minutes pour livrer le produit instantanément après achat',
    ],
  },
  {
    id: 5,
    numberLabel: 'Module 5',
    title: 'Module 5 : Trouver des clients sur TikTok',
    darijaSubtitle: 'Jib l’clients men TikTok bla ma tban b wejhek ila ma bghitich',
    description:
      'Le système de contenu organique pour attirer des acheteurs qualifiés tous les jours sur TikTok et Instagram Reels sans dépenser 1 DH en publicité payante.',
    deliverable: '20 scripts de vidéos courtes + formules d’accroches virales',
    duration: '1h 20',
    featured: true,
    steps: [
      'La formule des vidéos de 15 à 30 secondes qui transforment les vues en clics',
      'Comment créer du contenu "faceless" (sans montrer ton visage) propre et crédible',
      'Optimiser ta bio et ton lien pour convertir les visiteurs en acheteurs à 50 DH+',
    ],
  },
  {
    id: 6,
    numberLabel: 'Module 6',
    title: 'Module 6 : Encaisser tes premiers paiements',
    darijaSubtitle: 'Kifach t9bel l’khlass b la carte bancaire w t7awel floussek',
    description:
      'Configure tes moyens de paiement en toute sécurité pour recevoir tes ventes par carte bancaire et retirer tes gains vers ton compte au Maroc.',
    deliverable: 'Guide complet de configuration Payhip + suivi de tes premiers 1000 DH',
    duration: '40 min',
    steps: [
      'Relier ton compte de paiement à Payhip étape par étape',
      'Gérer la livraison automatique du fichier et l’email de confirmation client',
      'Plan d’action sur 14 jours pour passer de ta 1ère vente à la barre des 1000 DH',
    ],
  },
];

interface Testimonial {
  name: string;
  city: string;
  role: string;
  resultMetric: string;
  timeframe: string;
  quoteFr: string;
  quoteDarija: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Salma de Casablanca',
    city: 'Casablanca',
    role: 'Étudiante en gestion',
    resultMetric: '1 350 DH générés',
    timeframe: 'En 11 jours',
    quoteFr:
      'Je partais de zéro complet. J’ai appliqué le Module 3 un dimanche pour créer mon guide d’organisation et publié 4 vidéos avec les scripts du Module 5. J’ai fait mes 27 premières ventes à 50 DH en moins de deux semaines.',
    quoteDarija:
      'Wallah ma kount 3arfa mnin نبدا. La méthode MAHFOUD sahla bzaf w kolchi mchrou7 b تفصيل.',
  },
  {
    name: 'Yassine de Fès',
    city: 'Fès',
    role: 'Jeune diplômé',
    resultMetric: '1 100 DH encaissés',
    timeframe: 'Dès sa 1ère semaine',
    quoteFr:
      'Ce qui m’a débloqué c’est la partie sur Payhip et TikTok sans montrer son visage. Ma page de vente était prête en une soirée et mon premier paiement est tombé le lendemain soir.',
    quoteDarija:
      '50 DH hiya a7san investissement drtou had l’3am. Rbe7t ktar men 20 merra taman l’formation.',
  },
  {
    name: 'Imane de Rabat',
    city: 'Rabat',
    role: 'Freelance débutante',
    resultMetric: '1 600 DH de ventes',
    timeframe: 'Sur son 1er mois',
    quoteFr:
      'J’avais peur du côté technique et des paiements en ligne. Le Module 6 montre exactement où cliquer étape par étape. Aujourd’hui mes clients reçoivent leur fichier automatiquement même quand je dors.',
    quoteDarija:
      'Chokran MAHFOUD! Tari9a na9ya, mafihach l’hedra l’khawya, ghir tatbi9 nichan.',
  },
];

interface FaqItem {
  question: string;
  shortTag: string;
  answerFr: string;
  answerDarija: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    shortTag: 'Débutant ?',
    question: 'Débutant ? Est-ce que la formation est adaptée si je pars de zéro ?',
    answerFr:
      'Oui, à 100%. La méthode MAHFOUD a été conçue spécifiquement pour ceux qui n’ont jamais rien vendu sur internet. Chaque étape est filmée et expliquée simplement, sans jargon technique, et tu peux tout appliquer depuis un simple smartphone ou un ordinateur.',
    answerDarija:
      'Wakha ma 3emrek b3ti 7ta درهم f internet, ghatb3 l’khotowat wa7da b wa7da men Module 1 tal Module 6.',
  },
  {
    shortTag: 'Comment je reçois le produit ?',
    question: 'Comment je reçois le produit après mon achat ?',
    answerFr:
      'L’accès est immédiat et automatique. Dès que ton paiement de 50 DH est validé sur Payhip, tu es redirigé vers la page de téléchargement et tu reçois également un email instantané avec ton accès complet aux 6 modules.',
    answerDarija:
      'Mor l’khlass nichan kaytle3 lik lien dyal téléchargement w kayوصلك email fih kolchi f نفس الدقيقة.',
  },
  {
    shortTag: 'Paiement ?',
    question: 'Paiement ? Est-ce que le paiement de 50 DH est sécurisé ?',
    answerFr:
      'Oui, tous les paiements sont traités de manière 100% sécurisée via la plateforme internationale Payhip par carte bancaire (Visa, Mastercard, CMI dotation e-commerce). Aucune information bancaire n’est stockée sur notre site.',
    answerDarija:
      'L’khlass sécurisé 100% via Payhip b la carte bancaire dyalek bla 7ta mochkil.',
  },
  {
    shortTag: 'Remboursement ?',
    question: 'Remboursement ? Comment fonctionne la garantie de 7 jours ?',
    answerFr:
      'Tu bénéficies d’une garantie satisfait ou remboursé de 7 jours. Si tu suis les modules et que tu estimes que la méthode ne t’apporte pas la valeur promise, il te suffit d’envoyer un email à mustaphasoufisme@gmail.com dans les 7 jours suivant ton achat.',
    answerDarija:
      '3ndek Garantie 7 jours: ila ma 3jbatekch la méthode, sifth lina email w nrej3ou lik floussek.',
  },
];

function AdSenseUnit({ id }: { id: 'adsense-1' | 'adsense-2' }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script handles duplicate pushes or preview sandbox gracefully
    }
  }, []);

  return (
    <section aria-label="Annonce" className="max-w-6xl mx-auto px-4 sm:px-6 my-6">
      <div
        id={id}
        className="w-full min-h-[90px] overflow-hidden"
        dangerouslySetInnerHTML={{
          __html: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5562107411098538" data-ad-slot="AUTO" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
        }}
      />
    </section>
  );
}

export default function App() {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mahfoud_cookies_accepted') === 'true';
    } catch {
      return false;
    }
  });
  const [whatsAppDrawerOpen, setWhatsAppDrawerOpen] = useState<boolean>(false);
  const [heroImageError, setHeroImageError] = useState<boolean>(false);
  const [targetSalesCount, setTargetSalesCount] = useState<number>(20);

  const activeModule =
    MODULES.find((m) => m.id === selectedModuleId) || MODULES[0];

  const handleAcceptCookies = () => {
    setCookiesAccepted(true);
    try {
      localStorage.setItem('mahfoud_cookies_accepted', 'true');
    } catch {
      // Ignore storage error in restricted mode
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPrivacyOpen(false);
        setWhatsAppDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900">
      {/* 1. HEADER FIXE (Strict 3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-950 whitespace-nowrap shrink-0"
          >
            MAHFOUD
          </a>
         {/* PUB ADSENSE DEBUT */}
<div style={{ textAlign: 'center', margin: '20px 0' }}>
  {/* Mets ici ton code AdSense */}
</div>
{/* FIN PUB ADSENSE */} 

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <a
              href="#programme"
              className="hover:text-stone-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Programme
            </a>
            <a
              href="#avis"
              className="hover:text-stone-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Avis
            </a>
            <a
              href="#prix"
              className="hover:text-stone-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Tarif
            </a>
            <a
              href="#faq"
              className="hover:text-stone-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <a
              href={PAYHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#FF5A00] hover:bg-[#E04F00] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A00]"
            >
              <span>Acheter - 50 DH</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section className="pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-stone-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Core Proposition */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-stone-600 mb-4">
                    <span className="text-[#FF5A00] font-semibold">
                      Formation Pratique Français + Darija
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>6 Modules Étape par Étape</span>
                    <span aria-hidden="true">·</span>
                    <span>Accès Immédiat</span>
                  </div>

                  <h1
                    className="font-extrabold tracking-tight text-stone-950 leading-[1.08] mb-5"
                    style={{ fontSize: 'clamp(2.25rem, 4vw, 3.6rem)' }}
                  >
                    Gagne tes premiers 1000 DH sur internet, sans expérience.
                  </h1>

                  <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mb-4">
                    La méthode MAHFOUD, étape par étape, même si tu pars de zéro.
                  </p>

                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mb-8">
                    Bla ma tkoun expert f l’informatique w bla rasmale kbir :
                    découvre comment créer un produit digital simple en 1 jour,
                    attirer tes premiers acheteurs sur TikTok et encaisser tes
                    paiements sur Payhip.
                  </p>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                    <a
                      href={PAYHIP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm sm:text-base font-extrabold text-white bg-[#FF5A00] hover:bg-[#E04F00] rounded-xl shadow-sm transition-transform active:scale-[0.99] whitespace-nowrap shrink-0"
                    >
                      <span>JE VEUX COMMENCER - 50 DH</span>
                      <ArrowUpRight className="w-5 h-5 shrink-0" />
                    </a>

                    <div className="flex items-baseline gap-2 text-sm text-stone-600 font-mono tabular-nums">
                      <span className="line-through text-stone-400">499 DH</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-stone-900">
                        50 DH seulement aujourd’hui
                      </span>
                    </div>
                  </div>

                  {/* Preuve obligatoire (clean unboxed text) */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-stone-700 pt-2 border-t border-stone-200/80">
                    <span className="font-semibold text-stone-950">
                      ⭐ 4.9/5 - Paiement sécurisé
                    </span>
                    <span aria-hidden="true" className="text-stone-300">
                      ·
                    </span>
                    <span>Livraison instantanée via Payhip</span>
                    <span aria-hidden="true" className="text-stone-300">
                      ·
                    </span>
                    <span>Garantie 7 jours</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Showcase & Interactive Goal Calculator */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-stone-200/90 overflow-hidden">
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                  {!heroImageError ? (
                    <img
                      src={HERO_IMAGE_PATH}
                      alt="Espace de travail méthode MAHFOUD — guide pratique et ordinateur"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-900 text-white text-center">
                      <span className="font-mono text-xs text-[#FF5A00] mb-2">
                        MÉTHODE MAHFOUD — ÉDITION 2026
                      </span>
                      <p className="text-xl font-bold">
                        Système Complet : 0 DH à 1 000 DH
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        6 Modules Pratiques · Français & Darija
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-4 text-white">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                      <span>OBJECTIF : 1 000 DH</span>
                      <span>PRIX D’ACCÈS : 50 DH</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Simulator inside the Hero Showcase */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-stone-500">
                        Calculateur rapide (Produit à 50 DH)
                      </span>
                      <span className="font-mono text-xs font-bold text-[#FF5A00] tabular-nums">
                        {targetSalesCount} ventes = {targetSalesCount * 50} DH
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={40}
                      step={2}
                      value={targetSalesCount}
                      onChange={(e) => setTargetSalesCount(Number(e.target.value))}
                      aria-label="Simuler le nombre de ventes à 50 DH"
                      className="w-full accent-[#FF5A00] cursor-pointer"
                    />
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <span>
                      Seulement <strong className="text-stone-900">1 vente</strong> rembourse ta formation (50 DH)
                    </span>
                    <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                      20 ventes = 1000 DH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* 4. CE QUE TU REÇOIS : 6 MODULES */}
        <section
          id="programme"
          className="py-14 sm:py-20 border-t border-b border-stone-200/80 bg-white"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5A00] mb-2">
                <span>Programme Complet</span>
                <span aria-hidden="true">·</span>
                <span>6 Modules Actionnables</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-950 mb-3">
                Ce que tu reçois immédiatement dans la méthode MAHFOUD
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Pas de théorie inutile. Chaque module te montre exactement quoi
                faire, étape par étape, en Français clair et en Darija, pour
                lancer ton produit et encaisser tes premières ventes.
              </p>
            </div>

            {/* Asymmetric Bento Grid of the 6 Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {MODULES.map((mod) => {
                const isSelected = mod.id === selectedModuleId;
                return (
                  <article
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`group cursor-pointer rounded-xl p-6 transition-colors border flex flex-col justify-between ${
                      mod.featured ? 'md:col-span-2' : 'md:col-span-1'
                    } ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-[#FF5A00]'
                        : 'bg-[#FAF8F5]/60 border-stone-200/90 hover:border-stone-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-500 font-mono tabular-nums mb-3">
                        <span className="font-bold text-[#FF5A00]">
                          0{mod.id}. {mod.numberLabel}
                        </span>
                        <span>Durée : {mod.duration}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-stone-950 mb-1.5">
                        {mod.title}
                      </h3>

                      <p className="text-xs sm:text-sm font-medium text-stone-700 mb-3">
                        « {mod.darijaSubtitle} »
                      </p>

                      <p className="text-sm text-stone-600 leading-relaxed mb-5">
                        {mod.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-200/70 flex items-center justify-between gap-4 text-xs">
                      <span className="text-stone-700 font-medium">
                        Inclus : {mod.deliverable}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModuleId(mod.id);
                        }}
                        className="font-semibold text-[#FF5A00] hover:underline whitespace-nowrap shrink-0"
                      >
                        {isSelected ? 'Détails affichés' : 'Voir le plan'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Interactive Module Detail Bar */}
            <div className="rounded-xl bg-stone-950 text-white p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5">
                  <div className="text-xs font-mono text-[#FF5A00] mb-1">
                    APERÇU DU CONTENU · MODULE 0{activeModule.id}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {activeModule.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {activeModule.deliverable}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <ul className="space-y-2.5">
                    {activeModule.steps.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs sm:text-sm text-stone-200"
                      >
                        <Check className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

  

        {/* 6. AVIS (Salma de Casablanca, Yassine de Fès, Imane de Rabat) */}
        <section
          id="avis"
          className="py-14 sm:py-20 border-t border-stone-200/80"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5A00] mb-2">
                  <span>Preuves & Résultats Réels</span>
                  <span aria-hidden="true">·</span>
                  <span>Note moyenne ⭐ 4.9/5</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-950">
                  Ils ont appliqué la méthode MAHFOUD au Maroc
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md">
                Retours d’élèves ayant lancé leur premier produit digital avec
                la méthode étape par étape.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((item) => (
                <article
                  key={item.name}
                  className="bg-white rounded-xl border border-stone-200/90 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums text-stone-500 pb-4 mb-4 border-b border-stone-100">
                      <span className="font-bold text-emerald-700">
                        {item.resultMetric}
                      </span>
                      <span>{item.timeframe}</span>
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed mb-4">
                      « {item.quoteFr} »
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-stone-900 bg-[#FAF8F5] p-3 rounded-lg mb-5">
                      Darija : « {item.quoteDarija} »
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-950">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {item.role} · {item.city}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-stone-800 font-mono">
                      ⭐ 5.0/5
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. PRIX (499 DH barré, 50 DH, Bouton Vert PAYER PAR CARTE - Via Payhip) */}
        <section
          id="prix"
          className="py-14 sm:py-20 bg-stone-950 text-white border-t border-stone-800"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl bg-stone-900 border border-stone-800 p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#FF5A00] mb-3">
                    <span>Offre Spéciale Lancement</span>
                    <span aria-hidden="true">·</span>
                    <span>Accès Complet à Vie</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4">
                    Passe à l’action aujourd’hui et lance ta première source de
                    revenus en ligne
                  </h2>

                  <p className="text-sm text-stone-300 leading-relaxed mb-6">
                    Tu reçois immédiatement les 6 modules complets, les modèles
                    de produits, le script de page de vente et la méthode TikTok
                    pour viser tes premiers 1000 DH.
                  </p>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200 mb-6">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span>Les 6 modules complets (Français + Darija)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span>Modèles Canva & scripts TikTok prêts à l’emploi</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span>Support par email : {CONTACT_EMAIL}</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-5 bg-stone-950 border border-stone-800 rounded-xl p-6 text-center flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-stone-400 mb-2">
                      Tarif unique — Aucun abonnement mensuel
                    </p>

                    <div className="flex items-baseline justify-center gap-3 my-4 font-mono tabular-nums">
                      <span className="text-xl sm:text-2xl text-stone-500 line-through">
                        499 DH
                      </span>
                      <span className="text-4xl sm:text-5xl font-extrabold text-white">
                        50 DH
                      </span>
                    </div>

                    <p className="text-xs text-[#FF5A00] font-medium mb-6">
                      Économise 449 DH (-90% aujourd’hui)
                    </p>
                  </div>

                  <div>
                    <a
                      href={PAYHIP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm sm:text-base font-extrabold text-stone-950 bg-[#25D366] hover:bg-[#20bd5a] rounded-xl transition-transform active:scale-[0.99] whitespace-nowrap shrink-0"
                    >
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>PAYER PAR CARTE - Via Payhip</span>
                    </a>

                    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-200">
                      <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span>Accès immédiat - Garantie 7 jours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section
          id="faq"
          className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-stone-200/80"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="mb-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5A00] mb-2">
                <span>Questions Fréquentes</span>
                <span aria-hidden="true">·</span>
                <span>Réponses Claires</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950">
                Tout savoir avant de commencer
              </h2>
            </div>

            <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.shortTag} className="py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? -1 : index)
                      }
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 text-left py-2 focus-visible:outline-2 focus-visible:outline-[#FF5A00]"
                    >
                      <span className="text-base sm:text-lg font-bold text-stone-950">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-[#FF5A00]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pt-2 pb-3 space-y-2 text-sm text-stone-700 leading-relaxed">
                        <p>{faq.answerFr}</p>
                        <p className="text-xs sm:text-sm font-medium text-stone-900">
                          Darija : {faq.answerDarija}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="bg-white border-t border-stone-200/90 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-lg font-extrabold tracking-tight text-stone-950">
              MAHFOUD
            </span>
            <p className="text-xs text-stone-500 mt-1">
              © 2026 MAHFOUD. Tous droits réservés.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-stone-600">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 hover:text-stone-950 transition-colors"
            >
              <Mail className="w-4 h-4 text-[#FF5A00]" />
              <span>{CONTACT_EMAIL}</span>
            </a>

            <span aria-hidden="true" className="text-stone-300">
              ·
            </span>

            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="font-medium text-stone-700 hover:text-[#FF5A00] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Politique de Confidentialité
            </button>

            <span aria-hidden="true" className="text-stone-300">
              ·
            </span>

            <a
              href={PAYHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FF5A00] hover:underline whitespace-nowrap"
            >
              Acheter (50 DH)
            </a>
          </div>
        </div>
      </footer>

      {/* 10. PAGE POLITIQUE DE CONFIDENTIALITÉ (Pop-up Modal) */}
      {isPrivacyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsPrivacyOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-stone-200 max-w-xl w-full p-6 sm:p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-stone-200">
              <h2
                id="privacy-modal-title"
                className="text-lg sm:text-xl font-extrabold text-stone-950"
              >
                Politique de Confidentialité
              </h2>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                aria-label="Fermer la fenêtre"
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-stone-700 leading-relaxed space-y-4">
              <p>
                Politique de Confidentialité - MAHFOUD - Dernière mise à jour :
                7 Novembre 2026 - Contact : mustaphasoufisme@gmail.com. Ce site
                utilise Google AdSense pour afficher des publicités. Google, en
                tant que fournisseur tiers, utilise des cookies pour diffuser
                des annonces sur ce site. L'utilisation du cookie DART par
                Google lui permet de diffuser des annonces aux utilisateurs en
                fonction de leur visite sur ce site et sur d'autres sites
                Internet. Les utilisateurs peuvent désactiver l'utilisation du
                cookie DART sur{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF5A00] underline break-all"
                >
                  https://policies.google.com/technologies/ads
                </a>{' '}
                Les paiements sont gérés de manière sécurisée par Payhip. Nous
                ne recevons, ne stockons et ne voyons jamais vos informations
                bancaires. Vous avez le droit de demander la suppression de vos
                données à{' '}
                <a
                  href="mailto:mustaphasoufisme@gmail.com"
                  className="text-[#FF5A00] underline"
                >
                  mustaphasoufisme@gmail.com
                </a>
                .
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. BANNIÈRE COOKIES */}
      {!cookiesAccepted && (
        <div
          role="region"
          aria-label="Bannière cookies"
          className="fixed bottom-0 inset-x-0 z-40 bg-stone-950/95 text-white border-t border-stone-800 px-4 py-2.5"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <p className="text-stone-200 text-center sm:text-left">
              Ce site utilise des cookies Google AdSense pour améliorer votre
              expérience.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="text-xs text-stone-400 hover:text-white underline whitespace-nowrap"
              >
                En savoir plus
              </button>
              <button
                type="button"
                onClick={handleAcceptCookies}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF5A00] hover:bg-[#E04F00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                J'accepte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOUTON WHATSAPP FLOTTANT */}
      <div
        className={`fixed right-4 z-40 ${
          cookiesAccepted ? 'bottom-4' : 'bottom-16 sm:bottom-14'
        }`}
      >
        {whatsAppDrawerOpen && (
          <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl border border-stone-200 shadow-xl p-4 text-stone-900">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-950">
                Support Rapide MAHFOUD
              </span>
              <button
                type="button"
                onClick={() => setWhatsAppDrawerOpen(false)}
                aria-label="Fermer l'aide"
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-3">
              Salam ! Tu as une question sur la formation à 50 DH ou le paiement
              Payhip ?
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  'Salam MAHFOUD, je veux commencer la formation à 50 DH : https://payhip.com/b/8cbQk'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-stone-950 bg-[#25D366] hover:bg-[#20bd5a] rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir WhatsApp</span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  'Question Formation MAHFOUD - 50 DH'
                )}`}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Écrire à {CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setWhatsAppDrawerOpen((prev) => !prev)}
          aria-label="Support WhatsApp"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
