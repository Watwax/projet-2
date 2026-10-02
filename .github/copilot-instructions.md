# Directives du projet (Angular)

## Création & Commandes CLI
- Lancement du serveur de dev : `ng serve`.
- Génération de composant : `ng generate component nom_component` (ou `ng g c nom_component`).

## Structure & Composants
- Utiliser la syntaxe Standalone Components (`standalone: true`).
- Importer les directives, pipes et modules nécessaires directement dans le tableau `imports` du composant (`NgStyle`, `NgClass`, `DatePipe`, `RouterLink`, etc.).
- Pour initialiser des données après la création du composant, implémenter l'interface `OnInit` et utiliser la méthode `ngOnInit()`.

## Syntaxe HTML & Templates

### Control Flow Blocks
- Conditions : Utiliser `@if (condition) { ... } @else { ... }`.
- Boucles : Utiliser `@for (item of items; track item.prop) { ... }`.
- Déclarer les propriétés optionnelles dans les modèles avec `propriete?: type`.

### Data & Event Binding
- Binding d'attribut / propriété : `[attribut]="propriete"` (ex: `[src]="url"`).
- Binding d'événement : `(event)="methode()"` (ex: `(click)="onAddPoint()"`).
- Inputs de composants : Déclarer avec le décorateur `@Input() nomPropriete!: typePropriete;`.
- Passer des données au composant enfant via sa balise : `<app-component [propriete]="valeur" />`.

### Styles dynamiques
- Attributs de style inline : Utiliser `[ngStyle]="{ property: value }"`.
- Classes CSS conditionnelles : Utiliser `[ngClass]="{ 'class-name': condition }"`.

### Formatage avec les Pipes
- Textes : `UpperCasePipe`, `LowerCasePipe`, `TitleCasePipe` (`{{ variable | uppercase }}`).
- Dates : `DatePipe` (`{{ date | date: 'd MMMM yyyy, à HH:mm' }}`).
- Nombres : `DecimalPipe` (`{{ nb | number: '1.0-0' }}`), `PercentPipe` (`{{ ratio | percent: '1.0-1' }}`), `CurrencyPipe` (`{{ prix | currency: 'EUR' }}`).

## Configuration Régionale (I18n)
- Dans `main.ts` : Importer `registerLocaleData` de `@angular/common` et `* as fr from '@angular/common/locales/fr'`, puis exécuter `registerLocaleData(fr.default)`.
- Dans `app.config.ts` : Ajouter `{ provide: LOCALE_ID, useValue: 'fr-FR' }` dans les `providers`.

## Modèles & Types TypeScript
- Préférer la déclaration condensée de classe avec `public` dans le constructeur :
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