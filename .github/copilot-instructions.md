# Directives du projet (Angular 17+)

## Context & Tech Stack
- Framework: Angular (v17+)
- Architecture: Standalone Components uniquement (`standalone: true`, aucun NgModule)
- Styles: SCSS (par défaut)

## Coding Standards & Patterns

### Component Architecture & Syntax
- Tout nouveau composant doit être un Standalone Component (`standalone: true`).
- Toujours utiliser la nouvelle syntaxe Control Flow pour le template :
  - `@if (...) { ... } @else { ... }` (ne pas utiliser `*ngIf`).
  - `@for (item of items; track item.id) { ... }` (exiger systématiquement le `track`, ne pas utiliser `*ngFor`).
  - `@switch` (ne pas utiliser `*ngSwitch`).
- Préférer la fonction `inject()` au constructeur pour l'injection de dépendances :
  `private faceSnapsService = inject(FaceSnapsService);`
  `private router = inject(Router);`
  `private route = inject(ActivatedRoute);`
- Préférer le mode de détection OnPush par défaut : `changeDetection: ChangeDetectionStrategy.OnPush`.

### Component Inputs & Properties
- Pour la réception de données dans un composant :
  - Soit utiliser la fonction `input()` / `input.required()` (approche Signals).
  - Soit le décorateur `@Input() myProperty!: MyType;` ou avec optionnel `@Input() myProperty?: MyType;`.
- Pour la navigation programmatique, injecter `Router` et utiliser `this.router.navigateByUrl('path')`.
- Pour récupérer des paramètres de route, utiliser `ActivatedRoute` (ex: `this.route.snapshot.params['id']`).

### Typing, Models & Data Transfer
- Activer le mode strict TypeScript (`strict: true`).
- Interdire strictement l'usage du type `any`. Utiliser des types stricts, des interfaces ou des Literal Types.
- Préférer les **Literal Types** pour restreindre des valeurs précises (ex: `export type SnapType = 'snap' | 'unsnap';`).
- Utiliser le mot-clé `public` / `private` directement dans les constructeurs de classes de modèle pour raccourcir les déclarations si nécessaire :
  ```ts
  export class FaceSnap {
    id: string = crypto.randomUUID().substring(0, 8);
    location?: string;
    constructor(
      public title: string,
      public description: string,
      public imageUrl: string,
      public createdAt: Date,
      public snaps: number
    ) {}
  }