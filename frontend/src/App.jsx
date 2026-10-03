import React from 'react';
import { useState, useEffect } from 'react';
import { defaultRoutes } from './data/mockRoutes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function formatClock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function App() {
  const [role, setRole] = useState('driver');
  const [routes, setRoutes] = useState(defaultRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState('83');
  const [driverData, setDriverData] = useState({
    email: 'ola@tidebuss.no',
    company: 'Tide Buss',
    bus: '4696',
    shift: '102'
  });
  const [clock, setClock] = useState(formatClock());
  const [toast, setToast] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setClock(formatClock()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/routes`);
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setRoutes(data);
          setSelectedRouteId(data[0].id);
        }
      } catch {
        setRoutes(defaultRoutes);
      }
    };

    fetchRoutes();
  }, []);

  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || defaultRoutes[0];

  const handleDriverLogin = async () => {
    if (!driverData.email.includes('@') || !driverData.bus || !driverData.shift) {
      setToast('Fyll inn alle feltene');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/driver/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverData)
      });

      if (response.ok) {
        setRole('driver');
        setToast('Innlogging vellykket');
      }
    } catch {
      setRole('driver');
      setToast('Innlogging vellykket');
    }
  };

  const handleRouteSelect = async (routeId) => {
    setSelectedRouteId(routeId);
    try {
      const response = await fetch(`${API_URL}/api/route/${routeId}`);
      if (response.ok) {
        const route = await response.json();
        if (route) {
          setRoutes((prev) => {
            const next = prev.map((item) => (item.id === route.id ? route : item));
            return next.length ? next : defaultRoutes;
          });
        }
      }
    } catch {
      // fallback silent
    }
  };

  const handleAction = (type) => {
    setToast(type === 'wait' ? '⏱ Venteregistert' : '🚪 Klar / kjør sendt');
  };

  return (
    <div className="app-shell">
      {toast && <div className="toast">{toast}</div>}

      {role === 'start' ? (
        <div className="start-screen">
          <div className="card">
            <div className="logo-header">
              <span>🚏</span>
              <h1>SjåførProf</h1>
              <p>Google Maps & GPS</p>
            </div>

            <div className="mode-switch">
              <button className={role === 'driver' ? 'selected' : ''} onClick={() => setRole('driver')}>Sjåfør</button>
              <button className={role === 'passenger' ? 'selected' : ''} onClick={() => setRole('passenger')}>Reisende</button>
            </div>

            {role === 'driver' ? (
              <>
                <label>
                  <span>E-postadresse</span>
                  <input value={driverData.email} onChange={(e) => setDriverData({ ...driverData, email: e.target.value })} />
                </label>

                <label>
                  <span>Busselskap</span>
                  <select value={driverData.company} onChange={(e) => setDriverData({ ...driverData, company: e.target.value })}>
                    <option>Tide Buss</option>
                    <option>Vy Buss</option>
                    <option>Fjord1</option>
                    <option>Unibuss</option>
                  </select>
                </label>

                <div className="two-col">
                  <label>
                    <span>Bussnr.</span>
                    <input value={driverData.bus} onChange={(e) => setDriverData({ ...driverData, bus: e.target.value })} />
                  </label>
                  <label>
                    <span>Skift</span>
                    <input value={driverData.shift} onChange={(e) => setDriverData({ ...driverData, shift: e.target.value })} />
                  </label>
                </div>

                <button className="primary-button" onClick={handleDriverLogin}>Start app</button>
              </>
            ) : (
              <div className="passenger-landing">
                <p>Få sanntid for buss og tog i hele Norge.</p>
                <button className="primary-button" onClick={() => setRole('passenger')}>Fortsett som reisende</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="main-app">
          <header className="topbar">
            <div>
              <div className="title-row">
                <h2>{selectedRoute.name}</h2>
                <span className="clock">{clock}</span>
              </div>
              <p className="meta">{driverData.company} • Buss {driverData.bus} • Skift {driverData.shift}</p>
            </div>
            <div className="header-actions">
              <button className="small-button warning">⚠️ Avvik</button>
              <button className="small-button" onClick={() => setRole('start')}>⚙️ Rute</button>
            </div>
          </header>

          <div className="map-wrap">
            <div className="map-placeholder">Google Maps kommer her</div>
            <div className="map-badge">🟢 GPS aktiv</div>
          </div>

          <main className="content">
            {role === 'driver' ? (
              <>
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <small>NESTE STOPP</small>
                      <h3>{selectedRoute.nextStop}</h3>
                    </div>
                    <span className="eta-badge">{selectedRoute.eta}</span>
                  </div>
                </section>

                <section className="panel connection-panel">
                  <div className="panel-header">
                    <div>
                      <small>KORRESPONDANSE</small>
                      <h4>{selectedRoute.connection.title}</h4>
                    </div>
                    <span className="state success">{selectedRoute.connection.systemStatus}</span>
                  </div>

                  <div className="stats">
                    <div>
                      <span>Reisende med overgang</span>
                      <strong>{selectedRoute.connection.booked}</strong>
                    </div>
                    <div>
                      <span>Inn-/dørteller</span>
                      <strong>{selectedRoute.connection.boarded} / {selectedRoute.connection.booked}</strong>
                    </div>
                  </div>

                  <div className="progress">
                    <div className="progress-fill" style={{ width: `${(selectedRoute.connection.boarded / selectedRoute.connection.booked) * 100}%` }} />
                  </div>
                </section>

                <section className="tip-box">
                  <span>💡</span>
                  <p>Ruten er aktiv. Hold GPS oppdatert og følg neste stopp.</p>
                </section>

                <section className="route-row">
                  <span>Neste stopp etter knutepunktet:</span>
                  <strong>Kronstad</strong>
                </section>

                <div className="action-grid">
                  <button className="action-button warning" onClick={() => handleAction('wait')}>
                    <span>⏱ Vent 3 min</span>
                    <small>Varsler reisende</small>
                  </button>
                  <button className="action-button success" onClick={() => handleAction('drive')}>
                    <span>🚪 Klar / Kjør</span>
                    <small>Fullført / går</small>
                  </button>
                </div>
              </>
            ) : (
              <>
                <section className="panel passenger-panel">
                  <div className="panel-header">
                    <div>
                      <small>REISENDE</small>
                      <h3>Sanntidsstatus</h3>
                    </div>
                    <span className="eta-badge">Live</span>
                  </div>

                  <div className="route-list">
                    {routes.map((route) => (
                      <button key={route.id} className={`route-item ${selectedRouteId === route.id ? 'active' : ''}`} onClick={() => handleRouteSelect(route.id)}>
                        <div>
                          <strong>{route.name}</strong>
                          <small>{route.nextStop}</small>
                        </div>
                        <span>{route.eta}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <small>HOLDEPLASSER</small>
                      <h3>Se nærmeste</h3>
                    </div>
                    <span className="eta-badge">5 min</span>
                  </div>

                  <ul className="stop-list">
                    {['Bergen Sentral', 'Kronstad', 'Nordnes', 'Byparken', 'Fana'].map((stop) => (
                      <li key={stop}>{stop}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
