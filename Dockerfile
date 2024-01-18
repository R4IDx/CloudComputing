# Basisimage
FROM node:16

# Arbeitsverzeichnis erstellen
WORKDIR /usr/src/app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install
# Quellcode kopieren
COPY .. .

# Port freigeben
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 27017

# Umgebungsvariablen kopieren
COPY .env .

# Container starten
CMD ["node", "src/index.js"]

