import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser, getReports, getNotifications, markNotificationsRead, getLeaderboard,
} from '../lib/store';
import { formatDate } from '../lib/utils';
import { Trophy, Star, Bell, LogIn } from 'lucide-react';

const BADGE_ICONS: Record<string, string> = {
  'Accessibility Contributor': '🌱',
  'Community Helper': '🤝',
  'Trusted Reporter': '✅',
  'Accessibility Champion': '🏆',
};

const BADGE_THRESHOLDS: { name: string; pts: number }[] = [
  { name: 'Accessibility Contributor', pts: 10 },
  { name: 'Community Helper', pts: 100 },
  { name: 'Trusted Reporter', pts: 250 },
  { name: 'Accessibility Champion', pts: 500 },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const notifications = user ? getNotifications(user.id) : [];
  const userReports = user ? getReports().filter((r) => r.userId === user.id) : [];
  const leaderboard = getLeaderboard();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center">
        <LogIn size={48} className="text-gray-300" />
        <h2 className="font-semibold text-xl text-gray-900">Sign in to view your profile</h2>
        <button
          onClick={() => navigate('/auth')}
          className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700"
        >
          Sign in or Create account
        </button>
      </div>
    );
  }

  if (notifications.some((n) => !n.read)) markNotificationsRead(user.id);

  const nextBadge = BADGE_THRESHOLDS.find((b) => !user.badges.includes(b.name));
  const progress = nextBadge ? Math.min((user.points / nextBadge.pts) * 100, 100) : 100;

  return (
    <div className="space-y-4 pb-6">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-semibold text-xl">{user.name}</h1>
            <p className="text-teal-200 text-sm capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="font-mono font-bold text-2xl">{user.points}</p>
            <p className="text-xs text-teal-200">Points</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="font-mono font-bold text-2xl">{userReports.length}</p>
            <p className="text-xs text-teal-200">Reports</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="font-mono font-bold text-2xl">{user.badges.length}</p>
            <p className="text-xs text-teal-200">Badges</p>
          </div>
        </div>
      </div>

      {/* Next badge progress */}
      {nextBadge && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Next badge</p>
            <p className="text-xs text-gray-500 font-mono">{user.points} / {nextBadge.pts} pts</p>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {BADGE_ICONS[nextBadge.name]} {nextBadge.name}
          </p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Badges */}
      {user.badges.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" /> Badges earned
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((b) => (
              <span
                key={b}
                className="flex items-center gap-1.5 text-sm font-medium bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200"
              >
                {BADGE_ICONS[b] ?? '🎖️'} {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Bell size={16} /> Notifications
          </h2>
          <div className="space-y-2">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3 text-sm py-2 border-b border-gray-100 last:border-0">
                <span className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent reports */}
      {userReports.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Your reports</h2>
          <div className="space-y-2">
            {userReports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/place/${r.placeId}`)}
                className="w-full text-left flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  r.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {r.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.placeName}</p>
                  <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                </div>
                <span className="text-xs text-gray-400">{r.confirmCount} ✓</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star size={16} className="text-amber-500" /> Top contributors
        </h2>
        <div className="space-y-2">
          {leaderboard.map((u, i) => (
            <div
              key={u.id}
              className={`flex items-center gap-3 py-2 rounded-xl px-3 ${
                u.id === user.id ? 'bg-teal-50 border border-teal-200' : ''
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {u.name} {u.id === user.id && <span className="text-teal-600">(you)</span>}
                </p>
                <p className="text-xs text-gray-400">{u.badges[u.badges.length - 1] ?? 'New member'}</p>
              </div>
              <span className="font-mono text-sm font-semibold text-gray-700">{u.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
