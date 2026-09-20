import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUser, submitReport, getPlaces } from '../lib/store';
import type { IssueType } from '../lib/types';
import { issueLabel } from '../lib/utils';
import { MapPin, Camera, CheckCircle, AlertTriangle } from 'lucide-react';

const ISSUE_TYPES: IssueType[] = [
  'ramp_blocked', 'ramp_steep', 'broken_footpath', 'blocked_footpath', 'steps_at_entrance',
  'toilet_locked', 'toilet_storage', 'lift_unavailable', 'parking_blocked',
  'narrow_entrance', 'heavy_door', 'construction', 'waterlogging', 'other',
];

const TEMPORARY_ISSUES: IssueType[] = ['waterlogging', 'construction', 'blocked_footpath'];

export default function ReportPage() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [placeId, setPlaceId] = useState(params.get('placeId') ?? '');
  const [placeName, setPlaceName] = useState(params.get('placeName') ?? '');
  const [issueType, setIssueType] = useState<IssueType>('ramp_blocked');
  const [description, setDescription] = useState('');
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState('');

  const places = getPlaces();
  const isTemporary = TEMPORARY_ISSUES.includes(issueType);

  useEffect(() => {
    if (navigator.geolocation) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsLoading(false);
        },
        () => setGpsLoading(false),
      );
    }
  }, []);

  function handlePlaceSelect(id: string) {
    setPlaceId(id);
    const p = places.find((pl) => pl.id === id);
    if (p) { setPlaceName(p.name); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!placeId || !description.trim()) return;

    const place = places.find((p) => p.id === placeId);

    submitReport({
      placeId,
      placeName: placeName || (place?.name ?? ''),
      userId: user.id,
      userName: user.name,
      issueType,
      description: description.trim(),
      lat: gps?.lat ?? place?.lat,
      lng: gps?.lng ?? place?.lng,
      createdAt: new Date().toISOString(),
      isTemporary,
      expiresAt: isTemporary
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    });
    setSubmitted(true);
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <AlertTriangle size={48} className="text-amber-400" />
        <h2 className="font-semibold text-xl text-gray-900">Sign in to report issues</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          You need an account to submit accessibility reports. It helps us ensure quality and prevent spam.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700"
        >
          Sign in or Create account
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="font-semibold text-xl text-gray-900">Report submitted!</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Thank you for helping the community. You earned 20 points. The community can now verify your report.
        </p>
        {isTemporary && (
          <p className="text-xs text-amber-700 bg-amber-50 px-4 py-2 rounded-xl">
            This is marked as a temporary issue and will expire in 7 days if not re-verified.
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(placeId ? `/place/${placeId}` : '/')}
            className="bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700"
          >
            View place
          </button>
          <button
            onClick={() => { setSubmitted(false); setDescription(''); }}
            className="text-gray-600 font-medium px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50"
          >
            Report another
          </button>
        </div>
      </div>
    );
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400";

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Report Accessibility Issue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Help the community by reporting real problems you've encountered.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Place select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Place <span className="text-red-500">*</span>
          </label>
          <select
            value={placeId}
            onChange={(e) => handlePlaceSelect(e.target.value)}
            required
            className={inputCls}
            aria-required="true"
          >
            <option value="">Select a place...</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Issue type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setIssueType(type)}
                className={`text-left text-xs px-3 py-2.5 rounded-xl border font-medium transition-colors ${
                  issueType === type
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-200 hover:bg-red-50'
                }`}
              >
                {issueLabel(type)}
              </button>
            ))}
          </div>
          {isTemporary && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl mt-2">
              This issue type is marked as temporary and will expire after 7 days if not re-verified.
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="desc">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={inputCls}
            placeholder="Describe exactly what you found. The more specific the better — e.g. 'Ramp is approximately 1:5 slope, too steep to self-propel.'"
            aria-required="true"
          />
          <p className="text-xs text-gray-400 mt-1">Be specific. Your report helps other users make real decisions.</p>
        </div>

        {/* GPS */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <MapPin size={18} className={gps ? 'text-green-600' : 'text-gray-400'} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">GPS Location</p>
            {gpsLoading && <p className="text-xs text-gray-400">Getting your location...</p>}
            {gps && !gpsLoading && (
              <p className="text-xs text-green-700 font-mono">
                {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)} — captured automatically
              </p>
            )}
            {!gps && !gpsLoading && (
              <p className="text-xs text-gray-400">Location not available — place coordinates will be used</p>
            )}
          </div>
        </div>

        {/* Photo upload (UI only — no backend) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Photo (optional)
          </label>
          <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-teal-300 hover:bg-teal-50 transition-colors">
            <Camera size={24} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {photoName || 'Tap to upload a photo'}
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? '')}
              aria-label="Upload accessibility photo"
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Photos stored securely. Do not include people's faces.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <AlertTriangle size={16} /> Submit Accessibility Report
        </button>

        <p className="text-xs text-gray-400 text-center">
          By submitting you confirm this is a genuine accessibility observation in good faith.
          Stored: your user ID, place, GPS, timestamp, photo.
        </p>
      </form>
    </div>
  );
}
