// Erforderliche Module importieren
const express = require("express"); // Express-Framework
const app = express(); // Express-App erstellen
const path = require("path"); // Modul zur Pfadverarbeitung
const routes = require("./routes"); // Routen importieren
const methodOverride = require('method-override'); // Middleware für PUT- und DELETE-Anfragen
const session = require("express-session"); // Session-Verwaltung
const hbs = require("hbs"); // Handlebars als Templating-Engine

// Middleware-Konfiguration

app.use(express.json()); // Middleware zur Verarbeitung von JSON-Daten
app.use(express.urlencoded({ extended: true })); // Middleware zur Verarbeitung von URL-codierten Formulardaten
app.use(express.static('./public')); // Middleware zur Bereitstellung von statischen Dateien wie CSS und JavaScript
app.use(methodOverride('_method')); // Middleware zur Unterstützung von PUT- und DELETE-Anfragen in HTML-Formularen


// Einstellung der Templating-Engine auf Handlebars
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, '../templates')); // Festlegung des Verzeichnisses für die Vorlagen

// Konfiguration für Sessions
app.use(session({
  secret: 'mySecretKey', // Geheimer Schlüssel für die Session-Verschlüsselung
  resave: false, // Kein erneutes Speichern der Session, wenn keine Änderungen vorliegen
  saveUninitialized: false // Kein Speichern der Session, wenn sie unverändert ist
}));

// Verwendung der Routen
app.use("/", routes);

// Server starten auf Port 3000
app.listen(3000, () => console.log("Server is running on port 3000...")); // Starten des Servers auf Port 3000

