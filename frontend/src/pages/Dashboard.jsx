import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import StatusBadge from "../components/StatusBadge";
import api from "../api/axios";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications");

      setApplications(response.data.applications || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    }, []);

  useEffect(() => {
    if (!location.state?.applicationSubmitted) {
        return;
    }

    setToast({
        type: "success",
        message:
        "Application submitted successfully. Your acknowledgment PDF is ready to download.",
    });

    // Clear navigation state so refresh doesn't show the toast again
    navigate(location.pathname, { replace: true });
  }, [location]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(date));
  };

  const downloadAcknowledgment = async (applicationId) => {
    try {
      const response = await api.get(
        `/applications/${applicationId}/acknowledgment`
      );

      window.open(response.data.url, "_blank");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to download acknowledgment."
      );
    }
  };

  return (
    <AppLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Heading */}
            <div className="mb-8">
            <p className="text-sm font-medium text-emerald-600">
                Applicant Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your applications
            </h1>

            <p className="mt-2 text-sm text-slate-500">
                Apply for your provisional certificate and manage
                your submitted applications.
            </p>
            </div>

            {/* New application card */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-slate-900">
            <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

                <div>
                <p className="text-sm font-medium text-emerald-400">
                    Provisional Certificate
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                    Start a new application
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                    Provide your personal details, upload the
                    required documents, review your information,
                    and submit your application.
                </p>
                </div>

                <Link
                to="/applications/new"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                Start application
                <span className="ml-2">→</span>
                </Link>

            </div>
            </div>

            {/* Error */}
            {error && (
            <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{error}</span>

                <button
                onClick={fetchApplications}
                className="font-semibold underline"
                >
                Retry
                </button>
            </div>
            )}

            {/* Applications */}
            <section>
            <div className="mb-4 flex items-center justify-between">
                <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Previous applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    View the applications you have submitted.
                </p>
                </div>
            </div>

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />

                    <p className="text-sm text-slate-500">
                    Loading applications...
                    </p>
                </div>
                </div>
            ) : applications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-lg">📄</span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    No applications yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                    You haven't submitted a provisional certificate
                    application yet.
                </p>

                <Link
                    to="/applications/new"
                    className="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    Start your first application
                </Link>
                </div>
            ) : (
                <>
                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
                    <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Reference
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Applicant
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Submitted
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Status
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Action
                        </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {applications.map((application) => (
                        <tr
                            key={application._id}
                            className="hover:bg-slate-50"
                        >
                            <td className="whitespace-nowrap px-6 py-4">
                            <span className="font-mono text-sm font-medium text-slate-900">
                                {application.referenceNumber}
                            </span>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                            {application.applicant?.fullName}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                            {formatDate(application.submittedAt)}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4">
                            <StatusBadge
                                status={application.status}
                            />
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-right">
                            <button
                                onClick={() =>
                                downloadAcknowledgment(
                                    application._id
                                )
                                }
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                            >
                                Download PDF
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 md:hidden">
                    {applications.map((application) => (
                    <div
                        key={application._id}
                        className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-mono text-sm font-semibold text-slate-900">
                            {application.referenceNumber}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                            {application.applicant?.fullName}
                            </p>
                        </div>

                        <StatusBadge
                            status={application.status}
                        />
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-500">
                            {formatDate(application.submittedAt)}
                        </p>

                        <button
                            onClick={() =>
                            downloadAcknowledgment(
                                application._id
                            )
                            }
                            className="text-sm font-semibold text-emerald-600"
                        >
                            Download PDF
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </>
            )}
            </section>
        </div>

        {/* Success Toast */}
        {toast && (
            <div className="fixed right-4 top-20 z-50 w-[calc(100%-2rem)] max-w-md sm:right-6 sm:w-full">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-lg">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                    Application submitted
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                    {toast.message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setToast(null)}
                    className="shrink-0 text-slate-400 transition hover:text-slate-600 cursor-pointer"
                >
                    ✕
                </button>
                </div>
            </div>
        )}
    </AppLayout>
  );
}

export default Dashboard;