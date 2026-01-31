import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
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
    return this.autenticazioneService.authenticate(
      { authenticationRequestDTO: credentials },
      'response'
    )
      .pipe(
        tap((response: HttpResponse<AuthenticationResponseDTO>) => this.handleLoginHttpResponse(response)),
        map((response: HttpResponse<AuthenticationResponseDTO>) => response.body ?? {})
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

  private handleLoginHttpResponse(response: HttpResponse<AuthenticationResponseDTO>): void {
    let token = response.body?.token;

    if (!token) {
      const authorization = response.headers.get('Authorization') || response.headers.get('authorization');
      if (authorization) {
        token = authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization;
      }
    }

    if (!token) {
      token = response.headers.get('X-Auth-Token') || response.headers.get('x-auth-token') || undefined;
    }

    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
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
