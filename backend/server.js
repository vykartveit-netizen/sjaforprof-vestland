const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const routes = [
  {
    id: '83',
    name: 'Linje 83',
    nextStop: 'Bergen Sentral',
    eta: '4 min',
    connection: {
      title: 'Korrespondanse mot sentrum',
      booked: 18,
      boarded: 12,
      systemStatus: 'Synkronisert'
    },
    routeColor: '#f59e0b',
    company: 'Tide Buss'
  },
  {
    id: '3E',
    name: 'Linje 3E',
    nextStop: 'Kronstad',
    eta: '7 min',
    connection: {
      title: 'Bypass / byterminal',
      booked: 22,
      boarded: 16,
      systemStatus: 'Synkronisert'
    },
    routeColor: '#34d399',
    company: 'Vy Buss'
  },
  {
    id: '1',
    name: 'Linje 1',
    nextStop: 'Nordnes',
    eta: '2 min',
    connection: {
      title: 'Bybane / sentrum',
      booked: 14,
      boarded: 9,
      systemStatus: 'Venter'
    },
    routeColor: '#60a5fa',
    company: 'Fjord1'
  }
];

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'sjaforprof-backend', timestamp: Date.now() });
});

app.post('/api/driver/login', (req, res) => {
  const { email, company, bus, shift } = req.body || {};

  if (!email || !company || !bus || !shift) {
    return res.status(400).json({ ok: false, message: 'Alle felter må fylles ut.' });
  }

  return res.json({ ok: true, user: { email, company, bus, shift } });
});

app.get('/api/routes', (req, res) => {
  res.json(routes);
});

app.get('/api/route/:id', (req, res) => {
  const route = routes.find((item) => item.id.toLowerCase() === String(req.params.id).toLowerCase());
  if (!route) {
    return res.status(404).json({ message: 'Rute ikke funnet' });
  }

  return res.json(route);
});

app.post('/api/route/avvik', (req, res) => {
  const { routeId, message } = req.body || {};

  if (!routeId || !message) {
    return res.status(400).json({ ok: false, message: 'routeId og message er påkrevd' });
  }

  return res.json({ ok: true, routeId, message, timestamp: Date.now() });
});

app.get('/api/passenger/nearby', (req, res) => {
  res.json([
    { stop: 'Bergen Sentral', eta: '4 min' },
    { stop: 'Kronstad', eta: '7 min' },
    { stop: 'Nordnes', eta: '11 min' },
    { stop: 'Byparken', eta: '14 min' }
  ]);
});

app.listen(PORT, () => {
  console.log(`SjåførProf backend kjører på http://localhost:${PORT}`);
});
