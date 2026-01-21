import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiService = inject(ApiService);
  private readonly basePath = '/bookings';

  createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Observable<Booking> {
    return this.apiService.post<Booking>(this.basePath, booking);
  }

  getUserBookings(): Observable<Booking[]> {
    return this.apiService.get<Booking[]>(`${this.basePath}/my-bookings`);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.apiService.get<Booking>(`${this.basePath}/${id}`);
  }

  cancelBooking(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.basePath}/${id}`);
  }
}
