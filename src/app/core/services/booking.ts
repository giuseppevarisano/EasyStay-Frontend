import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PrenotazioniService } from '../api/generated';
import { 
  PrenotazioneRequestDTO, 
  PrenotazioneResponseDTO,
  PagePrenotazioneResponseDTO
} from '../api/generated/model/models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private prenotazioniService = inject(PrenotazioniService);

  createBooking(booking: PrenotazioneRequestDTO): Observable<PrenotazioneResponseDTO> {
    return this.prenotazioniService.crea({ prenotazioneRequestDTO: booking });
  }

  /**
   * Recupera tutte le prenotazioni dell'utente senza paginazione
   * Nota: richiede l'ID utente come parametro
   */
  getUserBookings(utenteId: number): Observable<Array<PrenotazioneResponseDTO>> {
    return this.prenotazioniService.getByUtenteSenzaPaginazione({ utenteId });
  }

  /**
   * Recupera le prenotazioni dell'utente con paginazione
   */
  getUserBookingsPaginated(utenteId: number, page: number = 0, size: number = 10): Observable<PagePrenotazioneResponseDTO> {
    return this.prenotazioniService.getByUtente({ utenteId, page, size });
  }
}
