import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { Property, PropertyFilter } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiService = inject(ApiService);
  private readonly basePath = '/properties';

  getProperties(filters?: PropertyFilter): Observable<Property[]> {
    const params: any = {};
    
    if (filters) {
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice.toString();
      if (filters.maxPrice) params.maxPrice = filters.maxPrice.toString();
      if (filters.minBedrooms) params.minBedrooms = filters.minBedrooms.toString();
      if (filters.maxGuests) params.maxGuests = filters.maxGuests.toString();
      if (filters.checkIn) params.checkIn = filters.checkIn.toISOString();
      if (filters.checkOut) params.checkOut = filters.checkOut.toISOString();
    }

    return this.apiService.get<Property[]>(this.basePath, params);
  }

  getPropertyById(id: number): Observable<Property> {
    return this.apiService.get<Property>(`${this.basePath}/${id}`);
  }

  getAvailableProperties(checkIn: Date, checkOut: Date): Observable<Property[]> {
    const params = {
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString()
    };
    return this.apiService.get<Property[]>(`${this.basePath}/available`, params);
  }
}
