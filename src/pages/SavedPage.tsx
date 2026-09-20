import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getSavedPlaces } from '../lib/store';
import PlaceCard from '../components/PlaceCard';
import { Bookmark, LogIn } from 'lucide-react';

export default function SavedPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center">
        <LogIn size={48} className="text-gray-300" />
        <h2 className="font-semibold text-xl text-gray-900">Sign in to save places</h2>
        <button
          onClick={() => navigate('/auth')}
          className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700"
        >
          Sign in
        </button>
      </div>
    );
  }

  const saved = getSavedPlaces(user.id);

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <Bookmark size={20} className="text-teal-600" />
        <h1 className="text-xl font-semibold text-gray-900">Saved places</h1>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <Bookmark size={36} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500 mb-1">No saved places yet</p>
          <p className="text-sm">Bookmark places from their profile to track them here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {saved.map((p) => <PlaceCard key={p.id} place={p} />)}
        </div>
      )}
    </div>
  );
}
