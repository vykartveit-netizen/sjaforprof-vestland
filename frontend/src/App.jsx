import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const formatTime = (date = new Date()) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const defaultRoute = {
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
  bus: '4696',
  shift: '102',
  routeColor: '#f59e0b'
};

const loadGoogleMaps = async () => {
  if (window.google?.maps) return;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'YOUR_API_KEY';
  if (apiKey === 'YOUR_API_KEY') return;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  await new Promise((resolve) => {
    script.onload = resolve;
  });
};

function App() {
  const [route, setRoute] = useState(defaultRoute);
  const [role, setRole] = useState('driver');
  const [driverData, setDriverData] = useState({
    email: 'ola@tidebuss.no',
    company: 'Tide Buss',
    bus: '4696',
    shift: '102'
  });
  const [toast, setToast] = useState('');
  const [clock, setClock] = useState(formatTime());
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setClock(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMaps();
        if (!window.google?.maps || !mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 60.3913, lng: 5.3221 },
          zoom: 13,
          disableDefaultUI: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020817' }] }
          ]
        });

        markerRef.current = new window.google.maps.Marker({
          map,
          position: { lat: 60.3913, lng: 5.3221 },
          title: 'Buss',
          label: { text: 'B', fontSize: '12px', fontWeight: '700', color: '#111827' }
        });
      } catch (error) {
        console.error('Map load failed', error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (markerRef.current && window.google?.maps) {
          markerRef.current.setPosition(pos);
          const map = markerRef.current.getMap();
          if (map) map.setCenter(pos);
        }
      },
      () => setToast('GPS-feil: sjekk tillatelser'),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(`${API_URL}/api/route/83`);
        const data = await response.json();
        if (data) setRoute(data);
      } catch {
        setRoute(defaultRoute);
      }
    };

    fetchRoute();
  }, []);

  const passengerStops = useMemo(() => ['Bergen Sentral', 'Kronstad', 'Nordnes', 'Byparken', 'Fana'], []);

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
                <p>Sanntid for buss og tog i hele Norge.</p>
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
                <h2>{route.name}</h2>
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
            <div ref={mapRef} className="map" />
            <div className="map-badge">🟢 GPS aktiv</div>
          </div>

          <main className="content">
            {role === 'driver' ? (
              <>
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <small>NESTE STOPP</small>
                      <h3>{route.nextStop}</h3>
                    </div>
                    <span className="eta-badge">{route.eta}</span>
                  </div>
                </section>

                <section className="panel connection-panel">
                  <div className="panel-header">
                    <div>
                      <small>KORRESPONDANSE</small>
                      <h4>{route.connection.title}</h4>
                    </div>
                    <span className="state success">{route.connection.systemStatus}</span>
                  </div>

                  <div className="stats">
                    <div>
                      <span>Reisende med overgang</span>
                      <strong>{route.connection.booked}</strong>
                    </div>
                    <div>
                      <span>Inn-/dørteller</span>
                      <strong>{route.connection.boarded} / {route.connection.booked}</strong>
                    </div>
                  </div>

                  <div className="progress">
                    <div className="progress-fill" style={{ width: `${(route.connection.boarded / route.connection.booked) * 100}%` }} />
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
                    {[route].map((item) => (
                      <button key={item.id} className="route-item active" onClick={() => setRole('driver')}>
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.nextStop}</small>
                        </div>
                        <span>{item.eta}</span>
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
                    {passengerStops.map((stop) => (
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
