import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPlace, getReports, getPhotos, getCurrentUser, toggleSavePlace, isPlaceSaved,
} from '../lib/store';
import { formatDate, statusColor, statusLabel, categoryLabel, categoryIcon, scoreLabel } from '../lib/utils';
import FeatureRow from '../components/FeatureRow';
import ReportCard from '../components/ReportCard';
import ScoreRing from '../components/ScoreRing';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, AlertTriangle, Camera, Clock, CheckCircle, Star,
} from 'lucide-react';

type Tab = 'overview' | 'reports' | 'photos';

export default function PlacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [tab, setTab] = useState<Tab>('overview');
  const [saved, setSaved] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const place = id ? getPlace(id) : null;
  const reports = id ? getReports(id) : [];
  const photos = id ? getPhotos(id) : [];

  useEffect(() => {
    if (user && id) setSaved(isPlaceSaved(user.id, id));
  }, [user, id]);

  if (!place) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-2xl mb-2">Place not found</p>
        <button onClick={() => navigate(-1)} className="text-teal-600 hover:underline">Go back</button>
      </div>
    );
  }

  const { label: sLabel, color: sColor } = scoreLabel(place.accessibilityScore);
  const conflicting = reports.some((r) => r.denyCount > r.confirmCount * 0.5 && r.confirmCount > 0);

  function handleSave() {
    if (!user) { navigate('/auth'); return; }
    const next = toggleSavePlace(user.id, place!.id);
    setSaved(next);
  }

  const tabCls = (t: Tab) =>
    `px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
      tab === t ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-600"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 text-lg leading-tight truncate">{place.name}</h1>
          <p className="text-sm text-gray-500">{place.address}</p>
        </div>
        <button onClick={handleSave} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600" aria-label={saved ? 'Remove from saved' : 'Save place'}>
          {saved ? <BookmarkCheck size={20} className="text-teal-600" /> : <Bookmark size={20} />}
        </button>
        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-600" aria-label="Share">
          <Share2 size={20} />
        </button>
      </div>

      {/* Demo badge */}
      {place.isDemo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-800 font-medium">
          ⚠️ DEMO DATA — This is not a real accessibility assessment of this location.
        </div>
      )}

      {/* Scores card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{categoryIcon(place.category)}</span>
              <span className="text-sm text-gray-500 font-medium">{categoryLabel(place.category)}</span>
              {place.businessVerified && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Business verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={11} />
              Last verified {formatDate(place.lastVerified)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-around py-2">
          <ScoreRing score={place.accessibilityScore} size={90} label="Accessibility" />
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-[90px] h-[90px] flex items-center justify-center">
              <svg width={90} height={90} viewBox="0 0 90 90">
                <circle cx={45} cy={45} r={36} fill="none" stroke="#e5e7eb" strokeWidth={9} />
                <circle
                  cx={45} cy={45} r={36} fill="none"
                  stroke="#0d9488" strokeWidth={9}
                  strokeDasharray={226}
                  strokeDashoffset={226 - (place.confidenceScore / 100) * 226}
                  strokeLinecap="round"
                  transform="rotate(-90 45 45)"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <text x={45} y={45} textAnchor="middle" dominantBaseline="central"
                  fontSize={19} fontWeight="700" fill="#0d9488" fontFamily="JetBrains Mono, monospace">
                  {place.confidenceScore}%
                </text>
              </svg>
            </div>
            <span className="text-xs text-gray-500 font-medium">Confidence</span>
            <span className="text-xs font-semibold text-teal-700">
              {place.confidenceScore >= 80 ? 'High' : place.confidenceScore >= 60 ? 'Moderate' : 'Low'}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="font-mono font-bold text-gray-900">{place.reportCount}</p>
            <p className="text-xs text-gray-400">Reports</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="font-mono font-bold text-gray-900">{place.verificationCount}</p>
            <p className="text-xs text-gray-400">Verified</p>
          </div>
          <div className="text-center">
            <p className="font-mono font-bold text-gray-900">{place.photoCount}</p>
            <p className="text-xs text-gray-400">Photos</p>
          </div>
        </div>

        {conflicting && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 font-medium">
            ⚠️ Conflicting reports — verification required. Information may be outdated.
          </div>
        )}
      </div>

      {/* Quick info score explanation */}
      <div className="bg-gray-50 rounded-2xl px-4 py-3 text-xs text-gray-500 leading-relaxed">
        <span className="font-semibold text-gray-700">Score: </span>
        <span style={{ color: sColor, fontWeight: 600 }}>{sLabel}</span> — community-reported, not an official certification.
        Confidence shows how recent and consistent the information is. Always check the reports before travelling.
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button className={tabCls('overview')} onClick={() => setTab('overview')}>Overview</button>
        <button className={tabCls('reports')} onClick={() => setTab('reports')}>
          Reports ({reports.length})
        </button>
        <button className={tabCls('photos')} onClick={() => setTab('photos')}>
          Photos ({photos.length})
        </button>
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Accessibility features</h2>
          {place.features.map((f) => <FeatureRow key={f.id} feature={f} />)}
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-gray-100 text-gray-400">
              <p className="mb-2">No reports yet</p>
              <p className="text-sm">Be the first to report an issue</p>
            </div>
          ) : (
            reports.map((r) => (
              <ReportCard key={r.id} report={r} onVerify={() => setReloadKey((k) => k + 1)} />
            ))
          )}
          <button
            onClick={() => navigate(`/report?placeId=${place.id}&placeName=${encodeURIComponent(place.name)}`)}
            className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-700 font-semibold py-3 rounded-xl hover:bg-red-100 transition-colors"
          >
            <AlertTriangle size={16} /> Report an Issue Here
          </button>
        </div>
      )}

      {tab === 'photos' && (
        <div className="space-y-3">
          {photos.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-gray-100 text-gray-400">
              No photos yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="bg-gray-100 aspect-[4/3] relative">
                    <img
                      src={photo.url}
                      alt={photo.caption ?? 'Accessibility photo'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                      {photo.category}
                    </span>
                  </div>
                  <div className="p-2">
                    {photo.caption && <p className="text-xs text-gray-600 leading-snug">{photo.caption}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {photo.userName} · {formatDate(photo.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 text-center">
            Community-uploaded photos. Flag inappropriate content using the report button.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/report?placeId=${place.id}&placeName=${encodeURIComponent(place.name)}`)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors"
        >
          <AlertTriangle size={16} /> Report Issue
        </button>
        <button
          onClick={() => navigate('/map')}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Star size={16} /> Route
        </button>
      </div>
    </div>
  );
}
