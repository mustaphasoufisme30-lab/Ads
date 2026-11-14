/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Configuration centralisée de la marque et de la plateforme.
 * Modifiez simplement les valeurs ci-dessous pour changer le nom du site,
 * le slogan, le logo ou les paramètres SEO / Analytics plus tard.
 */

export const SITE_CONFIG = {
  name: 'TechIA Lab',
  shortLogo: 'TL',
  slogan: 'IA, programmation et outils numériques expliqués simplement.',
  positioning:
    "Des guides simples et pratiques pour utiliser l'intelligence artificielle, créer des applications, développer des sites web et utiliser les meilleurs outils numériques.",
  siteUrl: import.meta.env?.VITE_SITE_URL || 'https://mahfoud.xyz',
  gaMeasurementId: import.meta.env?.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID',
  adsensePublisherId: 'ca-pub-5562107411098538',
  contactEmail: 'mustaphasoufisme@gmail.com',
  creatorPlaceholder: {
    name: '[Nom du Créateur / Équipe Éditoriale TechIA Lab]',
    role: 'Développeur & Formateur en Ingénierie Numérique',
    location: '[Ville / Pays]',
    bio: "Passionné par l'accessibilité des technologies modernes, la programmation pratique et l'édition numérique indépendante.",
  },
  hero: {
    title: "Maîtrisez l'IA, la programmation et les outils numériques",
    subtitle:
      'Des tutoriels simples, pratiques et détaillés pour créer vos projets numériques.',
    primaryCta: 'Explorer les guides',
    secondaryCta: 'Découvrir les outils',
  },
  newsletter: {
    title: 'Recevez les nouveaux guides',
    description:
      'Inscrivez-vous pour recevoir nos nouveaux tutoriels et outils.',
    buttonLabel: "S'inscrire",
  },
  headerNav: [
    { label: 'Accueil', path: '/' },
    { label: 'IA', path: '/ia/' },
    { label: 'Programmation', path: '/programmation/' },
    { label: 'Applications', path: '/applications-android/' },
    { label: 'Outils', path: '/outils/' },
    { label: 'KDP', path: '/kdp/' },
    { label: 'Guides', path: '/guides/' },
  ],
};
