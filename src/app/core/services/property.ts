import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CasavacanzaControllerService } from '../api/generated';
import { CasavacanzaResponseDTO } from '../api/generated/model/models';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private casavacanzaService = inject(CasavacanzaControllerService);

  /**
   * Cerca case disponibili in base a date e città
   * @param inizio Data di inizio (formato ISO string)
   * @param fine Data di fine (formato ISO string)
   * @param citta Città da cercare
   */
  getAvailableProperties(inizio: string, fine: string, citta: string): Observable<Array<CasavacanzaResponseDTO>> {
    return this.casavacanzaService.cercaDisponibili({ 
      inizio, 
      fine,
      citta
    });
  }

  /**
   * Crea una nuova casa vacanza
   */
  createProperty(casavacanzaRequestDTO: any): Observable<CasavacanzaResponseDTO> {
    return this.casavacanzaService.crea1({ casavacanzaRequestDTO });
  }
}
