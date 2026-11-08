# Refonte Complète vers TechIA Lab — Diagnostic de l'Existant & Plan d'Architecture

Transformation complète du site actuel en **TechIA Lab** (*« IA, programmation et outils numériques expliqués simplement »*), un portail éditorial et applicatif francophone proposant des tutoriels approfondis, 15 catégories thématiques, 9 outils numériques gratuits interactifs et une architecture SEO/Schema.org complète, tout en préservant intégralement la configuration **Google AdSense Auto Ads** existante (`ca-pub-5562107411098538`).

## User Review & Critical Decisions

> [!IMPORTANT]
> **Conservation stricte de Google AdSense Auto Ads (`ca-pub-5562107411098538`)**
> - Le script `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5562107411098538" crossorigin="anonymous"></script>` présent dans `<head>` ainsi que le fichier `/ads.txt` (`google.com, pub-5562107411098538, DIRECT, f08c47fec0942fa0`) sont **conservés à l'identique sans aucune modification ni duplication**.
> - Le composant manuel `AdSlot.tsx` qui injectait des blocs `<ins class="adsbygoogle">` codés en dur sera **retiré** afin de laisser **Google AdSense Auto Ads** gérer le placement automatique de manière 100 % native et conforme à vos instructions.

- **Décision Confirmée 1 — Maintien de la stack React 19 + Vite + TypeScript + Tailwind CSS v4** : Aucun changement de framework n'est nécessaire ; nous ajoutons un routeur History API propre (supportant les URLs `/ia/`, `/programmation/`, `/outils/qr-code/`, `/article/...`, etc.) et un gestionnaire dynamique de balises SEO/JSON-LD.
- **Décision Confirmée 2 — Configuration centralisée de la marque (`siteConfig`)** : Le nom provisoire **TechIA Lab**, le slogan, le logo, l'email (`mustaphasoufisme@gmail.com`) et les constantes Analytics (`GA_MEASUREMENT_ID`, `SITE_URL`) sont centralisés dans un fichier de configuration unique pour permettre leur modification instantanée.

---

## Diagnostic Complet du Projet Existant (Analyse en 12 Points)

### 1. Technologies & 2. Framework utilisés
- **Framework Frontend** : React 19 (`react@^19.0.1`, `react-dom@^19.0.1`) en TypeScript (`typescript@^7.0.2`) propulsé par **Vite 8** (`vite@^8.3.0`).
- **Styling & Icônes** : **Tailwind CSS v4** (`@tailwindcss/vite@^4.3.3`) et **Lucide React** (`lucide-react@^0.546.0`).
- **Polices configurées** : `Plus Jakarta Sans` (titres et corps de texte) et `JetBrains Mono` (code, métriques et données tabulaires).

### 3. Structure & Fonctionnement Actuel
- Application monopage (SPA) montée via `index.html` → `main.tsx` → `App.tsx`.
- Données statiques stockées dans un tableau d'articles typés et affichées avec filtrage par catégorie et recherche instantanée côté client.
- Fichiers statiques servis à la racine via `public/` (notamment `ads.txt`).

### 4. Pages Existantes & 5. Composants Existants
- **Vue d'accueil** dans `App.tsx` (en-tête, barre de recherche, barre de catégories, article à la une, grille de 12 articles, pied de page).
- **Vue de lecture d'article** dans `App.tsx` (affichage conditionnel via l'état `activeArticle`, sans URL dédiée dans la barre d'adresse).
- **Composant `AdSlot`** : Composant injectant manuellement des balises `<ins class="adsbygoogle">`.

### 6. Fonctionnalités Existantes & 7. Éléments Clés
- Filtrage en temps réel par catégorie et recherche plein texte.
- Vue détaillée d'un article avec suggestions d'articles connexes.
- Configuration Vite avec support des alias `@/` et port 3000.

### 8. Configuration SEO Existante
- Balises `<title>`, `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:type`) et Twitter Card (`summary_large_image`) statiques dans `index.html` et `metadata.json`.
- **Manques actuels à combler** : Pas de mise à jour dynamique du `<title>` / `<link rel="canonical">` par page, pas de données structurées Schema.org (`Article`, `BreadcrumbList`, `FAQPage`, `WebSite`), pas de `sitemap.xml` ni `robots.txt`, et navigation par état interne au lieu d'URLs propres (`/ia/`, `/article/...`).

### 9. Configuration Google AdSense Existante
- **Script global Auto Ads** : Présent dans le `<head>` de `index.html` :
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5562107411098538" crossorigin="anonymous"></script>
  ```
- **Fichier `ads.txt`** : Présent à la racine (`public/ads.txt` et `ads.txt`) avec la ligne exacte :
  `google.com, pub-5562107411098538, DIRECT, f08c47fec0942fa0`
- **Correction requise** : Supprimer les appels manuels `AdSlot` pour respecter strictement la règle *« ne remplace pas les annonces automatiques par des emplacements publicitaires codés manuellement »* et structurer le HTML avec des balises sémantiques (`<header>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`) espacées proprement afin que Google AdSense Auto Ads insère ses annonces automatiquement aux meilleurs endroits.

### 10. Variables d'Environnement & API
- `.env.example` définit `GEMINI_API_KEY` et `APP_URL`.
- Nous ajouterons `VITE_SITE_URL="SITE_URL"` et `VITE_GA_MEASUREMENT_ID="GA_MEASUREMENT_ID"` dans `.env.example` sans aucune clé secrète exposée côté client.

### 11. Synthèse : Conservé / Amélioré / Remplacé

| Catégorie | Éléments concernés | Action |
| :--- | :--- | :--- |
| **Conservé intact** | Script AdSense Auto Ads dans `<head>` (`ca-pub-5562107411098538`), fichier `/ads.txt`, socle React 19 + Vite + TypeScript + Tailwind v4, polices `Plus Jakarta Sans` & `JetBrains Mono`. | Aucune suppression ni altération des identifiants AdSense. |
| **Amélioré** | Moteur de recherche interne (étendu aux articles, 15 catégories, 9 outils et guides), SEO (balises dynamiques + Schema.org JSON-LD + `sitemap.xml` + `robots.txt`), système de thème Clair/Sombre (`☀️ / 🌙` persisté dans `localStorage`). | Architecture modulaire évolutive et URLs propres. |
| **Remplacé** | Thématique et articles "Actu Foot Maroc" remplacés par **TechIA Lab** (15 catégories, 10 guides complets de fond avec TOC/code/tableaux, 9 outils gratuits fonctionnels, pages légales/contact/à propos). Blocs `AdSlot` manuels retirés au profit d'Auto Ads pur. | Refonte éditoriale et fonctionnelle complète. |

---

## 1. Overview & Core Concept

- **What It Does** : **TechIA Lab** est une plateforme francophone de référence combinant :
  1. **Média & Tutoriels techniques** : 10 guides complets et détaillés (avec sommaire automatique, extraits de code copiables, tableaux comparatifs, encarts de recommandation/affiliation transparents et FAQ Schema) répartis dans **15 catégories dédiées**.
  2. **Boîte à outils numériques gratuits (`/outils/`)** : 9 outils interactifs directement utilisables dans le navigateur (PDF vers images, Images vers PDF, Fusionner PDF, Compresser PDF, Générateur QR Code, Compteur de mots, Générateur de mot de passe, Convertisseur d'unités, Calculateur freelance/KDP).
  3. **Écosystème prêt pour la monétisation et la conformité** : Compatible Google AdSense Auto Ads, bandeau de consentement cookies RGPD/AdSense, blocs d'affiliation normalisés, pages légales complètes (`/confidentialite/`, `/mentions-legales/`, `/conditions-utilisation/`, `/a-propos/`, `/contact/`).
- **Target Audience** : Développeurs, créateurs de projets numériques, auteurs Kindle/KDP, freelances et étudiants francophones.

---

## 2. User Experience & Visual Design

- **Aesthetic Direction** : Design éditorial technologique de haute précision (inspiré de la clarté de *Stripe Press*, *Vercel* et *Smashing Magazine*), privilégiant la lisibilité longue distance, la hiérarchie typographique et les espaces respirants compatibles avec Google AdSense Auto Ads.
- **Color Palette & Mode Sombre (`☀️ / 🌙`)** :
  - Configuration Tailwind CSS v4 avec `@custom-variant dark (&:where(.dark, .dark *));` et persistance dans `localStorage`.
  - **Mode Clair** : Fond principal blanc pur `#FFFFFF` et surface secondaire `#F8FAFC` (`slate-50`), texte principal `#0F172A` (`slate-900`), bordures fines `#E2E8F0` (`slate-200`).
  - **Mode Sombre** : Fond principal `#090D16` (`slate-950`), cartes `#0F172A` (`slate-900`), texte `#F8FAFC` (`slate-50`), bordures `#1E293B` (`slate-800`).
  - **Accents** : Bleu technologique `#2563EB` (`blue-600` / `blue-400` en dark mode) pour les actions primaires et Émeraude `#059669` pour les validations et outils.
- **Typography & Reading Cadence** :
  - Titres en `Plus Jakarta Sans` (`font-extrabold tracking-tight`, `text-wrap: balance`).
  - Corps d'article calibré à `65ch–72ch` (`max-w-prose`), interlignage confortable (`leading-relaxed`).
  - Blocs de code et métriques d'outils en `JetBrains Mono` avec `tabular-nums` et bouton « Copier le code ».

---

## 3. Key Product Decisions & Trade-Offs

- **Décision 1 : Routeur URL Propre (History API + Fallback SPA)**
  - *Approche choisie* : Gestionnaire de routes supportant les URLs propres demandées (`/ia/`, `/programmation/`, `/python/`, `/outils/`, `/outils/qr-code/`, `/kdp/`, `/guides/`, `/article/:slug`, `/a-propos/`, `/contact/`, `/confidentialite/`, `/mentions-legales/`, `/conditions-utilisation/`) avec mise à jour de `window.history.pushState` et écoute de `popstate`.
  - *Pourquoi* : Permet des URLs propres pour le SEO, le fil d'Ariane (`BreadcrumbList`), les boutons de partage et le fonctionnement optimal du crawler Google AdSense Auto Ads.
- **Décision 2 : Outils Gratuits 100 % Fonctionnels dans le Navigateur**
  - *Approche choisie* : Implémentation réelle en JavaScript/Canvas/Web Crypto API pour les 9 outils (génération réelle de QR Code SVG/Canvas téléchargeable, manipulation et export PDF/Images côté client, compteur de mots/caractères/temps de lecture en direct, générateur de mots de passe cryptographique `crypto.getRandomValues`, convertisseur d'unités et calculateur de rentabilité/tarif journalier).
  - *Pourquoi* : Aucune dépendance serveur lourde, exécution instantanée, confidentialité totale des fichiers de l'utilisateur et véritable valeur ajoutée pour l'approbation et la rétention AdSense.

---

## 4. Technical Architecture & Plan de Refonte en 12 Étapes

### Diagramme d'Architecture Cible

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     INDEX.HTML (<head> AdSense Auto Ads)                   │
│       client=ca-pub-5562107411098538  +  /ads.txt  +  /sitemap.xml         │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                  CONFIGURATION & SERVICES CENTRALISÉS                      │
│  ┌─────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │ SiteConfig & Brand  │  │ SEO & JSON-LD Engine │  │ Theme (☀️ / 🌙)   │  │
│  │ (Nom, Slogan, GA)   │  │ (Meta, Schema.org)   │  │ & Cookie Consent  │  │
│  └─────────────────────┘  └──────────────────────┘  └───────────────────┘  │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                     ROUTEUR & LAYOUT GLOBAL (App.tsx)                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Header : Logo TechIA Lab | Accueil IA Prog Apps Outils KDP Guides    │  │
│  │          + Recherche Globale Rapide + Toggle ☀️/🌙 + Menu Mobile      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                      │
│        ┌────────────────────────────┼────────────────────────────┐         │
│        ▼                            ▼                            ▼         │
│  ┌───────────────────┐    ┌──────────────────────┐    ┌─────────────────┐  │
│  │  PAGE D'ACCUEIL   │    │  PAGES ÉDITORIALES   │    │ OUTILS & LÉGAL  │  │
│  │ • Hero & CTAs     │    │ • 15 Pages Catégorie │    │ • 9 Outils SEO  │  │
│  │ • 6 À la Une      │    │   avec pagination    │    │   interactifs   │  │
│  │ • Section IA      │    │ • Page Article :     │    │ • /a-propos/    │  │
│  │ • Section Prog    │    │   TOC auto, H2/H3,   │    │ • /contact/     │  │
│  │ • Section Outils  │    │   Code, Tableaux,    │    │   (anti-spam)   │  │
│  │ • Guides Complets │    │   Blocs Affiliation, │    │ • Pages légales │  │
│  │ • Newsletter      │    │   Sidebar Desktop    │    │   & RGPD        │  │
│  └───────────────────┘    └──────────────────────┘    └─────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Plan de Refonte par Étapes (Étapes 1 à 12)

1. **ÉTAPE 1 — Analyse & Architecture cible** *(Étape actuelle)* : Validation du diagnostic et de l'architecture sans perte du code Google AdSense Auto Ads.
2. **ÉTAPE 2 — Système de Design, Configuration Centralisée & Mode Sombre (`☀️ / 🌙`)** : Mise à jour de `src/index.css` (support `@custom-variant dark`), création de la configuration centralisée (`siteConfig.ts`) et du gestionnaire de thème.
3. **ÉTAPE 3 — Header, Navigation, Recherche Rapide & Footer** : Barre de navigation responsive (`Accueil`, `IA`, `Programmation`, `Applications`, `Outils`, `KDP`, `Guides`), modale/barre de recherche globale instantanée, menu mobile hamburger et footer structuré avec bandeau de consentement cookies AdSense.
4. **ÉTAPE 4 — Page d'Accueil orientée contenu** : Hero avec double CTA, section « À la Une » (6 articles), sections thématiques « Intelligence Artificielle », « Programmation », « Outils », « Guides Complets » et bloc Newsletter éthique.
5. **ÉTAPE 5 — Les 15 Pages Catégories avec Pagination & SEO** : Création des 15 catégories demandées (*Intelligence artificielle, ChatGPT, Google AI / Gemini, Canva & création, Programmation, Python, PHP, JavaScript, Création de sites web, Applications Android, Outils PDF, Kindle & KDP, Outils en ligne, Automatisation, Freelance & revenus numériques*) avec description SEO, illustration et pagination.
6. **ÉTAPE 6 — Modèle de Page Article & Les 10 Articles Complets** : Rédaction des 10 articles originaux approfondis avec sommaire automatique (TOC), sections H2/H3, blocs de code copiables, tableaux comparatifs, blocs d'affiliation (*Notre recommandation / Voir l'outil / Comparer les solutions*), boutons de partage, articles similaires et sidebar desktop (passant sous le contenu sur mobile).
7. **ÉTAPE 7 — Section « OUTILS GRATUITS » (9 Outils Interactifs avec Pages SEO)** : Implémentation fonctionnelle de `/outils/pdf-vers-images/`, `/outils/images-vers-pdf/`, `/outils/fusionner-pdf/`, `/outils/compresser-pdf/`, `/outils/qr-code/`, `/outils/compteur-de-mots/`, `/outils/generateur-mot-de-passe/`, `/outils/convertisseur-unites/` et `/outils/calculateur/`.
8. **ÉTAPE 8 — Pages À Propos, Contact (Anti-Spam) & Pages Légales** : Création de `/a-propos/`, `/contact/` (avec validation stricte, honeypot anti-spam et protection XSS), `/confidentialite/`, `/mentions-legales/` et `/conditions-utilisation/`.
9. **ÉTAPE 9 — SEO Technique Complet** : Génération dynamique des métadonnées par route (`title`, `description`, `canonical`, OpenGraph, Twitter Card), injection JSON-LD (`Article`, `BreadcrumbList`, `FAQPage`), et création de `public/sitemap.xml` et `public/robots.txt`.
10. **ÉTAPE 10 — Vérification Google AdSense Auto Ads** : Suppression de `AdSlot.tsx` manuel, vérification de l'unicité du script `ca-pub-5562107411098538` dans `index.html`, vérification de `/ads.txt` et de la structure sémantique.
11. **ÉTAPE 11 — Préparation Analytics & Environnement** : Configuration de `.env.example` et du module d'initialisation optionnelle pour `GA_MEASUREMENT_ID` et `SITE_URL`.
12. **ÉTAPE 12 — Tests, Compilation, Linting & Livrable Final** : Vérification `compile_applet` + `lint_applet` et remise du guide complet d'exploitation et des checklists SEO / AdSense.
