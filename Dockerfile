# Cambia da node:18-alpine a node:22-alpine
FROM node:22-alpine AS build
WORKDIR /app

# Installiamo le dipendenze
COPY package*.json ./
RUN npm install

# Copiamo il resto dei file
COPY . .

# --- PASSAGGIO CHIAVE ---
# Se la tua build dipende dai file generati da OpenAPI, lanciamo il generatore
# Se non serve o fallisce perché manca il file openapi.json, puoi commentare questa riga
RUN npm run generate:api || echo "Generazione API saltata o non necessaria"

# Eseguiamo la build (usando npx per essere sicuri)
RUN npx ng build
# -----------------------

# Stage 2: Serve
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*

# ATTENZIONE AL PERCORSO:
# Con Angular 18+, la cartella di output è spesso dist/easystay-app/browser
COPY --from=build /app/dist/easystay-app/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
