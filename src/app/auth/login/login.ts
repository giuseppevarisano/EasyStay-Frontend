import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('==================== DEBUG ====================');
          console.log('LocalStorage PRIMA del setTimeout:');
          console.log('  - auth_token:', localStorage.getItem('auth_token'));
          console.log('  - Tutte le chiavi:', Object.keys(localStorage));

          // Aspetta che il token sia salvato prima di navigare
          setTimeout(() => {
            console.log('LocalStorage DOPO il setTimeout:');
            console.log('  - auth_token:', localStorage.getItem('auth_token'));

            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/search';
            this.router.navigate([returnUrl]);
          }, 100);
        },
        error: async (error) => {
          console.error('Login error:', error);

          let message = 'Errore durante il login. Verifica le credenziali.';

          // Gestisci la risposta Blob dal backend
          if (error.error instanceof Blob) {
            try {
              const text = await error.error.text();
              const errorObj = JSON.parse(text);
              message = errorObj.message || message;
            } catch (e) {
              console.error('Errore nel parsing del Blob:', e);
            }
          } else if (error.error?.message) {
            message = error.error.message;
          }

          this.errorMessage = message;
          this.loading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
