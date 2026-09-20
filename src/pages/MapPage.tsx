import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { getPlaces } from '../lib/store';
import type { Place, AccessibilityLevel, PlaceCategory } from '../lib/types';
import { statusColor, categoryLabel, categoryIcon, scoreLabel } from '../lib/utils';
import { Filter, X } from 'lucide-react';

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createColorMarker(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:20px;height:20px;border-radius:50% 50% 50% 0;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -22],
  });
}

const STATUS_COLORS: Record<AccessibilityLevel, string> = {
  good: '#16a34a',
  partial: '#ca8a04',
  poor: '#dc2626',
  unverified: '#6b7280',
};

const CATEGORIES: PlaceCategory[] = [
  'hospital', 'clinic', 'restaurant', 'shop', 'college', 'office', 'bus_stop', 'public_place',
];

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 14, { duration: 1 }); }, [lat, lng, map]);
  return null;
}

export default function MapPage() {
  const navigate = useNavigate();
  const allPlaces = getPlaces();
  const [filter, setFilter] = useState<{ category?: PlaceCategory; minScore?: number; status?: AccessibilityLevel }>({});
  const [showFilter, setShowFilter] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);

  const filtered = allPlaces.filter((p) => {
    if (filter.category && p.category !== filter.category) return false;
    if (filter.status && p.status !== filter.status) return false;
    if (filter.minScore !== undefined && p.accessibilityScore < filter.minScore) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-3 -mx-4 -mt-4">
      {/* Filter bar */}
      <div className="px-4 pt-4 bg-white border-b border-gray-100 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-900">Accessibility Map</h1>
          <button
            onClick={() => setShowFilter((s) => !s)}
            className="flex items-center gap-1.5 text-sm text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg font-medium"
          >
            <Filter size={14} /> Filters
            {Object.keys(filter).length > 0 && (
              <span className="w-4 h-4 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
                {Object.keys(filter).length}
              </span>
            )}
          </button>
        </div>

        {showFilter && (
          <div className="space-y-3 py-2">
            {/* Category */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter((f) => ({ ...f, category: f.category === cat ? undefined : cat }))}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                      filter.category === cat
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    {categoryIcon(cat)} {categoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">Accessibility Status</p>
              <div className="flex flex-wrap gap-1.5">
                {(['good', 'partial', 'poor', 'unverified'] as AccessibilityLevel[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter((f) => ({ ...f, status: f.status === s ? undefined : s }))}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors`}
                    style={
                      filter.status === s
                        ? { background: STATUS_COLORS[s], color: 'white', borderColor: STATUS_COLORS[s] }
                        : { background: 'white', color: '#374151', borderColor: '#e5e7eb' }
                    }
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFilter({})}
              className="flex items-center gap-1 text-xs text-red-600 hover:underline"
            >
              <X size={12} /> Clear all filters
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {Object.entries(STATUS_COLORS).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: v }} />
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: 'calc(100vh - 280px)', minHeight: 300 }}>
        <MapContainer
          center={[11.0168, 76.9558]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-none"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyTo lat={flyTo.lat} lng={flyTo.lng} />}
          {filtered.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createColorMarker(STATUS_COLORS[place.status])}
            >
              <Popup>
                <div className="text-sm font-sans" style={{ minWidth: 180 }}>
                  <p className="font-bold text-gray-900 mb-1">{place.name}</p>
                  <p className="text-gray-500 text-xs mb-2">{categoryLabel(place.category)}</p>
                  {place.status !== 'unverified' && (
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-mono font-bold text-lg"
                        style={{ color: scoreLabel(place.accessibilityScore).color }}
                      >
                        {place.accessibilityScore}
                      </span>
                      <span className="text-xs text-gray-500">/ 100</span>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/place/${place.id}`)}
                    className="w-full text-center text-xs font-semibold text-white rounded-lg py-1.5 transition-colors"
                    style={{ background: '#0d9488' }}
                  >
                    View details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Place list below map */}
      <div className="px-4 space-y-1 pb-2">
        <p className="text-xs text-gray-500 font-medium">{filtered.length} places shown</p>
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setFlyTo({ lat: p.lat, lng: p.lng });
              navigate(`/place/${p.id}`);
            }}
            className="w-full text-left flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-colors text-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[p.status] }} />
            <span className="flex-1 font-medium text-gray-800 truncate">{p.name}</span>
            <span className="text-xs text-gray-400">{categoryLabel(p.category)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
