import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt-interceptor';
import { Configuration } from './core/api/generated';
import { BASE_PATH } from './core/api/generated/variables';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    { provide: BASE_PATH, useValue: environment.apiUrl },
    {
      provide: Configuration,
      useFactory: () => new Configuration({
        basePath: environment.apiUrl,
        credentials: {
          bearerAuth: () => localStorage.getItem('auth_token') || ''
        }
      })
    }
  ]
};
