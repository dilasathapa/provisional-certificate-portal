import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className=" sticky top-0 border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 ">
          {/* Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173F5F] text-sm font-bold tracking-wide text-white shadow-sm">
              PC
            </div>

            <div className="hidden sm:block">
              <p className="text-[14px] font-bold tracking-[-0.01em] text-[#172033]">
                Provisional Certificate
              </p>

              <p className="mt-0.5 text-xs font-medium text-[#667085]">
                Application Portal
              </p>
            </div>
          </Link>

          {/* User section */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden text-right sm:block">
              <p className="max-w-60 truncate text-sm font-semibold text-[#172033]">
                {user?.email}
              </p>

              <p className="mt-0.5 text-xs font-medium text-[#667085]">
                Applicant
              </p>
            </div>

            {/* User avatar */}
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#E6F4F1] text-xs font-bold text-[#206B62] sm:flex">
              {user?.email?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="cursor-pointer rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2 text-sm font-semibold text-[#344054] transition duration-200 hover:border-[#B8C0CC] hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/20 focus:ring-offset-1"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;