import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import * as fr from '@angular/common/locales/fr';

import { routes } from './app.routes';

registerLocaleData(fr.default);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
};
