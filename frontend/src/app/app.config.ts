import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    // BASE_PATH is consumed by the generated API services.
    // Empty string = same origin (proxied in dev, real backend in prod).
    { provide: 'BASE_PATH', useValue: '' },
  ]
};
