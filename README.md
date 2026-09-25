# TéléSport Olympic Games

Application Angular permettant de consulter les performances olympiques par pays.
Le projet contient un dashboard et une page de détail accessible depuis le graphique.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Commandes](#commandes)
- [Architecture](#architecture)
- [Navigation et erreurs](#navigation-et-erreurs)
- [Responsive et accessibilité](#responsive-et-accessibilité)
- [Tests et validation](#tests-et-validation)
- [Captures d’écran](#captures-décran)

## Fonctionnalités

- Dashboard `/` avec le nombre de pays, le nombre de Jeux olympiques et un pie chart des médailles.
- Navigation depuis un pays du graphique vers `/country/:countryName`.
- Page de détail avec participations, médailles, athlètes et évolution annuelle.
- Retour vers le dashboard depuis la page détail.
- Données centralisées dans `DataService` et modèles TypeScript sans `any`.
- États utilisateur pour chargement, données absentes, erreurs et routes inconnues.

## Prérequis

- Node.js 18.19 ou une version compatible Angular 18 ;
- npm ;
- Angular CLI 18, installé globalement ou utilisé via `npx` ;
- un navigateur Chromium/Chrome pour exécuter les tests Karma et vérifier l’interface.

## Installation

```bash
npm install
npm start
```

L’application est ensuite disponible sur `http://localhost:4200/`.

## Commandes

```bash
# Serveur de développement
npm start

# Build de production
NG_CLI_ANALYTICS=false npm run build

# Vérification TypeScript des tests
npx tsc -p tsconfig.spec.json --noEmit

# Tests unitaires en mode navigateur
npm test -- --watch=false --browsers=ChromeHeadless
```

La commande de tests nécessite un binaire Chrome/Chromium disponible. Dans cet environnement, le bundle de tests compile mais ChromeHeadless n’est pas installé ; la compilation TypeScript reste vérifiable avec la commande ci-dessus.

## Architecture

```text
src/app/
├── components/
│   ├── header/       # Titre et liste d’indicateurs
│   ├── medal-chart/  # Wrapper Chart.js, pie et line charts
│   └── stat-card/    # Affichage d’un indicateur
├── models/           # Interfaces TypeScript
├── pages/
│   ├── home/         # Dashboard
│   ├── country/      # Détail d’un pays
│   └── not-found/    # Route d’erreur
└── services/
    └── data.service.ts
```

`DataService` récupère `src/assets/mock/olympic.json`, recherche un pays et prépare les résumés utilisés par les pages. Les pages coordonnent l’affichage ; les composants réutilisables reçoivent leurs données par `@Input()`.

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour le détail des responsabilités et l’évolution possible vers une API back-end.

## Navigation et erreurs

- `/` affiche le dashboard ;
- `/country/:countryName` affiche le détail d’un pays valide ;
- un pays absent redirige vers `/not-found` ;
- toute URL inconnue utilise la route générique `**` et affiche `NotFoundComponent` ;
- les erreurs de récupération affichent un message utilisateur clair sans exposer le message technique de l’exception ;
- une absence de données ne laisse pas un écran vide.

## Responsive et accessibilité

Les pages utilisent des layouts adaptatifs : contenu large sur desktop, graphique pleine largeur sur tablette et empilement vertical sur mobile. Les liens disposent d’un focus visible et les graphiques ont une description `aria-label`.

La vérification responsive doit être réalisée dans les DevTools avec au minimum une largeur desktop et une largeur mobile. Les captures attendues doivent montrer le dashboard et la page détail dans ces deux formats.

## Tests et validation

Les tests unitaires couvrent notamment :

- les transformations de `DataService` avec `HttpTestingController` ;
- l’affichage des résumés dans Home et Country ;
- la navigation vers un pays ;
- les pays inexistants et les erreurs de service ;
- la destruction des abonnements RxJS.

Validation de build actuelle : `npm run build` réussit.

## Captures d’écran

Le dossier `captures/` est réservé aux captures finales du dashboard et de la page détail, idéalement en desktop et mobile. Les captures doivent être prises après lancement de `npm start`, puis regroupées dans une archive `captures.zip` avant publication sur GitHub.

Les captures ne sont pas générées automatiquement dans ce dépôt, car l’environnement de validation ne dispose pas d’un navigateur Chrome/Chromium pilotable.
