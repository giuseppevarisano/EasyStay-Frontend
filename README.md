# EasyStay-Frontend

Interfaccia in Angular per il sistema di booking EasyStay. Gestione asincrona delle prenotazioni tramite API REST Spring Boot, architettura Stateless e monitoraggio real-time integrato. Progetto interamente containerizzato con Docker.

## Tecnologie Utilizzate

- **Angular 21** - Framework frontend
- **TypeScript** - Linguaggio di programmazione
- **SCSS** - Preprocessore CSS
- **JWT** - Autenticazione stateless
- **RxJS** - Programmazione reattiva

## Prerequisiti

- Node.js (v24.x o superiore)
- npm (v11.x o superiore)
- Angular CLI (v21.x)

## Installazione

```bash
# Clona il repository
git clone https://github.com/giuseppevarisano/EasyStay-Frontend.git
cd EasyStay-Frontend

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
ng serve
```

L'applicazione sarà disponibile su `http://localhost:4200`

## Struttura del Progetto

```
src/
├── app/
│   ├── auth/                    # Modulo di autenticazione
│   │   ├── login/              # Componente login
│   │   ├── register/           # Componente registrazione
│   │   ├── auth-module.ts
│   │   └── auth-routing-module.ts
│   ├── core/                    # Modulo core (singleton)
│   │   ├── guards/             # Route guards
│   │   │   └── auth-guard.ts   # Guard per proteggere le route
│   │   ├── interceptors/       # HTTP interceptors
│   │   │   └── jwt-interceptor.ts  # Aggiunge JWT alle richieste
│   │   ├── models/             # Modelli dati
│   │   │   └── user.model.ts   # Interfacce User e Auth
│   │   └── services/           # Servizi applicativi
│   │       ├── auth.ts         # Servizio autenticazione
│   │       └── api.ts          # Servizio API wrapper
│   ├── shared/                  # Modulo condiviso
│   ├── app.config.ts           # Configurazione applicazione
│   ├── app.routes.ts           # Definizione route
│   └── app.ts                  # Componente root
├── environments/
│   ├── environment.ts          # Configurazione production
│   └── environment.development.ts  # Configurazione development
└── styles.scss                 # Stili globali
```

## Sistema di Autenticazione

### Componenti Principali

#### 1. AuthService (\`src/app/core/services/auth.ts\`)
Gestisce tutte le operazioni di autenticazione:
- Login utente
- Registrazione nuovo utente
- Logout
- Gestione token JWT
- Observable dello stato utente corrente

#### 2. JWT Interceptor (\`src/app/core/interceptors/jwt-interceptor.ts\`)
Intercetta automaticamente tutte le richieste HTTP e:
- Aggiunge il token JWT nell'header \`Authorization\`
- Gestisce errori 401 (Unauthorized) effettuando logout automatico

#### 3. Auth Guard (\`src/app/core/guards/auth-guard.ts\`)
Protegge le route che richiedono autenticazione:
- Controlla se l'utente è autenticato
- Reindirizza al login se non autenticato
- Salva l'URL richiesto per il redirect post-login

### Utilizzo

#### Proteggere una Route
```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
}
```

#### Login
```typescript
this.authService.login({ username, password }).subscribe({
  next: (response) => {
    // Login effettuato, token salvato automaticamente
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    // Gestione errore
  }
});
```

## API Service

Il servizio API (\`src/app/core/services/api.ts\`) fornisce metodi wrapper per le chiamate HTTP.

## Configurazione Environment

### Development (\`environment.development.ts\`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

##  Build e Deploy

### Build Development
```bash
ng serve
```

### Build Production
```bash
ng build
```

I file ottimizzati saranno generati nella cartella \`dist/\`

##  Scripts Disponibili

```bash
ng serve          # Avvia dev server
ng build          # Build production
ng test           # Esegue unit tests
```

## Best Practices Implementate

1. **Standalone Components** - Utilizzo di componenti standalone di Angular 21
2. **Functional Guards** - Guards funzionali invece di class-based
3. **Functional Interceptors** - Interceptors funzionali moderni
4. **Dependency Injection** - Utilizzo di \`inject()\` function
5. **Reactive Forms** - Form reattivi con validazione
6. **RxJS Operators** - Gestione asincrona con Observable
7. **Type Safety** - Tipizzazione forte con TypeScript

##  Integrazione Backend

Il frontend si integra con il backend EasyStay-Backend attraverso:
- Endpoint \`/api/auth/login\` - Autenticazione
- Endpoint \`/api/auth/register\` - Registrazione
- Token JWT per autenticazione stateless
- Interceptor per gestione automatica token

## Autore

Giuseppe Varisano - [GitHub](https://github.com/giuseppevarisano)
