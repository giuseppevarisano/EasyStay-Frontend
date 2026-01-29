# Generazione API Client

Questo progetto usa **OpenAPI Generator** per generare automaticamente i client TypeScript Angular dal backend.

## 📁 File generati

I client TypeScript vengono generati in: `src/app/core/api/generated/`

Contenuto:
- `api/` - Servizi API generati dal backend
  - `autenticazione.service.ts` - Login e registrazione
  - `casavacanzaController.service.ts` - Gestione case vacanza
  - `prenotazioni.service.ts` - Gestione prenotazioni
- `model/` - Modelli DTO generati dal backend
- `configuration.ts` - Configurazione del client API

## 🔄 Rigenerare l'API

### 1. Scaricare la specifica OpenAPI dal backend

```bash
# Opzione A: Se il backend è raggiungibile
curl http://localhost:8080/v3/api-docs -o openapi.json

# Opzione B: Se il backend è su un altro host
curl http://backend-url:8080/v3/api-docs -o openapi.json

# Opzione C: Manualmente dal browser
# Vai su http://backend-url:8080/v3/api-docs
# Copia il JSON e incollalo in openapi.json
```

### 2. Generare i client TypeScript

```bash
npm run generate:api
```

Questo comando esegue:
```bash
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-angular \
  -o src/app/core/api/generated \
  -c openapi-config.json
```

## ⚙️ Configurazione

### openapi-config.json

Configurazione del generatore:
- `ngVersion`: "21.1.0" - Versione di Angular
- `providedInRoot`: true - Servizi come singleton
- `useSingleRequestParameter`: true - Parametri come oggetti
- `withInterfaces`: true - Genera interfacce TypeScript

### app.config.ts

Configurazione dell'applicazione per usare l'API generata:
- `BASE_PATH`: URL base dell'API (da environment)
- `Configuration`: Configurazione con JWT bearer token

## 🔧 Servizi wrapper

I servizi wrapper semplificano l'uso dell'API generata:

### AuthService (`core/services/auth.ts`)
Wrapper per `AutenticazioneService`:
- `login()` - Login con email e password
- `register()` - Registrazione nuovo utente
- `logout()` - Logout e pulizia token

### PropertyService (`core/services/property.ts`)
Wrapper per `CasavacanzaControllerService`:
- `getAvailableProperties()` - Cerca case disponibili per date e città
- `createProperty()` - Crea nuova casa vacanza

### BookingService (`core/services/booking.ts`)
Wrapper per `PrenotazioniService`:
- `createBooking()` - Crea prenotazione
- `getUserBookings()` - Recupera prenotazioni utente
- `getUserBookingsPaginated()` - Prenotazioni con paginazione

## 📦 Dipendenze

```json
{
  "devDependencies": {
    "@openapitools/openapi-generator-cli": "^2.28.0"
  }
}
```

## 🚀 Vantaggi

✅ **Type-safe**: Tutti i DTO hanno tipi TypeScript generati  
✅ **Sincronizzato**: L'API frontend è sempre allineata al backend  
✅ **Meno errori**: Nessun errore di digitazione negli endpoint  
✅ **Auto-documentato**: JSDoc generato dai commenti OpenAPI  
✅ **Manutenibilità**: Rigenerabile in qualsiasi momento  

## 🔄 Workflow consigliato

1. **Backend cambia** → Aggiorna OpenAPI spec
2. **Download spec** → `curl http://backend/v3/api-docs -o openapi.json`
3. **Rigenera client** → `npm run generate:api`
4. **Verifica errori** → TypeScript segnalerà incompatibilità
5. **Aggiorna wrapper** → Adatta i servizi wrapper se necessario

## ⚠️ Note importanti

- **NON modificare** i file in `src/app/core/api/generated/` - verranno sovrascritti
- **Usa i wrapper** - Modifica i servizi in `core/services/` per logica custom
- **Committare openapi.json** - Utile per tracciare le modifiche dell'API
- **Rigenerare regolarmente** - Mantieni l'API sincronizzata con il backend
