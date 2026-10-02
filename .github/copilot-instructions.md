# Directives du projet (Angular)

## Context & Tech Stack
- Framework: Angular (v17+)
- Architecture: Standalone Components (aucun NgModule pour les nouveaux éléments)

## Coding Standards & Patterns

### Components
- Utiliser la syntaxe Standalone (`standalone: true`).
- Préférer la nouvelle syntaxe de contrôle de flux (`@if`, `@for`, `@switch`) au lieu des directives structurelles (`*ngIf`, `*ngFor`).
- Utiliser les Signals pour la gestion de l'état local : `signal()`, `computed()`, `effect()`.
- Préférer la fonction `inject()` au constructeur pour l'injection de dépendances (`private myService = inject(MyService);`).
- Utiliser les décorateurs `@Input()` et `@Output()`.
- Activer la détection de changement OnPush par défaut : `changeDetection: ChangeDetectionStrategy.OnPush`.

### Services & API
- Déclarer les services avec `{ providedIn: 'root' }`.
- Utiliser `HttpClient` avec la réactivité basée sur les Observables / Signals.
- Toujours typer explicitement les retours des méthodes et API.

### Typing & TypeScript
- Activer le mode strict (`strict: true`).
- Interdire l'usage du type `any`. Utiliser `unknown` si nécessaire avec du type narrowing.
- Définir des interfaces claires pour toutes les structures de données dans des fichiers `.model.ts`.

### Testing & Naming
- Générer des tests unitaires avec Jasmine/Karma (ou Jest si spécifié) pour chaque composant ou service.
- Fichiers : `kebab-case` (`user-profile.component.ts`).
- Composants : `PascalCase` avec le suffixe Component (`UserProfileComponent`).
- Services : `PascalCase` avec le suffixe Service (`UserService`).

## Performance & Best Practices
- Toujours désabonner les Observables (utiliser `takeUntilDestroyed()`, `async` pipe ou Signals).
- Ne jamais exécuter de logique lourde directement dans le template (utiliser des `computed()` signals ou pipes pure).