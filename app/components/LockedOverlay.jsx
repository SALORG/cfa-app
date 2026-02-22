import { Link } from "react-router";

export default function LockedOverlay({ title = "Premium Content" }) {
  return (
    <div className="p-6 max-w-lg mx-auto mt-20 text-center">
      <div className="bg-surface-secondary rounded-2xl border border-border p-10">
        <span className="text-5xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-text-primary mb-2">{title}</h2>
        <p className="text-text-secondary mb-6">
          This content is available with a premium subscription. Upgrade to
          unlock all modules, formulas, connections, and practice exams.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
