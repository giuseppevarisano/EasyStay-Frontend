FROM ubuntu:latest
LABEL authors="GiuseppeVarisano"

ENTRYPOINT ["top", "-b"]

# Stage 1: Compilazione (Build)
FROM node:18-alpine AS build
WORKDIR /app

# Copiamo i file dei pacchetti per installare le dipendenze
COPY package*.json ./
RUN npm install

# Copiamo tutto il resto del codice e compiliamo
COPY . .
RUN npm run build --configuration=production

# Stage 2: Server Web (Nginx) per servire l'app
FROM nginx:stable-alpine

# Rimuoviamo i file di default di Nginx
RUN rm -rf /usr/share/nginx/html/*

# COPIA I FILE: Qui devi fare attenzione al nome della cartella in dist/
# Di solito è dist/<nome-progetto>/browser o semplicemente dist/<nome-progetto>
COPY --from=build /app/dist/easy-stay/browser /usr/share/nginx/html

# Copiamo la configurazione custom di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
