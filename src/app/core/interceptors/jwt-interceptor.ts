import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Clona la richiesta e aggiunge il token JWT se presente
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Non gestire 401 sulle rotte di autenticazione (login/register)
      const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/register');
      
      // Se riceve 401 Unauthorized su rotte protette, effettua il logout
      if (error.status === 401 && !isAuthRoute) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
