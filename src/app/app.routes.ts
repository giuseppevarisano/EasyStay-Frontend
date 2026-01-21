import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'properties',
    canActivate: [authGuard],
    loadComponent: () => import('./features/properties/property-list/property-list').then(m => m.PropertyList)
  },
  {
    path: '',
    redirectTo: '/properties',
    pathMatch: 'full'
  }
];
