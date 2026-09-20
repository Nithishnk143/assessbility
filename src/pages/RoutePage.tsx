import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { getPlaces } from '../lib/store';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function RoutePage() {
  const places = getPlaces();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [calculated, setCalculated] = useState(false);

  const fromPlace = places.find((p) => p.id === from);
  const toPlace = places.find((p) => p.id === to);

  function handleRoute(e: React.FormEvent) {
    e.preventDefault();
    if (from && to) setCalculated(true);
  }

  const routePoints: [number, number][] = fromPlace && toPlace
    ? [[fromPlace.lat, fromPlace.lng], [toPlace.lat, toPlace.lng]]
    : [];

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Navigation size={20} className="text-teal-600" /> Wheelchair-Friendly Route
        </h1>
        <div className="inline-flex items-center gap-1 mt-1 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          BETA
        </div>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Route planning using community-verified accessible places. Full wheelchair routing is under development.
          Do NOT rely solely on this for navigation.
        </p>
      </div>

      <form onSubmit={handleRoute} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="from">
            Start location
          </label>
          <select
            id="from"
            value={from}
            onChange={(e) => { setFrom(e.target.value); setCalculated(false); }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">Select start...</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="to">
            Destination
          </label>
          <select
            id="to"
            value={to}
            onChange={(e) => { setTo(e.target.value); setCalculated(false); }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">Select destination...</option>
            {places.filter((p) => p.id !== from).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!from || !to}
          className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation size={16} /> Show route
        </button>
      </form>

      {calculated && fromPlace && toPlace && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-start gap-2">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <div>
              <strong>Beta feature:</strong> This shows a straight-line path between two verified accessible locations.
              Full turn-by-turn wheelchair routing is not yet available. Always verify route conditions before travelling.
              Do not rely on this alone.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin size={10} /> Start</p>
              <p className="font-medium text-gray-900">{fromPlace.name}</p>
              <p className="text-xs text-gray-500 mt-1">Score: {fromPlace.accessibilityScore}/100</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin size={10} /> End</p>
              <p className="font-medium text-gray-900">{toPlace.name}</p>
              <p className="text-xs text-gray-500 mt-1">Score: {toPlace.accessibilityScore}/100</p>
            </div>
          </div>

          <div style={{ height: 300 }} className="rounded-2xl overflow-hidden border border-gray-200">
            <MapContainer
              center={[
                (fromPlace.lat + toPlace.lat) / 2,
                (fromPlace.lng + toPlace.lng) / 2,
              ]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[fromPlace.lat, fromPlace.lng]} />
              <Marker position={[toPlace.lat, toPlace.lng]} />
              <Polyline
                positions={routePoints}
                pathOptions={{ color: '#0d9488', weight: 4, dashArray: '8, 8' }}
              />
            </MapContainer>
          </div>

          <p className="text-xs text-center text-gray-400">
            Dashed line = direct path. Actual accessible route may differ.
            Full routing coming in a future update.
          </p>
        </div>
      )}

      {/* Info about future feature */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-sm text-teal-900">
        <p className="font-semibold mb-1">🗺️ What's coming</p>
        <ul className="text-teal-800 space-y-1 text-sm list-disc list-inside">
          <li>Step-free turn-by-turn routing via OpenStreetMap wheelchair data</li>
          <li>Avoidance of known problem spots from community reports</li>
          <li>Real-time surface condition warnings</li>
          <li>Integration with verified accessible entrances</li>
        </ul>
      </div>
    </div>
  );
}
