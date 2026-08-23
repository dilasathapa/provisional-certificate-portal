import { Link } from "react-router-dom";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 lg:grid-cols-2">

          {/* Left panel */}
          <div className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold">
                  PC
                </div>

                <span className="text-lg font-semibold">
                  Certificate Portal
                </span>
              </div>

              <div className="max-w-md">
                <p className="mb-3 text-sm font-medium uppercase tracking-wider text-emerald-400">
                  Provisional Certificate
                </p>

                <h1 className="text-4xl font-bold leading-tight">
                  Apply for your certificate online.
                </h1>

                <p className="mt-5 leading-7 text-slate-300">
                  Submit your personal details, upload the required
                  documents, and receive your acknowledgment digitally.
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-400">
              Secure application portal
            </div>
          </div>

          {/* Right panel */}
          <div className="flex items-center p-6 sm:p-10">
            <div className="w-full max-w-md mx-auto">

              <div className="mb-8">
                <Link
                  to="/"
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 lg:hidden"
                >
                  ← Certificate Portal
                </Link>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthLayout;