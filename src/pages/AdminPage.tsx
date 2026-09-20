import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser, getAdminStats, getUsers, getReports, getPlaces, resolveReport,
} from '../lib/store';
import { formatDate, issueLabel, categoryLabel } from '../lib/utils';
import { Shield, Users, MapPin, AlertTriangle, CheckCircle, BarChart2, RefreshCw } from 'lucide-react';

type AdminTab = 'overview' | 'reports' | 'places' | 'users';

export default function AdminPage() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [reports, setReports] = useState(getReports());

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center">
        <Shield size={48} className="text-gray-300" />
        <h2 className="font-semibold text-xl text-gray-900">Admin access required</h2>
        <p className="text-gray-500 text-sm">Sign in with an admin account to access this dashboard.</p>
        <button onClick={() => navigate('/auth')} className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl">
          Sign in
        </button>
      </div>
    );
  }

  const stats = getAdminStats();
  const users = getUsers();
  const places = getPlaces();

  function handleResolve(reportId: string) {
    resolveReport(reportId);
    setReports(getReports());
  }

  const tabCls = (t: AdminTab) =>
    `px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
      tab === t ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
        <Shield size={20} className="text-amber-700" />
        <div>
          <p className="font-semibold text-amber-900">Admin Dashboard</p>
          <p className="text-xs text-amber-700">Signed in as {user.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button className={tabCls('overview')} onClick={() => setTab('overview')}>Overview</button>
        <button className={tabCls('reports')} onClick={() => setTab('reports')}>Reports ({reports.length})</button>
        <button className={tabCls('places')} onClick={() => setTab('places')}>Places ({places.length})</button>
        <button className={tabCls('users')} onClick={() => setTab('users')}>Users ({users.length})</button>
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: MapPin, label: 'Total places', value: stats.totalPlaces, color: 'teal' },
              { icon: AlertTriangle, label: 'Open issues', value: stats.openIssues, color: 'red' },
              { icon: CheckCircle, label: 'Verified reports', value: stats.verifiedReports, color: 'green' },
              { icon: Users, label: 'Active contributors', value: stats.activeContributors, color: 'blue' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <s.icon size={18} className={`text-${s.color}-500 mb-2`} />
                <p className="font-mono font-bold text-2xl text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart2 size={16} /> Recent activity
            </h2>
            <div className="space-y-2">
              {stats.recentUpdates.map((r) => (
                <div key={r.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-red-500 shrink-0"><AlertTriangle size={13} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 truncate">{r.placeName}</p>
                    <p className="text-xs text-gray-400">{issueLabel(r.issueType)} · {formatDate(r.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    r.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports */}
      {tab === 'reports' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{reports.filter((r) => r.status === 'open').length} open</p>
            <button
              onClick={() => setReports(getReports())}
              className="flex items-center gap-1 text-xs text-teal-600"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-700 bg-red-50 inline-block px-2 py-0.5 rounded mb-1">
                    {issueLabel(r.issueType)}
                  </p>
                  <p className="font-medium text-gray-900 text-sm">{r.placeName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {r.userName} · {formatDate(r.createdAt)} · {r.confirmCount} confirmed, {r.denyCount} denied
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-center ${
                    r.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>{r.status}</span>
                  {r.status === 'open' && (
                    <button
                      onClick={() => handleResolve(r.id)}
                      className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Places */}
      {tab === 'places' && (
        <div className="space-y-2">
          {places.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/place/${p.id}`)}
              className="w-full text-left bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:border-teal-200 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{categoryLabel(p.category)} · Score: {p.accessibilityScore} · {p.reportCount} reports</p>
              </div>
              {p.isDemo && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">DEMO</span>}
            </button>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email} · {u.role}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-sm font-semibold text-gray-700">{u.points} pts</p>
                <p className="text-xs text-gray-400">{u.badges.length} badges</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
