#!/bin/bash

# Script per scaricare OpenAPI spec dal backend
# Modifica BACKEND_URL con l'URL corretto del tuo backend

BACKEND_URL="http://localhost:8080"  # Cambia questo!
# Oppure prova con il nome del container: http://easystay-backend:8080
# O con l'IP del backend se è su una rete diversa

echo "Tentativo di download da ${BACKEND_URL}/v3/api-docs..."

curl -f "${BACKEND_URL}/v3/api-docs" -o openapi.json

if [ $? -eq 0 ]; then
    echo "✓ OpenAPI spec scaricato con successo in openapi.json"
    echo "Ora puoi generare l'API client con: npm run generate-api:file"
else
    echo "✗ Errore nel download. Verifica che il backend sia raggiungibile."
    echo ""
    echo "Prova questi URL alternativi:"
    echo "  - http://host.docker.internal:8080/v3/api-docs (se il backend è sull'host)"
    echo "  - http://easystay-backend:8080/v3/api-docs (se è un container Docker)"
    echo "  - Oppure fornisci l'URL pubblico del backend"
fi
