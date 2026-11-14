/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CategoryInfo {
  id: number;
  slug: string;
  url: string;
  name: string;
  shortName: string;
  group: 'IA' | 'Programmation' | 'Applications' | 'Outils' | 'KDP' | 'Guides';
  seoTitle: string;
  seoDescription: string;
  longDescription: string;
  image: string;
  topics: string[];
}

export const IMAGES = {
  aiWorkspace: '/images/techia_ai_workspace_1794109988578.jpg',
  webappBuilder: '/images/techia_webapp_builder_1794112664142.jpg',
  pythonCoding: '/images/techia_python_coding_1794109990983.jpg',
  creatorDesk: '/images/hero_mahfoud_method_1794016407072.jpg',
  contentCreation: '/images/techia_content_creation_1794112666253.jpg',
  kdpPublishing: '/images/techia_kdp_publishing_1794109992234.jpg',
  digitalTools: '/images/techia_digital_tools_1794109991891.jpg',
  websiteDesign: '/images/techia_website_design_1794112667607.jpg',
  pythonBeginners: '/images/techia_python_beginners_1794112668726.jpg',
  workflowAutomation: '/images/techia_workflow_automation_1794112668912.jpg',
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 1,
    slug: 'ia',
    url: '/ia/',
    name: 'Intelligence artificielle',
    shortName: 'IA',
    group: 'IA',
    seoTitle: 'Intelligence Artificielle : Guides, Tutoriels et Usages Concrets | TechIA Lab',
    seoDescription:
      "Comprenez et maîtrisez l'intelligence artificielle générative : modèles de langage, génération d'images, vidéo, intégration API et bonnes pratiques professionnelles.",
    longDescription:
      "Découvrez nos dossiers méthodiques pour tirer parti de l'intelligence artificielle dans vos projets quotidiens : rédaction structurée, assistance au développement logiciel, synthèse documentaire et conception multimédia.",
    image: IMAGES.aiWorkspace,
    topics: ['Modèles LLM', 'Prompt Engineering', 'Génération Image & Vidéo', 'API IA', 'Productivité'],
  },
  {
    id: 2,
    slug: 'chatgpt',
    url: '/chatgpt/',
    name: 'ChatGPT',
    shortName: 'ChatGPT',
    group: 'IA',
    seoTitle: 'ChatGPT : Tutoriels, Prompts Avancés et Cas Pratiques | TechIA Lab',
    seoDescription:
      'Apprenez à formuler des instructions précises sur ChatGPT pour apprendre à coder, structurer des projets techniques, analyser des fichiers et gagner du temps.',
    longDescription:
      "De la formulation d'instructions système aux flux de travail assistés pour le développement et la rédaction, explorez comment utiliser ChatGPT avec rigueur et esprit critique.",
    image: IMAGES.contentCreation,
    topics: ['Prompts structurés', 'Apprentissage du code', 'Débogage assisté', 'Analyse de données'],
  },
  {
    id: 3,
    slug: 'google-ai-gemini',
    url: '/google-ai-gemini/',
    name: 'Google AI / Gemini',
    shortName: 'Google AI / Gemini',
    group: 'IA',
    seoTitle: 'Google AI & Gemini : Guides Pratiques, SDK et Multimodalité | TechIA Lab',
    seoDescription:
      "Tout savoir sur l'écosystème Google AI et les modèles Gemini : analyse multimodale (texte, image, PDF, audio), Google AI Studio et intégration TypeScript/Python.",
    longDescription:
      "Maîtrisez les capacités multimodales de Google Gemini et apprenez à prototyper puis déployer des applications intelligentes grâce à Google AI Studio et aux SDK officiels.",
    image: IMAGES.webappBuilder,
    topics: ['Gemini API', 'Google AI Studio', 'Multimodalité', 'SDK TypeScript & Python'],
  },
  {
    id: 4,
    slug: 'canva-creation',
    url: '/canva-creation/',
    name: 'Canva & création',
    shortName: 'Canva & Création',
    group: 'KDP',
    seoTitle: 'Canva & Création Visuelle : Guides de Design et Mise en Page | TechIA Lab',
    seoDescription:
      'Créez des visuels professionnels, des couvertures de livres Kindle, des supports pédagogiques et des documents PDF soignés avec Canva et les outils de design.',
    longDescription:
      "Techniques de mise en page, règles typographiques, gabarits d'impression et export haute définition pour concevoir des supports visuels propres sans être graphiste de métier.",
    image: IMAGES.kdpPublishing,
    topics: ['Mise en page PDF', 'Couvertures KDP', 'Typographie', 'Gabarits visuels'],
  },
  {
    id: 5,
    slug: 'programmation',
    url: '/programmation/',
    name: 'Programmation',
    shortName: 'Programmation',
    group: 'Programmation',
    seoTitle: 'Programmation & Développement Logiciel : Tutoriels Pas à Pas | TechIA Lab',
    seoDescription:
      "Apprenez les fondamentaux de la programmation, l'architecture logicielle, les API REST, Git et les bonnes pratiques pour écrire un code propre et maintenable.",
    longDescription:
      "Un parcours structuré pour débutants et développeurs intermédiaires : algorithmique, structuration de projets, gestion des erreurs, sécurité applicative et déploiement moderne.",
    image: IMAGES.pythonCoding,
    topics: ['Architecture logicielle', 'API REST', 'Algorithmique', 'Sécurité Web', 'Git'],
  },
  {
    id: 6,
    slug: 'python',
    url: '/python/',
    name: 'Python',
    shortName: 'Python',
    group: 'Programmation',
    seoTitle: 'Python : Cours, Tutoriels Débutants et Projets Concrets | TechIA Lab',
    seoDescription:
      "Apprenez le langage Python étape par étape : syntaxe de base, scripts d'automatisation, manipulation de fichiers PDF/CSV, création d'API web et intelligence artificielle.",
    longDescription:
      "Python est le langage de référence pour débuter en programmation, automatiser des tâches répétitives et manipuler des données. Retrouvez nos guides avec exemples complets commentés.",
    image: IMAGES.pythonBeginners,
    topics: ['Bases de Python', 'Scripts CLI', 'FastAPI / Flask', 'Traitement PDF & CSV', 'Automatisation'],
  },
  {
    id: 7,
    slug: 'php',
    url: '/php/',
    name: 'PHP',
    shortName: 'PHP',
    group: 'Programmation',
    seoTitle: 'PHP Moderne : Développement Backend, Sécurité et Bases de Données | TechIA Lab',
    seoDescription:
      'Maîtrisez PHP 8+ pour créer des sites web dynamiques, traiter des formulaires de manière sécurisée (PDO, CSRF, XSS) et concevoir des backends rapides.',
    longDescription:
      "Découvrez comment écrire du code PHP 8 moderne, typé et sécurisé : requêtes préparées PDO, validation de formulaires, architecture MVC légère et génération de documents côté serveur.",
    image: IMAGES.creatorDesk,
    topics: ['PHP 8+ Typé', 'PDO & SQL', 'Sécurité Formulaires', 'API JSON'],
  },
  {
    id: 8,
    slug: 'javascript',
    url: '/javascript/',
    name: 'JavaScript',
    shortName: 'JavaScript',
    group: 'Programmation',
    seoTitle: 'JavaScript & TypeScript : Guides Frontend, Node.js et Applications Web | TechIA Lab',
    seoDescription:
      'Apprenez JavaScript moderne (ES2024+), TypeScript, la manipulation du DOM, React et Node.js pour construire des interfaces web rapides et interactives.',
    longDescription:
      "Du JavaScript natif dans le navigateur aux applications complètes en TypeScript et React : programmation asynchrone, Fetch API, Canvas HTML5 et optimisation des performances.",
    image: IMAGES.webappBuilder,
    topics: ['ESNext & TypeScript', 'DOM & Événements', 'React & Vite', 'Async / Fetch API'],
  },
  {
    id: 9,
    slug: 'creation-sites-web',
    url: '/creation-sites-web/',
    name: 'Création de sites web',
    shortName: 'Création de Sites Web',
    group: 'Applications',
    seoTitle: 'Création de Sites Web : Conception, SEO, Performance et Hébergement | TechIA Lab',
    seoDescription:
      'Guides complets pour concevoir, développer et publier un site web rapide, responsive, bien référencé sur Google et conforme aux standards du web.',
    longDescription:
      "Tout le cycle de vie d'un site web professionnel : structure HTML5 sémantique, design responsive mobile-first, Core Web Vitals, référencement naturel (SEO) et mise en ligne HTTPS.",
    image: IMAGES.websiteDesign,
    topics: ['HTML5 & Tailwind CSS', 'SEO Technique', 'Core Web Vitals', 'Déploiement Cloud'],
  },
  {
    id: 10,
    slug: 'applications-android',
    url: '/applications-android/',
    name: 'Applications Android',
    shortName: 'Applications Android',
    group: 'Applications',
    seoTitle: 'Applications Android & Mobile : Conception, PWA et Développement | TechIA Lab',
    seoDescription:
      'Comment concevoir et développer une application mobile Android ou une Progressive Web App (PWA) performante, intuitive et adaptée aux écrans tactiles.',
    longDescription:
      "Explorez les différentes approches pour créer une application mobile : développement natif Kotlin/Jetpack Compose, applications web progressives (PWA) installables et architecture hors-ligne.",
    image: IMAGES.webappBuilder,
    topics: ['Architecture Mobile', 'PWA Installables', 'Interface Tactile', 'Publication'],
  },
  {
    id: 11,
    slug: 'outils-pdf',
    url: '/outils-pdf/',
    name: 'Outils PDF',
    shortName: 'Outils PDF',
    group: 'Outils',
    seoTitle: 'Outils PDF & Manipulation de Documents : Guides et Utilitaires | TechIA Lab',
    seoDescription:
      'Apprenez à convertir, fusionner, compresser et générer des fichiers PDF proprement sur le web, avec Python ou directement via nos outils gratuits en ligne.',
    longDescription:
      "Comprenez la structure interne du format PDF, optimisez le poids de vos fichiers pour le web ou l'impression KDP et utilisez nos convertisseurs gratuits directement dans votre navigateur.",
    image: IMAGES.pythonCoding,
    topics: ['Conversion PDF', 'Fusion & Compression', 'Mise en page Print', 'Automatisation PDF'],
  },
  {
    id: 12,
    slug: 'kdp',
    url: '/kdp/',
    name: 'Kindle & KDP',
    shortName: 'Kindle & KDP',
    group: 'KDP',
    seoTitle: 'Kindle & Amazon KDP : Créer, Formater et Publier un Livre | TechIA Lab',
    seoDescription:
      "Guide complet de l'auto-édition sur Amazon Kindle Direct Publishing (KDP) : choix du format, marges, couverture avec fond perdu, ePub et calcul des redevances.",
    longDescription:
      "Maîtrisez les aspects techniques de l'auto-édition sur Amazon KDP : préparation du manuscrit, calcul exact des dimensions de couverture avec tranche, export PDF/X et bonnes pratiques éditoriales.",
    image: IMAGES.kdpPublishing,
    topics: ['Formatage Broché & Kindle', 'Couvertures KDP', 'Calculateur de Redevances', 'Contrôle Qualité'],
  },
  {
    id: 13,
    slug: 'outils-en-ligne',
    url: '/outils-en-ligne/',
    name: 'Outils en ligne',
    shortName: 'Outils en Ligne',
    group: 'Outils',
    seoTitle: 'Outils Numériques en Ligne : Productivité, Texte, Image et Dev | TechIA Lab',
    seoDescription:
      'Sélection et guides des meilleurs outils numériques en ligne pour développeurs, rédacteurs et créateurs : QR Code, sécurité, analyse de texte et conversion.',
    longDescription:
      "Accédez à nos utilitaires web gratuits exécutés localement dans votre navigateur et découvrez comment choisir les meilleurs outils numériques pour travailler avec méthode.",
    image: IMAGES.digitalTools,
    topics: ['Générateur QR Code', 'Sécurité & Mots de passe', 'Analyse de texte', 'Convertisseurs'],
  },
  {
    id: 14,
    slug: 'automatisation',
    url: '/automatisation/',
    name: 'Automatisation',
    shortName: 'Automatisation',
    group: 'IA',
    seoTitle: 'Automatisation & Workflows : Gagner du Temps avec Python et l’IA | TechIA Lab',
    seoDescription:
      'Automatisez vos tâches numériques répétitives : tri de fichiers, extraction de données, webhooks, scripts planifiés et pipelines assistés par intelligence artificielle.',
    longDescription:
      "Apprenez à identifier les tâches chronophages à faible valeur ajoutée et à construire des flux d'automatisation fiables à l'aide de scripts Python, d'API web et d'agents de traitement.",
    image: IMAGES.workflowAutomation,
    topics: ['Workflows API', 'Scripts Planifiés', 'Traitement par lot', 'Extraction Structurée'],
  },
  {
    id: 15,
    slug: 'freelance-revenus-numeriques',
    url: '/freelance-revenus-numeriques/',
    name: 'Freelance & revenus numériques',
    shortName: 'Freelance & Projets',
    group: 'Guides',
    seoTitle: 'Freelance & Projets Numériques : Méthodologie, Tarification et Outils | TechIA Lab',
    seoDescription:
      'Conseils pratiques et réalistes pour structurer une activité freelance dans le numérique, calculer son tarif journalier (TJM) et concevoir des produits utiles.',
    longDescription:
      "Une approche pragmatique, transparente et sans fausses promesses pour organiser son travail indépendant, chiffrer un cahier des charges technique et développer des produits numériques durables.",
    image: IMAGES.creatorDesk,
    topics: ['Calcul du TJM', 'Cahier des charges', 'Produits numériques', 'Gestion de projet'],
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
