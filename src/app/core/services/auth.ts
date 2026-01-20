import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => this.handleLoginResponse(response))
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, userData)
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

  private handleLoginResponse(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    // Il login ritorna solo il token, non i dati utente
  }

  private handleRegisterResponse(response: RegisterResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    const user: User = {
      email: response.email,
      nome: response.nome,
      ruolo: 'USER' // Default ruolo
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
