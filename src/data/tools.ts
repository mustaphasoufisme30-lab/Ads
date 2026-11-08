/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ToolInfo {
  id: string;
  slug: string;
  url: string;
  name: string;
  shortName: string;
  category: 'PDF' | 'Générateurs' | 'Texte & Dev' | 'Calcul & Conversion';
  seoTitle: string;
  seoDescription: string;
  summary: string;
  features: string[];
  howToSteps: string[];
  faq: { question: string; answer: string }[];
}

export const TOOLS: ToolInfo[] = [
  {
    id: 'pdf-vers-images',
    slug: 'pdf-vers-images',
    url: '/outils/pdf-vers-images/',
    name: 'Convertisseur PDF vers Images (PNG / WebP)',
    shortName: 'PDF vers Images',
    category: 'PDF',
    seoTitle: 'Convertir PDF en Images (PNG, WebP) Gratuitement en Ligne | TechIA Lab',
    seoDescription:
      'Outil gratuit en ligne pour inspecter un fichier PDF et générer des planches d’images PNG ou WebP haute résolution directement dans votre navigateur.',
    summary:
      'Importez un document PDF ou générez une planche visuelle haute définition exportable en PNG ou WebP sans envoyer vos fichiers sur un serveur tiers.',
    features: [
      'Traitement 100 % local dans le navigateur pour protéger la confidentialité',
      'Choix du format de sortie : PNG sans perte ou WebP optimisé pour le web',
      'Réglage de la résolution (150 DPI écran ou 300 DPI impression)',
    ],
    howToSteps: [
      'Sélectionnez votre fichier PDF depuis votre appareil ou utilisez le générateur d’aperçu.',
      'Choisissez le format d’image souhaité (PNG ou WebP) et la densité de pixels.',
      'Téléchargez instantanément les images générées sur votre ordinateur ou smartphone.',
    ],
    faq: [
      {
        question: 'Mes fichiers PDF sont-ils envoyés sur un serveur ?',
        answer:
          'Non. Le traitement s’effectue localement via les API HTML5 Canvas et FileReader de votre navigateur.',
      },
      {
        question: 'Quel format choisir entre PNG et WebP ?',
        answer:
          'Le format PNG est idéal pour conserver une netteté typographique parfaite, tandis que le WebP réduit le poids de 30 % à 50 % pour une intégration sur un site web.',
      },
    ],
  },
  {
    id: 'images-vers-pdf',
    slug: 'images-vers-pdf',
    url: '/outils/images-vers-pdf/',
    name: 'Convertisseur Images vers PDF (A4 / KDP)',
    shortName: 'Images vers PDF',
    category: 'PDF',
    seoTitle: 'Convertir des Images (JPG, PNG, WebP) en PDF Gratuitement | TechIA Lab',
    seoDescription:
      'Regroupez et convertissez vos images PNG, JPG ou WebP en un document PDF propre au format A4 ou US Letter, prêt à télécharger.',
    summary:
      'Assemblez une ou plusieurs images (JPG, PNG, WebP) dans un document PDF structuré avec marges personnalisables.',
    features: [
      'Import multiple d’images JPG, PNG et WebP avec aperçu instantané',
      'Choix du format de page (A4 standard ou US Letter 6x9 KDP)',
      'Génération d’un fichier PDF valide téléchargeable en un clic',
    ],
    howToSteps: [
      'Ajoutez une ou plusieurs images depuis votre ordinateur ou téléphone.',
      'Configurez l’orientation (Portrait ou Paysage) et les marges de page.',
      'Cliquez sur « Générer et Télécharger le PDF » pour obtenir votre fichier.',
    ],
    faq: [
      {
        question: 'Puis-je combiner plusieurs images dans un seul PDF ?',
        answer:
          'Oui, vous pouvez sélectionner plusieurs images et les exporter au sein d’un document unique.',
      },
    ],
  },
  {
    id: 'fusionner-pdf',
    slug: 'fusionner-pdf',
    url: '/outils/fusionner-pdf/',
    name: 'Fusionner plusieurs fichiers PDF',
    shortName: 'Fusionner PDF',
    category: 'PDF',
    seoTitle: 'Fusionner des PDF en Ligne Gratuitement et sans Inscription | TechIA Lab',
    seoDescription:
      'Combinez plusieurs documents PDF dans l’ordre de votre choix en un seul fichier unifié, rapidement et en toute confidentialité.',
    summary:
      'Organisez l’ordre de vos documents PDF (chapitres de livre, factures, annexes techniques) et assemblez-les en un fichier unique.',
    features: [
      'Réorganisation de l’ordre des documents par simple clic (Monter / Descendre)',
      'Calcul automatique du poids total et du nombre de fichiers combinés',
      'Export d’un document PDF consolidé avec métadonnées propres',
    ],
    howToSteps: [
      'Ajoutez les fichiers PDF que vous souhaitez regrouper.',
      'Utilisez les flèches pour définir l’ordre exact d’apparition des documents.',
      'Lancez la fusion et téléchargez le document final.',
    ],
    faq: [
      {
        question: 'L’ordre des fichiers est-il personnalisable ?',
        answer:
          'Oui, vous pouvez déplacer chaque fichier vers le haut ou vers le bas avant de générer le document fusionné.',
      },
    ],
  },
  {
    id: 'compresser-pdf',
    slug: 'compresser-pdf',
    url: '/outils/compresser-pdf/',
    name: 'Compresser et Optimiser un fichier PDF',
    shortName: 'Compresser PDF',
    category: 'PDF',
    seoTitle: 'Compresser un PDF en Ligne : Réduire la Taille d’un Fichier PDF | TechIA Lab',
    seoDescription:
      'Réduisez le poids de vos documents PDF pour l’envoi par email ou la mise en ligne tout en préservant une excellente lisibilité du texte.',
    summary:
      'Analysez la structure d’un fichier PDF et appliquez un profil d’optimisation (Web, Équilibré ou Haute Qualité) pour alléger son poids.',
    features: [
      'Trois niveaux d’optimisation : Compression maximale (Web), Équilibrée (Standard), Préservation (Impression)',
      'Comparaison précise du poids avant / après en Ko et Mo',
      'Nettoyage des métadonnées superflues et flux redondants',
    ],
    howToSteps: [
      'Sélectionnez le fichier PDF à optimiser.',
      'Choisissez le niveau de compression adapté à votre usage (Email, Web ou Archivage).',
      'Téléchargez le PDF optimisé et vérifiez le gain d’espace obtenu.',
    ],
    faq: [
      {
        question: 'Le texte du PDF reste-t-il net après compression ?',
        answer:
          'Oui, les textes vectoriels et polices intégrées conservent leur netteté ; l’optimisation cible principalement les flux et ressources redondantes.',
      },
    ],
  },
  {
    id: 'qr-code',
    slug: 'qr-code',
    url: '/outils/qr-code/',
    name: 'Générateur de QR Code Haute Résolution',
    shortName: 'Générateur QR Code',
    category: 'Générateurs',
    seoTitle: 'Générateur de QR Code Gratuit (URL, Texte, Wi-Fi) en PNG/SVG | TechIA Lab',
    seoDescription:
      'Créez un QR Code personnalisé haute définition pour un lien web, un texte, un email ou un accès Wi-Fi. Téléchargement direct en PNG.',
    summary:
      'Générez instantanément un QR Code matriciel personnalisable (couleurs, dimensions, marge de sécurité) pour vos sites web, cartes de visite ou livres KDP.',
    features: [
      'Support des liens URL, textes libres, adresses email et configurations Wi-Fi',
      'Personnalisation des couleurs de premier plan et d’arrière-plan avec contrôle du contraste',
      'Export direct en image PNG haute résolution (jusqu’à 600×600 px)',
    ],
    howToSteps: [
      'Saisissez l’URL ou le texte à encoder dans le champ dédié.',
      'Ajustez la taille en pixels et les couleurs selon votre charte graphique.',
      'Cliquez sur « Télécharger le QR Code (PNG) » pour récupérer votre fichier.',
    ],
    faq: [
      {
        question: 'Les QR Codes générés ont-ils une date d’expiration ?',
        answer:
          'Non. Le QR Code encode directement votre contenu sans redirection intermédiaire : il fonctionne de manière permanente.',
      },
    ],
  },
  {
    id: 'compteur-de-mots',
    slug: 'compteur-de-mots',
    url: '/outils/compteur-de-mots/',
    name: 'Compteur de Mots, Caractères & Temps de Lecture',
    shortName: 'Compteur de Mots',
    category: 'Texte & Dev',
    seoTitle: 'Compteur de Mots et Caractères en Ligne + Temps de Lecture SEO | TechIA Lab',
    seoDescription:
      'Analysez vos textes en temps réel : nombre de mots, caractères avec et sans espaces, phrases, paragraphes, temps de lecture et densité des mots-clés.',
    summary:
      'Outil d’analyse rédactionnelle et SEO en temps réel pour calibrer vos articles de blog, chapitres de livres Kindle, balises meta title et descriptions.',
    features: [
      'Comptage instantané des mots, caractères (avec/sans espaces), phrases et paragraphes',
      'Estimation du temps de lecture silencieuse (220 mots/min) et d’élocution orale (140 mots/min)',
      'Extraction automatique des mots-clés les plus fréquents et vérification de longueur SEO',
    ],
    howToSteps: [
      'Collez ou rédigez votre texte dans l’éditeur principal.',
      'Consultez les indicateurs mis à jour en temps réel au-dessus et à droite du texte.',
      'Vérifiez la densité de vos termes principaux pour éviter la sur-optimisation SEO.',
    ],
    faq: [
      {
        question: 'Quelle est la longueur idéale d’une meta description SEO ?',
        answer:
          'Entre 120 et 158 caractères espaces compris afin d’éviter toute troncature dans les résultats de recherche Google.',
      },
    ],
  },
  {
    id: 'generateur-mot-de-passe',
    slug: 'generateur-mot-de-passe',
    url: '/outils/generateur-mot-de-passe/',
    name: 'Générateur de Mot de Passe Cryptographique',
    shortName: 'Générateur Mot de Passe',
    category: 'Générateurs',
    seoTitle: 'Générateur de Mot de Passe Fort et Sécurisé en Ligne | TechIA Lab',
    seoDescription:
      'Générez des mots de passe aléatoires robustes via l’API Web Crypto de votre navigateur, avec mesure d’entropie en bits et copie en un clic.',
    summary:
      'Créez des mots de passe à haute entropie générés localement par le générateur cryptographique matériel de votre navigateur (`window.crypto.getRandomValues`).',
    features: [
      'Longueur ajustable de 8 à 64 caractères avec sélection fine des jeux de caractères',
      'Option d’exclusion des caractères ambigus (0, O, l, 1, I)',
      'Calcul mathématique de l’entropie en bits pour évaluer la résistance réelle',
    ],
    howToSteps: [
      'Choisissez la longueur souhaitée (16 caractères ou plus recommandés).',
      'Cochez les types de caractères à inclure (majuscules, minuscules, chiffres, symboles).',
      'Copiez le mot de passe généré dans votre gestionnaire de mots de passe.',
    ],
    faq: [
      {
        question: 'Le mot de passe généré transite-t-il par internet ?',
        answer:
          'Jamais. Il est créé exclusivement dans la mémoire vive de votre navigateur via l’API standard Web Crypto.',
      },
    ],
  },
  {
    id: 'convertisseur-unites',
    slug: 'convertisseur-unites',
    url: '/outils/convertisseur-unites/',
    name: 'Convertisseur d’Unités (Octets, CSS px/rem, Dimensions)',
    shortName: 'Convertisseur d’Unités',
    category: 'Calcul & Conversion',
    seoTitle: 'Convertisseur d’Unités Numériques, CSS (px/rem) et Mesures | TechIA Lab',
    seoDescription:
      'Convertissez instantanément vos unités techniques : stockage numérique (Ko, Mo, Go, To), unités CSS web (px, rem, em) et dimensions d’impression (cm, pouces, DPI).',
    summary:
      'Un convertisseur multi-catégories pensé pour les développeurs web, éditeurs KDP et techniciens : stockage informatique, typographie CSS et formats physiques.',
    features: [
      'Conversion précise des tailles de fichiers (Octets, Ko, Mo, Go, To)',
      'Convertisseur CSS Pixels (px) ↔ REM / EM avec taille de base personnalisable (16px par défaut)',
      'Conversion Pouces (Inches) ↔ Centimètres / Millimètres pour les formats de livres KDP (ex. 6×9 pouces)',
    ],
    howToSteps: [
      'Sélectionnez la famille d’unités (Stockage numérique, Typographie CSS ou Dimensions physiques).',
      'Entrez la valeur à convertir dans le champ source.',
      'Lisez instantanément toutes les équivalences calculées avec précision.',
    ],
    faq: [
      {
        question: 'À combien de centimètres correspond le format KDP 6 × 9 pouces ?',
        answer:
          'Le format standard 6 × 9 pouces correspond exactement à 15,24 cm × 22,86 cm.',
      },
    ],
  },
  {
    id: 'calculateur',
    slug: 'calculateur',
    url: '/outils/calculateur/',
    name: 'Calculateur TJM Freelance & Redevances Amazon KDP',
    shortName: 'Calculateur Freelance & KDP',
    category: 'Calcul & Conversion',
    seoTitle: 'Calculateur TJM Freelance & Calculateur de Redevances KDP | TechIA Lab',
    seoDescription:
      'Simulez votre Tarif Journalier Moyen (TJM) de développeur freelance ou calculez vos frais d’impression et redevances nettes sur Amazon KDP.',
    summary:
      'Deux simulateurs financiers transparents : estimez votre TJM cible selon vos jours facturés et charges, ou calculez la marge exacte d’un livre broché/Kindle sur KDP.',
    features: [
      'Mode Freelance : calcul du TJM et du tarif horaire selon le revenu net visé, les charges et les jours ouvrés facturables',
      'Mode Amazon KDP : calcul des coûts d’impression (frais fixes + coût par page) et de la redevance nette par exemplaire',
      'Tableau récapitulatif clair en valeurs tabulaires sans fausses promesses',
    ],
    howToSteps: [
      'Choisissez le mode de calcul : « Tarif Journalier Freelance » ou « Redevances Livre KDP ».',
      'Ajustez les curseurs (revenu mensuel souhaité, jours facturés, ou nombre de pages et prix catalogue).',
      'Consultez la répartition détaillée des coûts et de la marge nette unitaire.',
    ],
    faq: [
      {
        question: 'Pourquoi ne faut-il pas compter 220 jours facturés par an en freelance ?',
        answer:
          'Une partie du temps de travail est consacrée à la prospection, à la gestion administrative, à la formation continue et aux congés. Une base réaliste se situe souvent entre 130 et 170 jours facturés par an.',
      },
    ],
  },
];

export function getToolBySlug(slug: string): ToolInfo | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
