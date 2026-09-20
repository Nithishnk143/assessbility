import { useNavigate } from 'react-router-dom';
import type { Place } from '../lib/types';
import { categoryIcon, categoryLabel, formatDate, statusColor, statusLabel } from '../lib/utils';
import { CheckCircle, Clock } from 'lucide-react';

interface Props {
  place: Place;
  compact?: boolean;
}

export default function PlaceCard({ place, compact }: Props) {
  const navigate = useNavigate();
  const col = statusColor(place.status);

  return (
    <button
      onClick={() => navigate(`/place/${place.id}`)}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all p-4 flex gap-3"
      aria-label={`View accessibility details for ${place.name}`}
    >
      {/* Category icon */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl">
        {categoryIcon(place.category)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate leading-tight">{place.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{categoryLabel(place.category)}</p>
          </div>
          {/* Score badge */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span
              className="font-mono text-sm font-bold leading-none"
              style={{ color: col }}
            >
              {place.status === 'unverified' ? '—' : place.accessibilityScore}
            </span>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ color: col, background: col + '18' }}>
              {statusLabel(place.status)}
            </span>
          </div>
        </div>

        {!compact && (
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <CheckCircle size={11} />
              {place.verificationCount} verified
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(place.lastVerified)}
            </span>
            {place.isDemo && (
              <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs">
                DEMO
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
