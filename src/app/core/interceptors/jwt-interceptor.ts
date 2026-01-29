import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Verifica se è una rotta di autenticazione (login/register)
  const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  // Clona la richiesta e aggiunge il token JWT SOLO se:
  // 1. Il token esiste
  // 2. NON è una rotta di autenticazione
  if (token && !isAuthRoute) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Se riceve 401 Unauthorized su rotte protette, effettua il logout
      if (error.status === 401 && !isAuthRoute) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
