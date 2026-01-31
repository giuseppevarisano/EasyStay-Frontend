import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  console.log('🔒 AuthGuard check - Token:', token ? 'Presente' : 'Assente');
  console.log('🔒 Tentativo di accesso a:', state.url);

  if (token) {
    console.log('✅ AuthGuard: Accesso consentito');
    return true;
  }

  console.log('❌ AuthGuard: Accesso negato, redirect a login');
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
