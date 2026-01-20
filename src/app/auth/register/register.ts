import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      ruolo: ['USER', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { confirmPassword, ...registerData } = this.registerForm.value;
      // Assicuriamoci che i dati siano nel formato corretto per RegisterRequestDTO
      const requestData = {
        email: registerData.email,
        password: registerData.password,
        nome: registerData.nome,
        ruolo: registerData.ruolo
      };

      this.authService.register(requestData).subscribe({
        next: () => {
          this.successMessage = 'Registrazione completata con successo! Reindirizzamento...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Errore durante la registrazione. Riprova.';
          this.loading = false;
        }
      });
    }
  }

  get nome() {
    return this.registerForm.get('nome');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get ruolo() {
    return this.registerForm.get('ruolo');
  }
}
