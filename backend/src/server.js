import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
    }
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
    }
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
    }
  }
];

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'sjaforprof-backend', timestamp: Date.now() });
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

app.post('/api/driver/login', (req, res) => {
  const { email, company, bus, shift } = req.body || {};
  if (!email || !company || !bus || !shift) {
    return res.status(400).json({ ok: false, message: 'Fyll inn alle felter' });
  }

  return res.json({ ok: true, user: { email, company, bus, shift } });
});

app.post('/api/route/avvik', (req, res) => {
  const { routeId, message } = req.body || {};
  if (!routeId || !message) {
    return res.status(400).json({ ok: false, message: 'routeId og message er påkrevd' });
  }

  return res.json({ ok: true, routeId, message, timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`SjåførProf backend kjører på http://localhost:${PORT}`);
});
