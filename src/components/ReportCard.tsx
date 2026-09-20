import { useState } from 'react';
import type { Report } from '../lib/types';
import { issueLabel, formatDate } from '../lib/utils';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { getCurrentUser, verifyReport, getUserVerification } from '../lib/store';

interface Props {
  report: Report;
  onVerify?: () => void;
}

export default function ReportCard({ report, onVerify }: Props) {
  const user = getCurrentUser();
  const [verdict, setVerdict] = useState<'confirmed' | 'denied' | null>(
    user ? getUserVerification(report.id, user.id) : null,
  );
  const [confirms, setConfirms] = useState(report.confirmCount);
  const [denies, setDenies] = useState(report.denyCount);

  function handleVerify(v: 'confirmed' | 'denied') {
    if (!user || verdict) return;
    verifyReport(report.id, user.id, v);
    setVerdict(v);
    if (v === 'confirmed') setConfirms((c) => c + 1);
    else setDenies((d) => d + 1);
    onVerify?.();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="inline-block text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded mb-1">
            {issueLabel(report.issueType)}
          </span>
          {report.isTemporary && (
            <span className="ml-2 inline-block text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mb-1">
              Temporary
            </span>
          )}
          <p className="text-sm text-gray-700 mt-1 leading-snug">{report.description}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock size={10} />
            Reported by {report.userName} · {formatDate(report.createdAt)}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
            report.status === 'resolved'
              ? 'bg-green-50 text-green-700'
              : report.status === 'disputed'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {report.status === 'open' ? 'Open' : report.status === 'resolved' ? 'Resolved' : 'Disputed'}
        </span>
      </div>

      {/* Community verification */}
      {report.status === 'open' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 font-medium">
            Is this still accurate?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVerify('confirmed')}
              disabled={!!verdict || !user}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                verdict === 'confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-40'
              }`}
              title={!user ? 'Sign in to verify' : undefined}
            >
              <ThumbsUp size={13} /> Yes · {confirms}
            </button>
            <button
              onClick={() => handleVerify('denied')}
              disabled={!!verdict || !user}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                verdict === 'denied'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40'
              }`}
              title={!user ? 'Sign in to verify' : undefined}
            >
              <ThumbsDown size={13} /> No longer · {denies}
            </button>
            {!user && (
              <span className="text-xs text-gray-400">Sign in to verify</span>
            )}
            {verdict && (
              <span className="text-xs text-gray-500 ml-auto">Thanks for verifying!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
