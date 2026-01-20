import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  // Esempio di rotta protetta
  // {
  //   path: 'dashboard',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  // }
];
