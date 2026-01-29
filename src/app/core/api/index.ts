// Re-export dei servizi API generati
export * from './generated';
export * from './generated/api/api';
export * from './generated/model/models';

// Re-export dei servizi principali
export { AutenticazioneService } from './generated/api/autenticazione.service';
export { CasavacanzaControllerService } from './generated/api/casavacanzaController.service';
export { PrenotazioniService } from './generated/api/prenotazioni.service';
