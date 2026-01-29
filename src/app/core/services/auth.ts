import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AutenticazioneService } from '../api/generated';
import { 
  AuthenticationRequestDTO, 
  AuthenticationResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO
} from '../api/generated/model/models';

// Interfaccia per l'utente corrente
export interface User {
  email: string;
  nome: string;
  ruolo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private autenticazioneService = inject(AutenticazioneService);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {}

  login(credentials: AuthenticationRequestDTO): Observable<AuthenticationResponseDTO> {
    return this.autenticazioneService.authenticate({ authenticationRequestDTO: credentials })
      .pipe(
        tap(response => this.handleLoginResponse(response))
      );
  }

  register(userData: RegisterRequestDTO): Observable<RegisterResponseDTO> {
    return this.autenticazioneService.register({ registerRequestDTO: userData })
      .pipe(
        tap(response => this.handleRegisterResponse(response))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleLoginResponse(response: AuthenticationResponseDTO): void {
    if (response.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
    }
  }

  private handleRegisterResponse(response: RegisterResponseDTO): void {
    if (response.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
    }
    if (response.email && response.nome) {
      const user: User = {
        email: response.email,
        nome: response.nome,
        ruolo: 'USER'
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
