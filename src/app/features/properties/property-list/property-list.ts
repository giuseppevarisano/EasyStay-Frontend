import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property';
import { CasavacanzaResponseDTO } from '../../../core/api/generated/model/models';

@Component({
  selector: 'app-property-list',
  imports: [CommonModule],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
})
export class PropertyList implements OnInit {
  private propertyService = inject(PropertyService);
  private router = inject(Router);

  properties: CasavacanzaResponseDTO[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.errorMessage = '';

    // Per ora cerchiamo case a Roma nelle prossime date
    // In futuro questo dovrebbe venire da un form di ricerca
    const oggi = new Date();
    const domani = new Date(oggi);
    domani.setDate(domani.getDate() + 1);
    
    const inizio = oggi.toISOString().split('T')[0]; // formato YYYY-MM-DD
    const fine = domani.toISOString().split('T')[0];

    this.propertyService.getAvailableProperties(inizio, fine, 'Roma').subscribe({
      next: (properties) => {
        this.properties = properties;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.errorMessage = 'Errore nel caricamento delle case disponibili.';
        this.loading = false;
      }
    });
  }

  viewPropertyDetails(propertyId: number): void {
    this.router.navigate(['/properties', propertyId]);
  }
}
