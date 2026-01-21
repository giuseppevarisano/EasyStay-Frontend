import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property';
import { Property } from '../../../core/models/property.model';

@Component({
  selector: 'app-property-list',
  imports: [CommonModule],
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
})
export class PropertyList implements OnInit {
  private propertyService = inject(PropertyService);
  private router = inject(Router);

  properties: Property[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.errorMessage = '';

    this.propertyService.getProperties().subscribe({
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
