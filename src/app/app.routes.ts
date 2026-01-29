import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PropertySearchComponent } from './components/property-search/property-search.component';
import { AuthComponent } from './components/auth/auth.component';
import { PropertiesComponent } from './components/properties/properties.component';

export const appRoutes: Routes = [
    { path: 'auth', component: AuthComponent },
    { path: 'search', component: PropertySearchComponent, canActivate: [AuthGuard] },
    { path: 'properties', component: PropertiesComponent },
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];