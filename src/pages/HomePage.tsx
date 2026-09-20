import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, AlertTriangle, ChevronRight } from 'lucide-react';
import { searchPlaces, getPlaces } from '../lib/store';
import PlaceCard from '../components/PlaceCard';
import type { PlaceCategory } from '../lib/types';
import { categoryIcon, categoryLabel } from '../lib/utils';

const CATEGORIES: PlaceCategory[] = [
  'hospital', 'clinic', 'restaurant', 'shop', 'college', 'office', 'bus_stop', 'public_place',
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchPlaces>>([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const nearby = getPlaces().slice(0, 4);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setResults(searchPlaces(query));
    setSearched(true);
  }

  function handleCategory(cat: PlaceCategory) {
    setResults(searchPlaces('', cat));
    setSearched(true);
    setQuery(categoryLabel(cat));
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-3xl px-6 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm mb-4">
            <MapPin size={13} />
            <span>Coimbatore</span>
          </div>
          <h1 className="font-serif text-3xl leading-tight mb-2">
            Find places you can<br />access with confidence.
          </h1>
          <p className="text-teal-100 text-sm leading-relaxed mb-6 max-w-md">
            Discover real accessibility conditions before you travel — community-reported, recently verified.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clinics, shops, colleges, restaurants..."
              className="w-full bg-white text-gray-900 pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Search places"
            />
          </form>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 bg-white text-teal-700 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-teal-50 transition-colors"
            >
              <MapPin size={15} /> Explore Map
            </button>
            <button
              onClick={() => navigate('/report')}
              className="flex items-center gap-2 bg-teal-600 border border-white/30 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-teal-500 transition-colors"
            >
              <AlertTriangle size={15} /> Report Issue
            </button>
          </div>
        </div>
      </section>

      {/* Quick categories */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Browse by category
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className="flex flex-col items-center gap-1.5 bg-white border border-gray-100 rounded-xl py-3 px-1 hover:border-teal-300 hover:bg-teal-50 transition-colors shadow-sm"
              aria-label={`Browse ${categoryLabel(cat)}`}
            >
              <span className="text-2xl">{categoryIcon(cat)}</span>
              <span className="text-xs text-gray-600 font-medium text-center leading-tight">
                {categoryLabel(cat)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Search results */}
      {searched && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </h2>
            <button
              onClick={() => { setSearched(false); setQuery(''); }}
              className="text-xs text-teal-600 hover:underline"
            >
              Clear
            </button>
          </div>
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="text-lg mb-1">No places found</p>
              <p className="text-sm">Try a different search or browse the map</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((p) => <PlaceCard key={p.id} place={p} />)}
            </div>
          )}
        </section>
      )}

      {/* Nearby accessible places */}
      {!searched && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Nearby places</h2>
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-1 text-sm text-teal-600 hover:underline"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {nearby.map((p) => <PlaceCard key={p.id} place={p} />)}
          </div>
        </section>
      )}

      {/* Trust banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
        <p className="font-semibold mb-1">ℹ️ About our scores</p>
        <p className="leading-relaxed text-amber-800">
          Accessibility scores are community-generated and not official certifications.
          Always check the "last verified" date and read actual reports before you travel.
        </p>
      </div>
    </div>
  );
}
