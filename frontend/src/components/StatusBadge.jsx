function StatusBadge({ status }) {
  const styles = {
    Submitted:
      "bg-amber-50 text-amber-700 ring-amber-600/20",

    Completed:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] ||
        "bg-slate-50 text-slate-600 ring-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;