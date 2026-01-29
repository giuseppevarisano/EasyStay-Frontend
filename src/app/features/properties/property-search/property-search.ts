import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth';
import { PropertyService } from '../../../core/services/property';
import { CasavacanzaResponseDTO } from '../../../core/api/generated/model/models';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-search.html',
  styleUrl: './property-search.scss',
})
export class PropertySearch implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private propertyService = inject(PropertyService);
  private router = inject(Router);

  searchForm: FormGroup;
  currentUser: User | null = null;
  properties: CasavacanzaResponseDTO[] = [];
  loading = false;
  errorMessage = '';
  searched = false;

  constructor() {
    this.searchForm = this.fb.group({
      dataInizio: ['', Validators.required],
      dataFine: ['', Validators.required],
      citta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Recupera l'utente corrente
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.searched = true;

      const { dataInizio, dataFine, citta } = this.searchForm.value;

      this.propertyService.getAvailableProperties(dataInizio, dataFine, citta).subscribe({
        next: (properties) => {
          this.properties = properties;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching properties:', error);
          this.errorMessage = error?.error?.message || 'Errore durante la ricerca delle case.';
          this.loading = false;
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // Getter per validazione form
  get dataInizio() {
    return this.searchForm.get('dataInizio');
  }

  get dataFine() {
    return this.searchForm.get('dataFine');
  }

  get citta() {
    return this.searchForm.get('citta');
  }
}