/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IMAGES } from './categories';

export interface ArticleSection {
  id: string;
  h2: string;
  h3?: string;
  paragraphs: string[];
  codeBlock?: {
    language: string;
    title: string;
    code: string;
  };
  table?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  exampleBox?: {
    title: string;
    content: string;
  };
}

export interface RecommendationItem {
  name: string;
  purpose: string;
  strengths: string;
  url: string;
  isAffiliatePlaceholder?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  url: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  categorySlug: string;
  categoryName: string;
  secondaryCategories: string[];
  author: string;
  date: string;
  updatedDate: string;
  readTime: string;
  featured: boolean;
  isCompleteGuide: boolean;
  image: string;
  imageAlt: string;
  excerpt: string;
  introduction: string[];
  sections: ArticleSection[];
  recommendations?: {
    title: string;
    items: RecommendationItem[];
  };
  conclusion: string[];
  faq?: { question: string; answer: string }[];
}

export const ARTICLES: Article[] = [
  // 1. Comment utiliser ChatGPT pour apprendre la programmation
  {
    id: 'art-1',
    slug: 'comment-utiliser-chatgpt-pour-apprendre-la-programmation',
    url: '/article/comment-utiliser-chatgpt-pour-apprendre-la-programmation',
    title: 'Comment utiliser ChatGPT pour apprendre la programmation efficacement',
    seoTitle: 'Comment utiliser ChatGPT pour apprendre la programmation (Méthode Pas à Pas)',
    metaDescription:
      'Découvrez comment transformer ChatGPT en tuteur de programmation personnel : prompts socratiques, compréhension des erreurs, exercices graduels et bonnes pratiques.',
    categorySlug: 'chatgpt',
    categoryName: 'ChatGPT',
    secondaryCategories: ['ia', 'programmation', 'python', 'javascript'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '7 Novembre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '8 min',
    featured: true,
    isCompleteGuide: true,
    image: IMAGES.aiWorkspace,
    imageAlt: 'Développeur utilisant un assistant IA pour comprendre un algorithme sur double écran',
    excerpt:
      'Utiliser un modèle de langage pour copier-coller du code freine la progression. Voici une méthode structurée pour en faire un véritable mentor pédagogique.',
    introduction: [
      "Apprendre à programmer en autodidacte confronte souvent au même obstacle : rester bloqué de longues heures sur un message d'erreur cryptique ou sur un concept abstrait comme la récursivité, les promesses asynchrones ou la programmation orientée objet.",
      "Utilisé comme un simple générateur de réponses toutes faites, ChatGPT peut donner l'illusion de comprendre alors que l'on se contente de copier-coller. En revanche, lorsqu'on le configure comme un tuteur socratique qui pose des questions, explique ligne par ligne et propose des exercices progressifs, il devient un accélérateur d'apprentissage remarquable."
    ],
    sections: [
      {
        id: 'regle-or-ne-pas-copier-sans-comprendre',
        h2: '1. La règle fondamentale : demander une explication avant la solution',
        h3: 'Configurer le comportement pédagogique dès le premier message',
        paragraphs: [
          "Par défaut, un grand modèle de langage cherche à fournir la réponse la plus directe possible : si vous lui donnez un énoncé d'exercice, il écrira immédiatement le script complet. Pour apprendre réellement, vous devez inverser cette dynamique en lui interdisant de donner la solution finale d'emblée.",
          "En définissant un cadre clair au début de votre session d'étude, vous obligez l'assistant à décomposer le problème logique, à vérifier votre compréhension et à vous guider par des indices successifs."
        ],
        exampleBox: {
          title: 'Modèle de prompt « Tuteur Socratique » à copier',
          content:
            "« Agis comme un formateur senior en programmation Python. Je suis débutant et je souhaite comprendre les listes et les boucles. Ne me donne jamais le code complet directement. Explique-moi le concept avec une analogie simple, puis donne-moi un petit exercice pratique. Attends ma réponse, analyse mon code et guide-moi avec des questions si je fais une erreur. »"
        }
      },
      {
        id: 'analyser-et-deboguer-son-propre-code',
        h2: '2. Faire analyser et déboguer son code ligne par ligne',
        h3: 'Comprendre la pile d’exécution (Traceback) au lieu de la contourner',
        paragraphs: [
          "Lorsqu'un programme plante, le message d'erreur (Traceback en Python ou Stack Trace en JavaScript) contient l'emplacement exact et la nature de l'anomalie. Au lieu de coller uniquement l'erreur en demandant « corrige ça », fournissez votre code, l'erreur obtenue et ce que vous pensiez que le programme allait faire.",
          "Cette approche permet d'identifier les écarts entre votre modèle mental et l'exécution réelle par l'interpréteur."
        ],
        codeBlock: {
          language: 'python',
          title: 'Exemple : Comprendre une erreur d’indexation classique en Python',
          code: `# Code écrit par l'étudiant (provoque IndexError)
notes = [14, 16, 12, 18]
total = 0

# Erreur fréquente : range(len(notes) + 1) dépasse la taille de la liste
for i in range(len(notes)):
    total += notes[i]

moyenne = total / len(notes)
print(f"Moyenne calculée : {moyenne:.2f}/20")`
        }
      },
      {
        id: 'comparaison-mauvais-vs-bon-usage',
        h2: '3. Comparatif : Usage passif vs Apprentissage actif assisté par IA',
        paragraphs: [
          "Le tableau ci-dessous résume la différence entre une utilisation passive qui crée une dépendance à l'outil et une démarche active qui développe votre autonomie de développeur."
        ],
        table: {
          caption: 'Comparaison des approches d’apprentissage avec un assistant IA',
          headers: ['Situation', 'Prompt passif (À éviter)', 'Prompt d’apprentissage actif (Recommandé)'],
          rows: [
            [
              'Nouveau concept (ex: API REST)',
              '« Écris un appel API en JavaScript. »',
              '« Explique-moi le cycle requête/réponse HTTP avec fetch(), puis montre un exemple minimal commenté. »'
            ],
            [
              'Bug dans un script',
              '« Mon code ne marche pas, réécris-le. »',
              '« Voici mon code et l’erreur ligne 12. Explique-moi pourquoi cette variable vaut undefined sans réécrire tout le fichier. »'
            ],
            [
              'Révision d’un chapitre',
              '« Fais un résumé sur les fonctions. »',
              '« Génère 3 exercices de difficulté croissante sur les paramètres et valeurs de retour, et corrige mes réponses une par une. »'
            ]
          ]
        }
      },
      {
        id: 'creer-un-plan-d-etude-sur-mesure',
        h2: '4. Construire un programme d’entraînement par mini-projets',
        paragraphs: [
          "On retient durablement un langage de programmation lorsqu'on construit de petits outils concrets. Demandez à l'assistant de découper un projet réalisable en une semaine en étapes de 30 minutes : cahier des charges, structure des données, fonctions principales, gestion des erreurs et tests.",
          "À la fin de chaque mini-projet, soumettez votre code fonctionnel à une « revue de code » (Code Review) en demandant comment améliorer la lisibilité, le nommage des variables et la gestion des cas limites."
        ]
      }
    ],
    recommendations: {
      title: 'Outils complémentaires pour pratiquer le code',
      items: [
        {
          name: 'Compteur de Mots & Analyseur TechIA Lab',
          purpose: 'Calibrer et structurer vos prompts et documentations techniques',
          strengths: 'Gratuit, instantané et 100 % local dans le navigateur',
          url: '/outils/compteur-de-mots/'
        },
        {
          name: 'Guide Débutant Python',
          purpose: 'Passer de la théorie aux premiers scripts exécutables',
          strengths: 'Parcours progressif avec exemples testés',
          url: '/article/python-guide-pour-debutants'
        }
      ]
    },
    conclusion: [
      "Utilisé avec méthode, ChatGPT ne remplace pas l'effort de réflexion indispensable à tout programmeur : il élimine les blocages stériles et adapte le rythme d'explication à votre niveau.",
      "Privilégiez toujours l'écriture manuelle du code dans votre éditeur, testez chaque modification et exigez de comprendre chaque ligne avant de passer à l'étape suivante."
    ],
    faq: [
      {
        question: 'Quel langage choisir pour débuter avec ChatGPT ?',
        answer:
          'Python et JavaScript sont particulièrement adaptés car leur syntaxe est lisible et les modèles de langage disposent d’une excellente maîtrise de leurs bibliothèques standards.'
      },
      {
        question: 'ChatGPT peut-il se tromper dans le code qu’il propose ?',
        answer:
          'Oui. Il peut parfois inventer des méthodes inexistantes ou utiliser une syntaxe issue d’une ancienne version d’une bibliothèque. Il faut toujours exécuter et tester le code localement.'
      }
    ]
  },

  // 2. Comment créer une application web avec l'intelligence artificielle
  {
    id: 'art-2',
    slug: 'comment-creer-une-application-web-avec-l-intelligence-artificielle',
    url: '/article/comment-creer-une-application-web-avec-l-intelligence-artificielle',
    title: "Comment créer une application web de A à Z avec l'intelligence artificielle",
    seoTitle: "Créer une Application Web avec l'IA : Architecture, Code et Déploiement",
    metaDescription:
      "Guide complet pour concevoir, développer et déployer une application web moderne avec l'aide de l'intelligence artificielle (React, TypeScript, API et sécurité).",
    categorySlug: 'ia',
    categoryName: 'Intelligence artificielle',
    secondaryCategories: ['creation-sites-web', 'javascript', 'google-ai-gemini', 'programmation'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '6 Novembre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '10 min',
    featured: true,
    isCompleteGuide: true,
    image: IMAGES.webappBuilder,
    imageAlt: 'Interface d’application web moderne et schémas de composants sur écran d’architecte',
    excerpt:
      "De la rédaction du cahier des charges technique au déploiement en production : la méthode structurée pour bâtir une application web fiable avec l'IA.",
    introduction: [
      "La création d'une application web complète — comprenant une interface utilisateur réactive, une logique métier solide et éventuellement une intégration d'API — demandait autrefois plusieurs semaines de mise en place initiale.",
      "Aujourd'hui, les outils de développement assistés par intelligence artificielle permettent d'accélérer considérablement le prototypage et l'écriture des composants, à condition de suivre une architecture rigoureuse et de ne jamais négliger la sécurité."
    ],
    sections: [
      {
        id: 'definir-architecture-avant-de-generer',
        h2: '1. Définir le cahier des charges et le modèle de données',
        h3: 'Découper l’application en briques indépendantes',
        paragraphs: [
          "L'erreur la plus fréquente consiste à demander à un modèle d'IA de « créer toute l'application » en une seule instruction vague. Le résultat sera presque toujours incomplet ou difficile à maintenir.",
          "Commencez par rédiger une spécification courte définissant : l'objectif principal de l'utilisateur, les écrans nécessaires, la structure des données (en JSON ou interfaces TypeScript) et les règles de validation."
        ],
        codeBlock: {
          language: 'typescript',
          title: 'Définition propre des types de données avant de coder les composants',
          code: `export interface TaskItem {
  id: string;
  title: string;
  category: 'dev' | 'design' | 'contenu';
  completed: boolean;
  createdAt: string;
}

export interface ProjectSummary {
  totalTasks: number;
  completedCount: number;
  completionRate: number;
}`
        }
      },
      {
        id: 'securiser-les-appels-api-cote-serveur',
        h2: '2. Intégrer une API d’IA sans exposer ses clés secrètes',
        h3: 'Pourquoi passer obligatoirement par une route backend (/api/*)',
        paragraphs: [
          "Si votre application web appelle une API externe nécessitant une clé d'authentification (comme l'API Google Gemini ou une base de données), cette clé ne doit jamais figurer dans le code JavaScript envoyé au navigateur du visiteur.",
          "Créez toujours une route serveur intermédiaire qui lit la clé depuis une variable d'environnement (`process.env.GEMINI_API_KEY`), valide la requête entrante de l'utilisateur, puis transmet uniquement la réponse nettoyée au frontend."
        ],
        table: {
          caption: 'Règles de sécurité pour l’architecture d’une application web',
          headers: ['Couche applicative', 'Rôle principal', 'Règle de sécurité stricte'],
          rows: [
            ['Frontend (React / Vite)', 'Affichage UI, saisie utilisateur, état local', 'Aucune clé API privée dans le code client'],
            ['Backend Proxy (Express / Node)', 'Validation des entrées, appel aux API tierces', 'Stockage des secrets dans .env côté serveur'],
            ['Stockage / Base de données', 'Persistance des enregistrements', 'Contrôle des droits d’accès et nettoyage XSS']
          ]
        }
      },
      {
        id: 'assembler-tester-et-deployer',
        h2: '3. Générer les composants UI et vérifier l’accessibilité',
        paragraphs: [
          "Procédez composant par composant : d'abord la barre de navigation, puis le formulaire principal avec ses états d'erreur et de chargement, et enfin l'affichage des résultats.",
          "Vérifiez systématiquement le comportement sur écran mobile, la navigation au clavier et les contrastes de couleurs en mode clair comme en mode sombre."
        ]
      }
    ],
    recommendations: {
      title: 'Ressources recommandées pour vos applications web',
      items: [
        {
          name: 'Convertisseur CSS px / rem TechIA Lab',
          purpose: 'Calibrer vos espacements et tailles typographiques responsives',
          strengths: 'Calcul instantané pour Tailwind CSS et feuilles de style modernes',
          url: '/outils/convertisseur-unites/'
        },
        {
          name: 'Transformer une idée en application web',
          purpose: 'Méthodologie produit pour valider votre concept avant de coder',
          strengths: 'Étapes de cadrage fonctionnel et UX',
          url: '/article/comment-transformer-une-idee-en-application-web'
        }
      ]
    },
    conclusion: [
      "L'intelligence artificielle est un multiplicateur de productivité formidable pour le développement web lorsqu'elle est guidée par un développeur qui maîtrise l'architecture globale de son projet.",
      "En structurant vos types de données, en isolant vos clés secrètes côté serveur et en testant chaque composant individuellement, vous obtenez une application web robuste et évolutive."
    ],
    faq: [
      {
        question: 'Faut-il connaître le HTML et le JavaScript pour créer une application web avec l’IA ?',
        answer:
          'Oui, connaître les bases du HTML, du CSS et du JavaScript est indispensable pour relire le code généré, corriger un bug d’affichage et assembler les fichiers proprement.'
      }
    ]
  },

  // 3. Comment créer une application Python
  {
    id: 'art-3',
    slug: 'comment-creer-une-application-python',
    url: '/article/comment-creer-une-application-python',
    title: 'Comment créer une application Python propre et modulaire',
    seoTitle: 'Comment créer une application Python : Structure, Environnement et Code',
    metaDescription:
      'Apprenez à structurer et développer une application Python complète : environnement virtuel venv, séparation des modules, gestion des erreurs et interface.',
    categorySlug: 'python',
    categoryName: 'Python',
    secondaryCategories: ['programmation', 'automatisation', 'outils-pdf'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '5 Novembre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '9 min',
    featured: true,
    isCompleteGuide: true,
    image: IMAGES.pythonCoding,
    imageAlt: 'Éditeur de code affichant une application Python structurée',
    excerpt:
      'Passez d’un simple script isolé à une véritable application Python structurée avec environnement virtuel, typage et gestion propre des fichiers.',
    introduction: [
      "Beaucoup de débutants en Python écrivent l'intégralité de leur programme dans un seul fichier sans isoler leurs dépendances. Dès que le projet grandit, cette approche complique la maintenance et le partage du programme sur un autre ordinateur.",
      "Dans ce guide pratique, nous allons voir comment structurer une application Python professionnelle dès le départ : création d'un environnement virtuel isolé, découpage logique des fonctions, typage explicite (`type hints`) et gestion sécurisée des entrées/sorties."
    ],
    sections: [
      {
        id: 'environnement-virtuel-et-dependances',
        h2: '1. Initialiser un environnement virtuel (venv)',
        h3: 'Isoler les bibliothèques de chaque projet Python',
        paragraphs: [
          "Avant d'installer le moindre paquet avec `pip`, créez toujours un environnement virtuel dédié à votre projet. Cela évite les conflits de versions entre deux applications différentes installées sur la même machine.",
          "La bibliothèque standard de Python intègre nativement le module `venv` : aucune installation supplémentaire n'est requise."
        ],
        codeBlock: {
          language: 'bash',
          title: 'Création et activation d’un environnement virtuel Python',
          code: `# 1. Créer le dossier du projet et l'environnement virtuel .venv
mkdir mon_application_python && cd mon_application_python
python3 -m venv .venv

# 2. Activer l'environnement (Linux / macOS)
source .venv/bin/activate

# 3. Figer les dépendances dans requirements.txt
pip freeze > requirements.txt`
        }
      },
      {
        id: 'ecrire-du-code-python-type-et-robuste',
        h2: '2. Écrire une logique métier typée et gérer les exceptions',
        h3: 'Utiliser les annotations de type et pathlib',
        paragraphs: [
          "Depuis Python 3.10+, l'utilisation des annotations de type (`type hints`) et du module `pathlib` rend le code nettement plus lisible et prévient de nombreuses erreurs liées aux chemins de fichiers selon le système d'exploitation."
        ],
        codeBlock: {
          language: 'python',
          title: 'Exemple d’application Python analysant un dossier de documents',
          code: `from pathlib import Path
from dataclasses import dataclass

@dataclass
class RapportFichier:
    nom: str
    taille_ko: float
    extension: str

def analyser_dossier(chemin_dossier: str) -> list[RapportFichier]:
    dossier = Path(chemin_dossier)
    if not dossier.exists() or not dossier.is_dir():
        raise ValueError(f"Le dossier spécifié est introuvable : {chemin_dossier}")

    resultats: list[RapportFichier] = []
    for fichier in sorted(dossier.iterdir()):
        if fichier.is_file():
            taille = round(fichier.stat().st_size / 1024, 2)
            resultats.append(
                RapportFichier(
                    nom=fichier.name,
                    taille_ko=taille,
                    extension=fichier.suffix.lower() or "sans_ext"
                )
            )
    return resultats

if __name__ == "__main__":
    try:
        rapports = analyser_dossier(".")
        for r in rapports:
            print(f"{r.nom:<30} | {r.taille_ko:>8.2f} Ko | {r.extension}")
    except ValueError as err:
        print(f"Erreur d'exécution : {err}")`
        }
      },
      {
        id: 'choisir-interface-adaptee',
        h2: '3. Quelle interface choisir pour votre application Python ?',
        paragraphs: [
          "Selon le public cible de votre programme, vous pouvez conserver une interface en ligne de commande (CLI), créer une interface graphique de bureau ou exposer votre logique via une application web."
        ],
        table: {
          caption: 'Choisir la bonne bibliothèque selon le type d’application Python',
          headers: ['Type d’application', 'Bibliothèque recommandée', 'Cas d’usage idéal'],
          rows: [
            ['Outil en ligne de commande (CLI)', 'argparse / Typer', 'Scripts d’automatisation, traitement par lot, outils serveur'],
            ['API Web & Backend', 'FastAPI / Flask', 'Connecter un moteur Python à une interface web React'],
            ['Interface graphique bureau', 'Tkinter (inclus) / PySide6', 'Utilitaires locaux hors-ligne pour postes de travail']
          ]
        }
      }
    ],
    conclusion: [
      "Une application Python bien architecturée sépare toujours la logique pure (calculs, traitement de données) de l'interface utilisateur (console, web ou fenêtre graphique).",
      "Grâce à cette séparation, vous pourrez faire évoluer votre script de ligne de commande vers une API web complète sans réécrire le cœur de votre programme."
    ]
  },

  // 4. Comment transformer une idée en application web
  {
    id: 'art-4',
    slug: 'comment-transformer-une-idee-en-application-web',
    url: '/article/comment-transformer-une-idee-en-application-web',
    title: 'Comment transformer une idée en application web fonctionnelle (Du concept au MVP)',
    seoTitle: 'Transformer une Idée en Application Web : Du Concept au MVP en 5 Étapes',
    metaDescription:
      'Méthodologie étape par étape pour transformer une idée de projet en application web : cadrage du problème, maquettage, choix technologiques et lancement du MVP.',
    categorySlug: 'creation-sites-web',
    categoryName: 'Création de sites web',
    secondaryCategories: ['programmation', 'applications-android', 'freelance-revenus-numeriques'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '4 Novembre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '7 min',
    featured: true,
    isCompleteGuide: true,
    image: IMAGES.creatorDesk,
    imageAlt: 'Carnet de croquis UX et ordinateur portable pour concevoir une application web',
    excerpt:
      'Pourquoi tant de projets web restent inachevés ? Apprenez à réduire votre idée à sa fonctionnalité essentielle (MVP) pour publier une première version utile.',
    introduction: [
      "Avoir une idée d'application web est enthousiasmant, mais la tentation d'ajouter vingt fonctionnalités dès la première version conduit souvent à l'abandon du projet avant même sa mise en ligne.",
      "La méthode du Produit Minimum Viable (MVP) consiste à identifier le problème central que résout votre outil et à construire le parcours utilisateur le plus court et le plus fiable possible."
    ],
    sections: [
      {
        id: 'formuler-probleme-en-une-phrase',
        h2: '1. Formuler le problème et l’action principale',
        paragraphs: [
          "Avant d'ouvrir un éditeur de code ou de choisir une palette de couleurs, rédigez en une seule phrase ce que l'utilisateur obtient en moins de deux minutes sur votre application.",
          "Si vous ne parvenez pas à résumer le flux sous la forme « Entrée utilisateur → Traitement → Résultat concret », le périmètre initial est probablement trop dispersé."
        ],
        exampleBox: {
          title: 'Exemple de découpage MVP réussi',
          content:
            "Idée initiale trop vaste : « Une plateforme complète de gestion comptable et juridique pour tous les indépendants ». → MVP réaliste en 1 semaine : « Un calculateur interactif permettant à un freelance de simuler son Tarif Journalier Moyen (TJM) selon son revenu net cible et ses jours travaillés. »"
        }
      },
      {
        id: 'dessiner-flux-ecrans-essentiels',
        h2: '2. Esquisser le parcours en 3 zones sur papier',
        paragraphs: [
          "Prenez une feuille de papier et dessinez uniquement les contrôles indispensables : la zone de saisie (formulaire ou fichier), le bouton d'action principal et la zone de restitution du résultat.",
          "Supprimez tout élément décoratif qui n'aide pas l'utilisateur à accomplir sa tâche principale (comme un système de profil complexe ou des notifications non essentielles)."
        ]
      },
      {
        id: 'choisir-stack-simple-et-maitrisee',
        h2: '3. Choisir une architecture technique simple et rapide',
        paragraphs: [
          "Le meilleur outil technique pour un premier lancement est celui qui minimise la complexité opérationnelle. Pour la majorité des utilitaires et applications web modernes, une architecture React + TypeScript + Tailwind CSS permet d'obtenir une interface rapide, accessible sur mobile comme sur ordinateur."
        ],
        table: {
          caption: 'Étapes de validation d’une idée d’application web',
          headers: ['Étape', 'Livrable concret', 'Durée indicative'],
          rows: [
            ['1. Cadrage fonctionnel', 'Liste de 3 fonctionnalités maximum (Must-Have)', '1 jour'],
            ['2. Maquettage & Flux UI', 'Croquis des états : vide, chargement, résultat, erreur', '1 jour'],
            ['3. Développement du cœur', 'Interface fonctionnelle avec données réelles', '2 à 4 jours'],
            ['4. Mise en ligne & Test', 'Déploiement HTTPS, balises SEO et retours utilisateurs', '1 jour']
          ]
        }
      }
    ],
    recommendations: {
      title: 'Outils utiles pour cadrer votre projet',
      items: [
        {
          name: 'Calculateur Freelance & Projets TechIA Lab',
          purpose: 'Estimer le temps et le budget d’un projet numérique',
          strengths: 'Simulation claire du TJM et du volume horaire',
          url: '/outils/calculateur/'
        }
      ]
    },
    conclusion: [
      "Une application web simple, en ligne et parfaitement fonctionnelle aura toujours plus de valeur qu'un projet monumental resté à l'état de brouillon sur votre disque dur.",
      "Lancez une première brique utile, observez comment les visiteurs l'utilisent, puis enrichissez-la étape par étape."
    ]
  },

  // 5. Les meilleurs outils IA pour créer du contenu
  {
    id: 'art-5',
    slug: 'les-meilleurs-outils-ia-pour-creer-du-contenu',
    url: '/article/les-meilleurs-outils-ia-pour-creer-du-contenu',
    title: 'Comment choisir et utiliser les outils IA pour créer du contenu de qualité',
    seoTitle: 'Outils IA pour Créer du Contenu : Méthode Éditoriale et Comparatif',
    metaDescription:
      'Tour d’horizon méthodique des outils d’intelligence artificielle pour la recherche, la structuration rédactionnelle, l’illustration et la vérification.',
    categorySlug: 'ia',
    categoryName: 'Intelligence artificielle',
    secondaryCategories: ['chatgpt', 'google-ai-gemini', 'canva-creation', 'outils-en-ligne'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '3 Novembre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '7 min',
    featured: true,
    isCompleteGuide: false,
    image: IMAGES.contentCreation,
    imageAlt: 'Studio de création de contenu numérique avec tablette graphique et nuancier',
    excerpt:
      'Pourquoi le contenu généré automatiquement sans relecture échoue sur le web, et comment combiner expertise humaine et outils IA pour produire des guides utiles.',
    introduction: [
      "La multiplication des outils de génération de texte et d'image a profondément transformé le travail de documentation, de rédaction web et de conception visuelle.",
      "Cependant, publier des textes générés à la chaîne sans vérification ni valeur ajoutée personnelle est contre-productif : les lecteurs comme les moteurs de recherche privilégient les contenus précis, vérifiés et ancrés dans l'expérience réelle."
    ],
    sections: [
      {
        id: 'flux-editorial-hybride-humain-ia',
        h2: '1. La méthode éditoriale en 4 étapes : Humain aux commandes',
        paragraphs: [
          "Les créateurs et rédacteurs techniques qui tirent le meilleur parti de l'intelligence artificielle ne lui délèguent jamais la responsabilité éditoriale finale. Ils l'utilisent comme un assistant de structuration et de relecture."
        ],
        table: {
          caption: 'Répartition optimale des rôles entre l’auteur humain et l’outil IA',
          headers: ['Phase de création', 'Rôle de l’outil IA', 'Valeur ajoutée indispensable de l’auteur'],
          rows: [
            ['1. Recherche & Plan', 'Suggérer des angles, lister les questions fréquentes des débutants', 'Sélectionner les sujets réellement utiles et écarter le superflu'],
            ['2. Brouillon & Exemples', 'Générer une structure de tableau ou un squelette de code', 'Tester le code, apporter des exemples vécus et un ton authentique'],
            ['3. Illustration & Mise en page', 'Générer des schémas ou visuels d’illustration cohérents', 'Vérifier la lisibilité, les contrastes et les balises alt descriptives'],
            ['4. Contrôle qualité', 'Corriger les coquilles orthographiques et syntaxiques', 'Valider l’exactitude technique de chaque affirmation']
          ]
        }
      },
      {
        id: 'categories-outils-selon-le-besoin',
        h2: '2. Associer chaque besoin au bon type d’outil',
        h3: 'Texte, synthèse documentaire et conception graphique',
        paragraphs: [
          "Pour l'analyse de longs documents techniques ou de fichiers PDF volumineux, les modèles dotés d'une large fenêtre de contexte comme Google Gemini permettent d'interroger directement vos propres sources sans perdre le fil.",
          "Pour la structuration d'idées, de plans d'articles ou de scripts pédagogiques, les assistants conversationnels comme ChatGPT offrent une grande souplesse d'itération. Enfin, pour la mise en page finale (guides PDF, couvertures, infographies), des outils visuels comme Canva permettent d'appliquer une charte graphique propre et constante."
        ]
      }
    ],
    recommendations: {
      title: 'Comparer les solutions et outils gratuits sur TechIA Lab',
      items: [
        {
          name: 'Compteur de Mots & Analyseur SEO',
          purpose: 'Vérifier la longueur, le temps de lecture et la structure de vos articles',
          strengths: 'Analyse instantanée de la densité des mots-clés',
          url: '/outils/compteur-de-mots/'
        },
        {
          name: 'Dossier Google AI / Gemini',
          purpose: 'Explorer les usages multimodaux (texte, code, documents)',
          strengths: 'Guides techniques orientés projets',
          url: '/google-ai-gemini/'
        }
      ]
    },
    conclusion: [
      "Un bon outil numérique ne remplace jamais la clarté de pensée : il vous fait gagner du temps sur les tâches mécaniques afin que vous puissiez soigner la précision de vos explications et la qualité de vos exemples."
    ]
  },

  // 6. Comment créer un livre Kindle avec Canva
  {
    id: 'art-6',
    slug: 'comment-creer-un-livre-kindle-avec-canva',
    url: '/article/comment-creer-un-livre-kindle-avec-canva',
    title: 'Comment créer et formater un livre pour Amazon Kindle (KDP) avec Canva',
    seoTitle: 'Créer un Livre Kindle et Broché KDP avec Canva : Dimensions et Marges',
    metaDescription:
      'Guide technique complet pour concevoir l’intérieur et la couverture d’un livre Amazon KDP avec Canva : formats en pouces/cm, fond perdu, tranche et export PDF.',
    categorySlug: 'kdp',
    categoryName: 'Kindle & KDP',
    secondaryCategories: ['canva-creation', 'outils-pdf', 'freelance-revenus-numeriques'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '2 Novembre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '9 min',
    featured: true,
    isCompleteGuide: true,
    image: IMAGES.kdpPublishing,
    imageAlt: 'Liseuse numérique et carnet de mise en page pour l’édition Amazon KDP',
    excerpt:
      'Dimensions exactes en pouces et centimètres, calcul de l’épaisseur de la tranche, marges de sécurité et export PDF pour l’impression : le guide technique KDP.',
    introduction: [
      "Amazon Kindle Direct Publishing (KDP) permet de publier des livres numériques (eBooks Kindle) et des livres brochés imprimés à la demande sans stock initial. Cependant, la plateforme applique un contrôle technique automatisé très strict sur les fichiers PDF soumis.",
      "Une erreur d'un millimètre sur le fond perdu (bleed) ou sur la largeur de la tranche suffit à provoquer le rejet du fichier lors de la prévisualisation. Voici les règles géométriques exactes pour réussir votre mise en page avec Canva."
    ],
    sections: [
      {
        id: 'dimensions-interieur-et-fond-perdu',
        h2: '1. Choisir le format de coupe (Trim Size) et gérer le fond perdu',
        h3: 'La différence entre un livre avec et sans fond perdu (Bleed)',
        paragraphs: [
          "Le format le plus courant pour les guides pratiques et carnets sur KDP est le format 6 × 9 pouces (soit 15,24 × 22,86 cm). Si aucune image ou couleur de fond ne touche le bord de la page, vous utilisez les dimensions exactes de coupe.",
          "En revanche, si des illustrations ou encadrés vont jusqu'au bord de la feuille (avec fond perdu / Bleed), vous devez ajouter 0,125 pouce en haut, en bas et sur le bord extérieur, soit une dimension personnalisée dans Canva de 6,125 × 9,25 pouces."
        ],
        table: {
          caption: 'Dimensions exactes à saisir dans Canva pour un intérieur KDP',
          headers: ['Format KDP standard', 'Dimensions sans fond perdu', 'Dimensions avec fond perdu (Bleed)', 'Équivalent en cm (sans bleed)'],
          rows: [
            ['5 × 8 pouces', '5 × 8 in', '5,125 × 8,25 in', '12,70 × 20,32 cm'],
            ['6 × 9 pouces (Le plus courant)', '6 × 9 in', '6,125 × 9,25 in', '15,24 × 22,86 cm'],
            ['8,5 × 11 pouces (Grand cahier)', '8,5 × 11 in', '8,625 × 11,25 in', '21,59 × 27,94 cm']
          ]
        }
      },
      {
        id: 'calculer-largeur-couverture-et-tranche',
        h2: '2. Calculer les dimensions complètes de la couverture brochée',
        paragraphs: [
          "Pour un livre broché, la couverture est un fichier PDF unique qui regroupe : la quatrième de couverture (à gauche), le dos / la tranche au centre, et la première de couverture (à droite), entourés d'une marge de fond perdu de 0,125 pouce de chaque côté.",
          "L'épaisseur de la tranche dépend du nombre exact de pages et du type de papier (papier blanc : environ 0,002252 pouce par page ; papier crème : environ 0,0025 pouce par page)."
        ],
        exampleBox: {
          title: 'Exemple de calcul pour un livre 6 × 9 pouces de 120 pages (papier blanc)',
          content:
            "• Épaisseur de la tranche = 120 × 0,002252 = 0,27 pouce.\n• Largeur totale couverture = 0,125 + 6 + 0,27 + 6 + 0,125 = 12,52 pouces.\n• Hauteur totale couverture = 0,125 + 9 + 0,125 = 9,25 pouces."
        }
      },
      {
        id: 'exporter-en-pdf-pour-impression',
        h2: '3. Exporter en « PDF pour impression » et contrôler le fichier',
        paragraphs: [
          "Une fois votre maquette terminée dans Canva, cliquez sur Partager → Télécharger et sélectionnez impérativement « PDF pour impression » (300 DPI) et non « PDF Standard ».",
          "Avant de soumettre votre manuscrit sur KDP, vérifiez que tous vos textes importants respectent une marge intérieure (reliure) d'au moins 0,375 à 0,5 pouce afin qu'aucune lettre ne soit masquée dans le pli central du livre."
        ]
      }
    ],
    recommendations: {
      title: 'Outils TechIA Lab dédiés aux auteurs KDP',
      items: [
        {
          name: 'Calculateur de Redevances & Coûts d’impression KDP',
          purpose: 'Simuler vos frais d’impression et votre marge nette par exemplaire',
          strengths: 'Calcul instantané selon le nombre de pages et le prix catalogue',
          url: '/outils/calculateur/'
        },
        {
          name: 'Convertisseur Pouces / Centimètres',
          purpose: 'Convertir toutes les dimensions KDP américaines en centimètres et millimètres',
          strengths: 'Précision immédiate pour vos gabarits Canva',
          url: '/outils/convertisseur-unites/'
        }
      ]
    },
    conclusion: [
      "La réussite technique d'un livre sur Amazon KDP repose avant tout sur la rigueur des dimensions de départ et sur la lisibilité de la typographie.",
      "Prenez toujours le temps d'inspecter page par page votre fichier dans le prévisualiseur officiel de KDP avant de valider la publication."
    ]
  },

  // 7. Comment convertir un PDF en différents formats
  {
    id: 'art-7',
    slug: 'comment-convertir-un-pdf-en-differents-formats',
    url: '/article/comment-convertir-un-pdf-en-differents-formats',
    title: 'Comment convertir, fusionner et optimiser un fichier PDF selon ses besoins',
    seoTitle: 'Convertir un PDF en Différents Formats (Images, Web, Impression) : Le Guide',
    metaDescription:
      'Tout comprendre sur la conversion de fichiers PDF : PDF vers images PNG/WebP, images vers PDF, fusion, compression et automatisation avec Python.',
    categorySlug: 'outils-pdf',
    categoryName: 'Outils PDF',
    secondaryCategories: ['outils-en-ligne', 'python', 'kdp'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '1 Novembre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '7 min',
    featured: false,
    isCompleteGuide: false,
    image: IMAGES.digitalTools,
    imageAlt: 'Pipeline de conversion et d’optimisation de documents numériques PDF',
    excerpt:
      'Pourquoi le format PDF est-il si particulier, et comment le convertir en images PNG/WebP, l’alléger ou l’assembler sans perte de qualité ?',
    introduction: [
      "Créé pour garantir qu'un document s'affiche de manière strictement identique quel que soit l'écran ou l'imprimante, le format PDF (Portable Document Format) encapsule à la fois du texte vectoriel, des polices de caractères et des images matricielles.",
      "Cette rigidité volontaire rend parfois sa réutilisation délicate lorsqu'on souhaite extraire une page sous forme d'image pour un site web, regrouper plusieurs pièces jointes ou réduire le poids d'un dossier trop volumineux pour un envoi par email."
    ],
    sections: [
      {
        id: 'choisir-le-bon-format-cible',
        h2: '1. Quel format choisir lors de la conversion d’un PDF ?',
        paragraphs: [
          "Le choix du format de destination dépend directement de l'usage final : intégration sur une page web, archivage bureautique ou impression haute définition."
        ],
        table: {
          caption: 'Guide de choix pour la conversion de fichiers PDF',
          headers: ['Besoin utilisateur', 'Format cible recommandé', 'Résolution / Réglage conseillé'],
          rows: [
            ['Afficher un aperçu de page sur un site web', 'Image WebP ou PNG', '150 DPI avec compression sans perte visible'],
            ['Imprimer une planche ou couverture', 'Image PNG ou PDF/X', '300 DPI minimum'],
            ['Envoyer un dossier par messagerie (limite 10 Mo)', 'PDF compressé', 'Sous-échantillonnage des images internes à 150 DPI'],
            ['Regrouper des justificatifs scannés en JPG', 'Images vers PDF A4', 'Marges uniformes de 10 mm et orientation portrait']
          ]
        }
      },
      {
        id: 'automatiser-avec-python-ou-navigateur',
        h2: '2. Outils gratuits dans le navigateur vs Scripts Python par lot',
        paragraphs: [
          "Pour traiter un à dix documents ponctuellement, l'utilisation d'un utilitaire web fonctionnant localement dans votre navigateur est la solution la plus rapide et la plus respectueuse de la confidentialité de vos données.",
          "Si vous devez traiter des centaines de factures ou de rapports chaque semaine, l'écriture d'un petit script Python utilisant une bibliothèque spécialisée comme `pypdf` permet d'automatiser l'opération en quelques secondes."
        ],
        codeBlock: {
          language: 'python',
          title: 'Exemple de fusion de fichiers PDF avec la bibliothèque pypdf en Python',
          code: `from pypdf import PdfWriter
from pathlib import Path

def fusionner_pdfs(liste_fichiers: list[str], fichier_sortie: str) -> None:
    fusionneur = PdfWriter()
    for chemin in liste_fichiers:
        if Path(chemin).exists():
            fusionneur.append(chemin)
    
    with open(fichier_sortie, "wb") as f_out:
        fusionneur.write(f_out)
    fusionneur.close()
    print(f"Document consolidé créé : {fichier_sortie}")`
        }
      }
    ],
    recommendations: {
      title: 'Accès direct à nos outils PDF gratuits',
      items: [
        {
          name: 'Convertisseur PDF vers Images',
          purpose: 'Exporter vos planches en PNG ou WebP haute définition',
          strengths: 'Exécution locale rapide sans inscription',
          url: '/outils/pdf-vers-images/'
        },
        {
          name: 'Outil Fusionner PDF & Compresser PDF',
          purpose: 'Assembler et alléger vos documents en quelques clics',
          strengths: 'Interface claire avec contrôle de l’ordre des pages',
          url: '/outils/fusionner-pdf/'
        }
      ]
    },
    conclusion: [
      "En choisissant la bonne résolution et l'outil adapté à votre volume de documents, vous maîtrisez le poids et la qualité visuelle de tous vos fichiers PDF."
    ]
  },

  // 8. Comment créer un site web avec l'IA
  {
    id: 'art-8',
    slug: 'comment-creer-un-site-web-avec-l-ia',
    url: '/article/comment-creer-un-site-web-avec-l-ia',
    title: "Comment créer un site web professionnel, rapide et bien référencé avec l'IA",
    seoTitle: "Créer un Site Web avec l'IA : Structure HTML, Design, SEO et Performance",
    metaDescription:
      "Apprenez à concevoir et publier un site web moderne avec l'aide de l'IA tout en respectant les standards SEO, la vitesse de chargement et le responsive mobile.",
    categorySlug: 'creation-sites-web',
    categoryName: 'Création de sites web',
    secondaryCategories: ['ia', 'google-ai-gemini', 'javascript'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '30 Octobre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '8 min',
    featured: false,
    isCompleteGuide: true,
    image: IMAGES.websiteDesign,
    imageAlt: 'Design de site web responsive affiché simultanément sur ordinateur, tablette et mobile',
    excerpt:
      "Un site web réussi ne se résume pas à un joli visuel : découvrez comment structurer vos pages, optimiser votre SEO technique et garantir d'excellents Core Web Vitals.",
    introduction: [
      "Créer un site web aujourd'hui est devenu beaucoup plus accessible grâce aux assistants de génération de code et de design. Pourtant, de nombreux sites créés rapidement souffrent de lenteurs, d'une mauvaise adaptation aux smartphones ou d'une structure HTML incompréhensible pour les moteurs de recherche.",
      "Ce guide détaille les fondamentaux incontournables pour construire un site web propre, durable et prêt pour le référencement naturel."
    ],
    sections: [
      {
        id: 'structure-semantique-html5',
        h2: '1. Soigner la structure sémantique HTML5 et la hiérarchie des titres',
        paragraphs: [
          "Les robots d'indexation (comme Googlebot) ainsi que les lecteurs d'écran s'appuient sur les balises sémantiques HTML5 pour comprendre l'organisation d'une page.",
          "Chaque page doit comporter un seul et unique titre `<h1>` décrivant le sujet central, suivi de sous-sections `<h2>` et `<h3>` logiquement imbriquées, à l'intérieur de conteneurs `<header>`, `<nav>`, `<main>`, `<article>` et `<footer>`."
        ],
        codeBlock: {
          language: 'html',
          title: 'Squelette HTML5 sémantique et SEO-friendly d’une page de contenu',
          code: `<header>
  <nav aria-label="Navigation principale">
    <a href="/">TechIA Lab</a>
  </nav>
</header>

<main>
  <article>
    <h1>Titre unique et descriptif de la page</h1>
    <p>Introduction claire répondant dès les premières lignes à l'intention de recherche.</p>
    
    <section id="etape-1">
      <h2>1. Première grande section thématique</h2>
      <p>Développement structuré avec exemples concrets.</p>
    </section>
  </article>
</main>

<footer>
  <p>© 2026 TechIA Lab — Mentions légales & Confidentialité</p>
</footer>`
        }
      },
      {
        id: 'performance-et-core-web-vitals',
        h2: '2. Optimiser la vitesse de chargement et le Responsive Mobile',
        paragraphs: [
          "Plus de la moitié de la navigation web s'effectue sur smartphone. Un site professionnel doit donc être conçu en donnant la priorité à la lisibilité mobile : textes d'au moins 15 à 16 pixels, boutons espacés et images dotées des attributs `loading=\"lazy\"` et de dimensions explicites pour éviter les décalages de mise en page (CLS)."
        ],
        table: {
          caption: 'Checklist technique avant la mise en ligne d’un site web',
          headers: ['Critère', 'Vérification concrète', 'Impact principal'],
          rows: [
            ['Balises SEO de base', '<title> unique (30-60 car.) et <meta name="description"> (120-158 car.)', 'Taux de clic dans les résultats de recherche'],
            ['Optimisation des images', 'Formats modernes, attribut alt descriptif et lazy loading sous la ligne de flottaison', 'Temps de chargement initial (LCP) et accessibilité'],
            ['Pages de confiance', 'Pages À propos, Contact, Mentions légales et Politique de confidentialité accessibles', 'Crédibilité utilisateur et conformité AdSense / RGPD']
          ]
        }
      }
    ],
    conclusion: [
      "En combinant la rapidité de génération de l'IA avec une vérification méthodique de votre HTML sémantique, de vos balises SEO et de vos performances mobiles, vous posez des fondations saines pour développer l'audience de votre site."
    ]
  },

  // 9. Python : guide pour débutants
  {
    id: 'art-9',
    slug: 'python-guide-pour-debutants',
    url: '/article/python-guide-pour-debutants',
    title: 'Python : Le guide complet pour débutants (Syntaxe, Logique et Premiers Scripts)',
    seoTitle: 'Python pour Débutants : Apprendre les Bases Pas à Pas avec Exemples',
    metaDescription:
      'Initiez-vous à la programmation avec Python : variables, types de données, conditions, boucles, fonctions et dictionnaires expliqués simplement avec du code.',
    categorySlug: 'python',
    categoryName: 'Python',
    secondaryCategories: ['programmation', 'automatisation'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '28 Octobre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '11 min',
    featured: false,
    isCompleteGuide: true,
    image: IMAGES.pythonBeginners,
    imageAlt: 'Manuel d’algorithmique ouvert à côté d’un ordinateur exécutant un script Python',
    excerpt:
      'Variables, conditions, boucles, listes et fonctions : maîtrisez les fondations du langage Python à travers des explications claires et des exemples directement exécutables.',
    introduction: [
      "Créé avec la philosophie que le code est lu beaucoup plus souvent qu'il n'est écrit, Python s'impose comme le langage idéal pour découvrir la programmation. Sa syntaxe épurée, proche de l'anglais courant, utilise l'indentation (le décalage en début de ligne) pour délimiter les blocs logiques au lieu d'accolades complexes.",
      "Ce guide rassemble les briques fondamentales qui vous permettront de lire et d'écrire vos premiers programmes Python en toute autonomie."
    ],
    sections: [
      {
        id: 'variables-et-types-fondamentaux',
        h2: '1. Les variables et les 4 types de données de base',
        paragraphs: [
          "Une variable est une étiquette associée à une valeur stockée en mémoire. En Python, il n'est pas nécessaire de déclarer le type à l'avance (typage dynamique), mais il est essentiel de connaître les quatre types primitifs : les chaînes de caractères (`str`), les nombres entiers (`int`), les nombres décimaux (`float`) et les booléens (`bool`)."
        ],
        codeBlock: {
          language: 'python',
          title: 'Déclaration de variables et formatage f-string en Python',
          code: `nom_projet = "TechIA Lab"      # str (chaîne de caractères)
nombre_guides = 10             # int (entier)
temps_moyen_min = 8.5          # float (nombre à virgule)
est_gratuit = True             # bool (Vrai ou Faux)

# Les f-strings (f"...") permettent d'insérer des variables proprement
message = f"Bienvenue sur {nom_projet} : {nombre_guides} guides disponibles."
print(message)`
        }
      },
      {
        id: 'structures-conditionnelles-et-boucles',
        h2: '2. Prendre des décisions (if/else) et répéter des actions (for)',
        paragraphs: [
          "Tout programme informatique repose sur deux mécanismes : exécuter un bloc d'instructions uniquement si une condition est vérifiée (`if / elif / else`), et parcourir une collection d'éléments sans dupliquer son code (`for ... in ...`)."
        ],
        codeBlock: {
          language: 'python',
          title: 'Parcourir une liste de dictionnaires et filtrer selon une condition',
          code: `outils = [
    {"nom": "QR Code", "categorie": "Générateurs", "actif": True},
    {"nom": "Compteur de mots", "categorie": "Texte", "actif": True},
    {"nom": "Ancien module", "categorie": "Archive", "actif": False},
]

def lister_outils_actifs(catalogue: list[dict]) -> list[str]:
    noms_actifs = []
    for outil in catalogue:
        if outil["actif"] is True:
            noms_actifs.append(outil["nom"])
    return noms_actifs

print("Outils disponibles :", lister_outils_actifs(outils))`
        }
      },
      {
        id: 'tableau-memo-structures-python',
        h2: '3. Mémo des structures de collections en Python',
        paragraphs: [
          "Pour regrouper plusieurs valeurs, Python propose quatre structures principales aux propriétés distinctes."
        ],
        table: {
          caption: 'Comparatif des collections natives en Python',
          headers: ['Structure', 'Syntaxe', 'Modifiable (Mutable)', 'Usage principal'],
          rows: [
            ['Liste (list)', '[10, 20, 30]', 'Oui', 'Séquence ordonnée d’éléments que l’on peut trier ou compléter'],
            ['Dictionnaire (dict)', '{"cle": "valeur"}', 'Oui', 'Associer des étiquettes uniques à des valeurs (proche du JSON)'],
            ['Tuple (tuple)', '(1920, 1080)', 'Non (Immuable)', 'Coordonnées ou paramètres fixes qui ne doivent pas être altérés'],
            ['Ensemble (set)', '{"python", "js"}', 'Oui', 'Éliminer automatiquement les doublons et tester l’appartenance']
          ]
        }
      }
    ],
    conclusion: [
      "Une fois ces quatre piliers maîtrisés (variables, conditions, boucles et fonctions), vous disposez de toutes les bases nécessaires pour aborder la lecture de fichiers et l'automatisation de tâches concrètes."
    ]
  },

  // 10. Comment automatiser une tâche avec l'IA
  {
    id: 'art-10',
    slug: 'comment-automatiser-une-tache-avec-l-ia',
    url: '/article/comment-automatiser-une-tache-avec-l-ia',
    title: "Comment automatiser une tâche répétitive avec Python et l'IA",
    seoTitle: "Automatiser une Tâche avec l'IA et Python : Méthode et Exemples Concrets",
    metaDescription:
      "Apprenez à identifier, découper et automatiser vos tâches numériques chronophages en combinant des scripts déterministes et l'intelligence artificielle.",
    categorySlug: 'automatisation',
    categoryName: 'Automatisation',
    secondaryCategories: ['ia', 'python', 'outils-en-ligne', 'freelance-revenus-numeriques'],
    author: 'Équipe Éditoriale TechIA Lab',
    date: '25 Octobre 2026',
    updatedDate: '7 Novembre 2026',
    readTime: '8 min',
    featured: false,
    isCompleteGuide: false,
    image: IMAGES.workflowAutomation,
    imageAlt: 'Architecture isométrique de flux d’automatisation, webhooks API et tâches planifiées',
    excerpt:
      'Quand faut-il utiliser un simple script classique et quand faut-il faire appel à un modèle d’IA ? La méthode pour concevoir des automatisations fiables.',
    introduction: [
      "Renommer des dizaines de fichiers, extraire des informations clés d'un courrier, reformater un tableau CSV ou vérifier la cohérence d'un dossier : ces opérations répétitives consomment chaque semaine un temps précieux.",
      "L'automatisation moderne repose sur une règle d'architecture essentielle : confier tout ce qui est prévisible à du code classique déterministe, et réserver l'intelligence artificielle aux étapes qui nécessitent de comprendre du texte non structuré."
    ],
    sections: [
      {
        id: 'distinguer-regle-fixe-et-comprehension-ia',
        h2: '1. Règle déterministe vs Traitement par IA : ne pas tout mélanger',
        paragraphs: [
          "Si une tâche suit une règle mathématique ou logique stricte (par exemple : convertir des pouces en centimètres, compter des mots ou déplacer les fichiers `.pdf` dans un sous-dossier), un script classique sera mille fois plus rapide, gratuit et fiable à 100 %.",
          "En revanche, s'il s'agit de résumer un compte rendu de réunion ou de classer des messages clients selon leur sujet, un modèle de langage appelé avec un schéma de sortie JSON strict apporte une souplesse inégalée."
        ],
        table: {
          caption: 'Choisir entre script classique et étape IA dans un workflow',
          headers: ['Nature de la tâche', 'Technologie recommandée', 'Raison technique'],
          rows: [
            ['Renommage de fichiers, calculs, tri par date', 'Script Python / JavaScript standard', 'Exécution instantanée, coût nul et résultat garanti sans aléa'],
            ['Classification de messages ou synthèse de texte libre', 'Appel API IA avec schéma JSON structuré', 'Capacité à interpréter les nuances du langage naturel'],
            ['Pipeline mixte (Ex: lire un dossier, résumer et enregistrer)', 'Script Python orchestrant un appel IA', 'Combine la fiabilité du système de fichiers et la synthèse intelligente']
          ]
        }
      },
      {
        id: 'exemple-pipeline-extraction-structuree',
        h2: '2. Structurer un pipeline avec vérification et journalisation',
        paragraphs: [
          "Toute bonne automatisation doit inclure un mode « test à blanc » (`dry-run`) qui affiche ce que le programme s'apprête à faire sans modifier les fichiers originaux, ainsi qu'une validation stricte des données produites."
        ],
        codeBlock: {
          language: 'python',
          title: 'Structure d’un pipeline d’automatisation sécurisé avec mode dry_run',
          code: `from pathlib import Path

def organiser_documents_par_extension(dossier_source: str, dry_run: bool = True) -> dict[str, int]:
    source = Path(dossier_source)
    compteur: dict[str, int] = {}

    for element in source.iterdir():
        if element.is_file() and element.suffix:
            categorie = element.suffix.lstrip(".").upper()
            compteur[categorie] = compteur.get(categorie, 0) + 1
            cible = source / f"Archives_{categorie}" / element.name

            if dry_run:
                print(f"[SIMULATION] Déplacerait : {element.name} -> {cible}")
            else:
                cible.parent.mkdir(exist_ok=True)
                element.rename(cible)

    return compteur

# Toujours tester en mode simulation (dry_run=True) en premier !
statistiques = organiser_documents_par_extension(".", dry_run=True)
print("Bilan de l'analyse :", statistiques)`
        }
      }
    ],
    recommendations: {
      title: 'Outils d’automatisation immédiate sur TechIA Lab',
      items: [
        {
          name: 'Générateur de Mot de Passe Cryptographique',
          purpose: 'Sécuriser vos comptes et clés d’accès d’automatisation',
          strengths: 'Génération Web Crypto locale à haute entropie',
          url: '/outils/generateur-mot-de-passe/'
        },
        {
          name: 'Tous nos Outils Gratuits',
          purpose: 'Convertir, calculer et formater vos données sans installation',
          strengths: '9 utilitaires accessibles immédiatement',
          url: '/outils/'
        }
      ]
    },
    conclusion: [
      "Commencez toujours par automatiser une petite tâche quotidienne que vous maîtrisez parfaitement à la main. Vérifiez les résultats en mode simulation, puis enrichissez progressivement votre boîte à outils personnelle."
    ]
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesForCategory(categorySlug: string): Article[] {
  if (categorySlug === 'guides') {
    return ARTICLES.filter((a) => a.isCompleteGuide);
  }
  return ARTICLES.filter(
    (a) =>
      a.categorySlug === categorySlug ||
      a.secondaryCategories.includes(categorySlug)
  );
}
