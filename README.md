# SjåførProf Vestland 🚌🗺️

**Profesjonell buss- og togapp for sjåfører i Vestland**

En komplett PWA som kombinerer Skyss, Entur og Bane Nord sanntidsdata med Google Maps. Designet for å være det beste hjelpemiddelet for bussjåfører i Vestland.

## Features

### 🚌 For Bussjåfører
- ✅ Innlogging og skiftbehandling
- ✅ Valg av rute/linje fra Skyss/Entur
- ✅ Live GPS-posisjon på Google Maps
- ✅ Neste stopp med sanntids-ETA
- ✅ Korrespondanse-oversikt (bytte, tog-forbindelser)
- ✅ Passasjerstatus (ombord, kapasitet, dørhandtering)
- ✅ VTS/Avvik-rapportering
- ✅ Vent / Kjør / Sikkerhetsmeldinger
- ✅ Driftslogg og historikk
- ✅ Offline-funksjonalitet
- ✅ Push-varsler ved avvik

### 👥 For Reisende
- ✅ Søk etter linje eller holdeplass
- ✅ Se neste buss/tog i sanntid
- ✅ Forsinkelse- og avvik-varsler
- ✅ Bytte-informasjon
- ✅ Kart med liveposisjoner
- ✅ Favoritter og historikk
- ✅ Tog-integrasjon (Bane Nord)

### 📱 Teknologi
- ✅ React 18 + Vite frontend
- ✅ Node.js + Express backend
- ✅ Google Maps JavaScript API
- ✅ Entur API (buss + tog)
- ✅ Skyss operatørdata
- ✅ Bane Nord togdata
- ✅ WebSocket for realtime-updates
- ✅ PWA (installérbar app)
- ✅ Capacitor for Android/iOS
- ✅ SQLite/PostgreSQL database

## Oppstart

### Forutsetninger
- Node.js 18+
- npm eller yarn
- Git
- Google Maps API-nøkkel (gratis)
- Entur API-tilgang (gratis, offentlig)

### Installasjon

1. **Klon prosjektet**
```bash
git clone https://github.com/vykartveit-netizen/sjaforprof-vestland.git
cd sjaforprof-vestland
```

2. **Installer alle dependencies**
```bash
npm run install-all
```

3. **Sett opp miljøvariabler**

Opprett `backend/.env`:
```
PORT=3001
NODE_ENV=development
GOOGLE_MAPS_API_KEY=your_google_maps_key
ENTUR_API_KEY=your_entur_key_or_leave_empty
DATABASE_URL=sqlite:./db.sqlite
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

Opprett `frontend/.env`:
```
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

4. **Kjør i utvikling**
```bash
npm run dev
```

Frontend kjører på: `http://localhost:5173`
Backend kjører på: `http://localhost:3001`

## Prosjektstruktur

```
sjaforprof-vestland/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Driver/        # Sjåfør-spesifikk UI
│   │   │   ├── Passenger/     # Passasjer-spesifikk UI
│   │   │   ├── Map/           # Google Maps komponenter
│   │   │   └── Common/        # Delte komponenter
│   │   ├── pages/             # Sider
│   │   ├── services/          # API-kall
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand state
│   │   ├── types/             # TypeScript typer
│   │   └── App.jsx
│   └── package.json
│
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── routes/            # API-routes
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── services/          # Business logic
│   │   │   ├── entur.js       # Entur API integrasjon
│   │   │   ├── skyss.js       # Skyss integrasjon
│   │   │   ├── baneNord.js    # Bane Nord integrasjon
│   │   │   └── gps.js         # GPS-logging
│   │   ├── models/            # Database modeller
│   │   ├── websocket/         # WebSocket handlers
│   │   └── server.js
│   └── package.json
│
├── docs/                        # Dokumentasjon
│   ├── API.md                 # API dokumentasjon
│   ├── SETUP.md              # Detaljert setup
│   └── ARCHITECTURE.md       # Arkitektur-oversikt
│
└── README.md
```

## API-integrasjoner

### Entur (Skyss + buss-data)
```
https://api.entur.org/graphql
- Ruter og linjer
- Sanntidsdata
- Forsinkelser
- Bytte-informasjon
```

### Bane Nord (Tog-data)
```
https://api.ruter.no/v1/
- Togposisjoner
- Stansetider
- Forsinkelser
```

### Google Maps
```
- Kartvisualisering
- Markører for buss/tog
- Geokoding
- Avstandsberegning
```

## Bruk

### For Sjåfør

1. Åpne appen
2. Logg inn med e-post (sjåfør@busselskap.no)
3. Velg busselskap, bussnummer og skift
4. Velg linje fra listen
5. GPS starter automatisk
6. Se neste stopp, korrespondanse og passasjerstatus
7. Trykk "Vent 3 min" eller "Klar / Kjør" ved stopp
8. Rapporter avvik hvis nødvendig

### For Passasjer

1. Åpne appen (ingen innlogging nødvendig)
2. Velg "Reisende-modus"
3. Søk etter linje eller holdeplass
4. Se når neste buss/tog kommer
5. Se live-posisjon på kartet
6. Få varsler ved avvik eller forsinkelse

## Bygg til Android APK

```bash
cd frontend
npm run build

cd ..
npm install @capacitor/core @capacitor/cli

npx cap init
npx cap add android
npx cap sync

npx cap open android
```

## Ordbok (Norsk)

- **Sjåfør** = Driver
- **Reisende** = Passenger
- **Rute** = Route/Line
- **Stopp** = Stop/Station
- **Korrespondanse** = Connection/Transfer
- **Avvik** = Disruption
- **ETA** = Estimated Time of Arrival
- **VTS** = Vehicle Tracking System
- **APC** = Automatic Passenger Counter

## Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## Bidrag

Hvis du vil bidra til prosjektet:
1. Fork repoet
2. Lag en feature-branch
3. Commit endringer
4. Push og lag en Pull Request

## Lisens

MIT License - Se LICENSE fil

## Support

For spørsmål eller problemer, opprett en Issue i repoet.

## Roadmap

- [ ] Push-varsler (PWA)
- [ ] Offline-caching av ruter
- [ ] Dark mode (allerede implementert)
- [ ] Engelsk språk
- [ ] Analytics og statistikk
- [ ] Admin-panel for operatør
- [ ] SMS-integrasjon for avvik
- [ ] Video-call support for VTS
- [ ] Integrering med APC-system
- [ ] Native iOS app

---

**Laget med ❤️ for bussjåfører i Vestland**

*SjåførProf - Verdens beste app for bussjåfører*
