import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Map, AlertTriangle, Bookmark, User, Shield, Bell } from 'lucide-react';
import { getCurrentUser, getNotifications, logout } from '../lib/store';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const notifications = user ? getNotifications(user.id).filter((n) => !n.read) : [];

  function handleLogout() {
    logout();
    navigate('/');
    window.location.reload();
  }

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
      isActive
        ? 'text-teal-700 bg-teal-50'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl">♿</span>
            <span className="font-serif text-lg font-normal text-teal-700 leading-tight">
              Access<span className="text-gray-900">Coimbatore</span>
            </span>
          </NavLink>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-1 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg"
                  >
                    <Shield size={14} />
                    Admin
                  </NavLink>
                )}
                <NavLink to="/profile" className="relative flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  <Bell size={15} />
                  {notifications.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors"
              >
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4 page-fade">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="sticky bottom-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-5xl mx-auto px-2 flex items-center justify-around">
          <NavLink to="/" end className={navCls}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/map" className={navCls}>
            <Map size={20} />
            <span>Map</span>
          </NavLink>
          <NavLink to="/report" className={navCls}>
            <AlertTriangle size={20} />
            <span>Report</span>
          </NavLink>
          <NavLink to="/saved" className={navCls}>
            <Bookmark size={20} />
            <span>Saved</span>
          </NavLink>
          <NavLink to="/profile" className={navCls}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
