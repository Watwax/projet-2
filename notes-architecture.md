# Analyse de l'architecture du dossier src/app

## 1. Fichiers trop volumineux / composants trop chargés

Aucun fichier n’est monstrueux en taille, mais plusieurs composants sont trop chargés en logique métier :

- [src/app/pages/home/home.component.ts](src/app/pages/home/home.component.ts) :
  - charge les données HTTP,
  - transforme les données,
  - calcule les totaux,
  - construit le graphique,
  - gère la navigation,
  - gère les erreurs.
- [src/app/pages/country/country.component.ts](src/app/pages/country/country.component.ts) :
  - lit les paramètres de route,
  - récupère les données,
  - filtre le pays,
  - calcule les nombres,
  - construit le graphique.

Cela montre un anti-pattern : le composant fait plusieurs rôles à la fois, au lieu de se limiter à l’affichage et à la coordination.

## 2. Données gérées directement dans les composants

C’est un point important à relever comme anti-pattern.

Les composants manipulent directement le JSON brut depuis les données mockées :

- [src/app/pages/home/home.component.ts](src/app/pages/home/home.component.ts)
- [src/app/pages/country/country.component.ts](src/app/pages/country/country.component.ts)

Les données sont filtrées, transformées, agrégées et utilisées directement dans le composant. Il n’y a pas de service dédié ni de mapper/adapter. Cela complique la maintenance si le format de données change.

## 3. Appels HTTP dans les composants

Les appels HTTP sont directement dans les composants :

- `this.http.get<any[]>(...)` dans [src/app/pages/home/home.component.ts](src/app/pages/home/home.component.ts)
- `this.http.get<any[]>(...)` dans [src/app/pages/country/country.component.ts](src/app/pages/country/country.component.ts)

En Angular, il est préférable de centraliser la logique de données dans un service, par exemple `OlympicService`, afin de séparer la couche métier et la couche UI.

## 4. Absence de typage strict / utilisation de any

On retrouve de nombreux `any` dans le code :

- `data: any[]`
- `i: any`
- `totalEntries: any`
- `accumulator: any`
- `error: HttpErrorResponse` est bien typé, mais le reste de la logique est peu strict.

Exemples :

- [src/app/pages/home/home.component.ts](src/app/pages/home/home.component.ts)
- [src/app/pages/country/country.component.ts](src/app/pages/country/country.component.ts)

Cela réduit la sécurité du code, complique le refactoring, et augmente le risque de bugs silencieux. Il faudrait définir des interfaces comme `Country`, `Participation` et `OlympicData`.

## 5. Code dupliqué / logique répétée

La logique de récupération de données est redondante entre les deux composants :

- même appel HTTP au fichier JSON,
- même schéma d’accès à `participations`,
- mêmes calculs de type “nombre de pays / années / médailles”.

La duplication est visible entre :

- [src/app/pages/home/home.component.ts](src/app/pages/home/home.component.ts)
- [src/app/pages/country/country.component.ts](src/app/pages/country/country.component.ts)

Il faudrait factoriser cette logique dans un service ou dans des utilitaires.

## 6. Mauvaise gestion des observables

Plusieurs éléments montrent une gestion fragile des observables :

- `this.route.paramMap.subscribe(...)` dans [src/app/pages/country/country.component.ts](src/app/pages/country/country.component.ts) sans gestion propre du cycle de vie ;
- `this.http.get(...).subscribe(...)` dans les composants, sans `unsubscribe` explicite ;
- pas de gestion claire de `loading`, `success` et `error` ;
- pas de transformation avec `switchMap` ou `map` sur la route + la donnée ;
- le code contient des `pipe()` vides, ce qui ne sert à rien.

Cela est un anti-pattern, car la logique asynchrone est gérée de façon très basique, sans séparation claire entre flux de route et flux de données.

## 7. Code à supprimer / bouts de code obsolètes

On trouve des éléments clairement à retirer :

- `console.log` dans [src/app/pages/home/home.component.ts](src/app/pages/home/home.component.ts)

Exemples :

- `console.log(\`Liste des données : ${JSON.stringify(data)}\`);`
- `console.log(\`erreur : ${error}\`);`

Ces logs ne doivent pas rester dans le code final, surtout en production. Ils polluent le code et peuvent exposer des données sensibles ou inutiles dans la console.

## 8. Fichiers mal placés / structure non idiomatique

Le dossier app ne contient pas de service dédié pour la logique de données. Or les appels HTTP et la manipulation des données sont directement intégrés dans les composants.

Cela suggère que la structure devrait être :

- `services/` pour les appels HTTP,
- `models/` pour les interfaces,
- `components/` uniquement pour l’affichage et l’interaction UI,
- `pages/` pour les écrans complets.

Le code actuel mélange les couches, ce qui est un mauvais signe architectural.

## 9. Logique métier mélangée à la logique de rendu

Les composants ne se contentent pas de gérer l’UI : ils calculent des statistiques, filtrent les données, construisent des charts, gèrent la navigation, et connaissent le structure du JSON. Cela crée un couplage fort entre :

- la vue,
- les données,
- les librairies de visualisation,
- les règles métier.

La bonne architecture consiste à isoler les calculs dans des services ou fonctions utilitaires, puis à laisser le composant afficher uniquement le résultat.

## 10. Tests et conventions de nommage

Les tests sont très basiques et ne couvrent pas le vrai comportement :

- [src/app/pages/home/home.component.spec.ts](src/app/pages/home/home.component.spec.ts)
- [src/app/pages/country/country.component.spec.ts](src/app/pages/country/country.component.spec.ts)
- [src/app/pages/not-found/not-found.component.spec.ts](src/app/pages/not-found/not-found.component.spec.ts)
- [src/app/app.component.spec.ts](src/app/app.component.spec.ts)

On remarque aussi des incohérences :

- `describe('DetailComponent')` dans [src/app/pages/country/country.component.spec.ts](src/app/pages/country/country.component.spec.ts) alors que le composant est `CountryComponent` ;
- le test `AppComponent` vérifie un titre qui n’existe plus dans le composant (`title` de `olympic-games-starter`), ce qui montre un test obsolète.

## Conclusion

L’architecture actuelle montre plusieurs problèmes récurrents :

- logique métier dans les composants,
- appels HTTP dans les composants,
- typage faible (`any`),
- code dupliqué,
- observables mal exploités,
- logs de debug à supprimer,
- absence de séparation des responsabilités.

Pour corriger cela, il faudrait introduire :

- un ou plusieurs services Angular,
- des interfaces TypeScript dédiées,
- des méthodes plus courtes et plus lisibles,
- une vraie gestion d’état et d’erreur,
- un nettoyage des tests obsolètes.
