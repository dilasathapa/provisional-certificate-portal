import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              PC
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                Provisional Certificate
              </p>

              <p className="text-xs text-slate-500">
                Application Portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">
                {user?.email}
              </p>

              <p className="text-xs text-slate-500">
                Applicant
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;