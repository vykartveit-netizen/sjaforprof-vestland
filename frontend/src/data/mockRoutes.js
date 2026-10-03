export const defaultRoutes = [
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
    company: 'Tide Buss',
    bus: '4696',
    shift: '102'
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
    company: 'Vy Buss',
    bus: '4712',
    shift: '101'
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
    company: 'Fjord1',
    bus: '4521',
    shift: '109'
  }
];
