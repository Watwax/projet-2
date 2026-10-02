# Architecture front-end

## Objectif

L’application Angular affiche une synthèse des médailles olympiques, puis le détail d’un pays sélectionné. L’architecture sépare les responsabilités afin de garder des pages simples, des données typées et des composants réutilisables.

## Organisation des fichiers

```text
src/app/
├── app-routing.module.ts       # Routes de l’application
├── app.module.ts               # Module principal et déclarations
├── components/                 # Composants réutilisables d’interface
│   ├── country-card/
│   ├── medal-chart/
│   └── stat-card/
├── models/
│   └── olympic.model.ts        # Interfaces des données et des résumés
├── pages/                      # Écrans liés aux routes
│   ├── home/
│   ├── country/
│   └── not-found/
└── services/
    └── data.service.ts         # Accès et préparation des données
```

## Responsabilités

### Pages

Les pages `HomeComponent` et `CountryComponent` coordonnent l’affichage d’un écran. Elles lisent les paramètres de route lorsque nécessaire, appellent le service, stockent l’état d’affichage et transmettent les valeurs aux composants enfants.

Elles ne connaissent pas le format du fichier JSON et ne calculent pas elles-mêmes les totaux métier.

### Composants réutilisables

- `StatCardComponent` affiche une statistique générique.
- `CountryCardComponent` affiche une statistique liée à un pays.
- `MedalChartComponent` encapsule l’affichage des graphiques Chart.js et émet le pays sélectionné.

Ces composants reçoivent leurs données par `@Input()` et communiquent les actions utilisateur par `@Output()`. Ils peuvent donc être réutilisés par plusieurs pages.

### Modèles

Le fichier `models/olympic.model.ts` contient les interfaces TypeScript utilisées par l’application :

- `Participation` décrit une participation olympique ;
- `OlympicCountry` décrit un pays et ses participations ;
- `DashboardSummary` décrit les données préparées pour l’accueil ;
- `CountrySummary` décrit les données préparées pour le détail d’un pays.

Le typage évite l’utilisation de `any` et rend les transformations plus sûres lors des évolutions du projet.

## Usage de `DataService`

`DataService` est un service Angular singleton fourni avec `providedIn: 'root'`. Il centralise l’accès à `assets/mock/olympic.json` et les transformations nécessaires à l’interface.

Ses principales méthodes sont :

- `getOlympicData()` récupère les données brutes typées ;
- `getCountryByName()` recherche un pays ;
- `getDashboardSummary()` calcule les indicateurs de la page d’accueil ;
- `getCountrySummary()` prépare les indicateurs de la page pays.

Le flux est donc le suivant :

```text
JSON mocké
   ↓
DataService
   ↓
Résumé typé (DashboardSummary / CountrySummary)
   ↓
Page Angular
   ↓
Composants réutilisables et graphiques
```

Les pages s’abonnent aux observables du service et utilisent `takeUntil` avec `ngOnDestroy` pour arrêter les abonnements lorsque les composants sont détruits.

## Routage

Les routes principales sont définies dans `app-routing.module.ts` :

- `/` affiche le tableau de bord ;
- `/country/:countryName` affiche le détail d’un pays ;
- les routes inconnues affichent `NotFoundComponent`.

La page pays utilise le paramètre `countryName`, puis demande au service le résumé correspondant.

## Tests et validation

Les tests sont organisés près du code concerné :

- `data.service.spec.ts` teste les requêtes HTTP et les calculs de résumé avec `HttpTestingController` ;
- les specs des pages testent la consommation du service, la navigation, les erreurs et la destruction des observables ;
- les tests de composants vérifient également que les pages réagissent correctement à un pays inexistant.

La validation manuelle consiste à lancer l’application avec `ng serve`, ouvrir le tableau de bord, sélectionner un pays et vérifier l’affichage des statistiques et des graphiques.

## Évolution vers une API back-end

Le remplacement du fichier JSON par une API pourra être réalisé principalement dans `DataService` :

1. remplacer l’URL du fichier mock par l’URL de l’API ;
2. conserver les interfaces de `models/` si le contrat de l’API est identique ;
3. adapter les transformations dans le service si la réponse change ;
4. laisser les pages et les composants consommer les mêmes résumés typés.

Cette organisation limite l’impact d’un changement de source de données. Les composants d’interface restent indépendants de la technologie utilisée pour fournir les données.

## Règles de maintenance

- Les appels HTTP et les calculs métier restent dans `services/`.
- Les pages coordonnent les données et l’affichage, sans reproduire les calculs du service.
- Les composants réutilisables restent génériques et communiquent avec `@Input()` / `@Output()`.
- Les nouvelles données doivent être ajoutées aux modèles TypeScript plutôt qu’avec `any`.
- Toute nouvelle souscription doit prévoir sa destruction ou utiliser l’`async` pipe.
- Les tests doivent être mis à jour avec chaque évolution du contrat du service ou des composants.
