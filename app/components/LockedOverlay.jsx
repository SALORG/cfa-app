import { Link } from "react-router";

export default function LockedOverlay({ title = "Premium Content", isGuest, onSignup }) {
  return (
    <div className="p-6 max-w-lg mx-auto mt-20 text-center">
      <div className="bg-surface-secondary rounded-2xl border border-border p-10">
        <span className="text-5xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-text-primary mb-2">{title}</h2>
        <p className="text-text-secondary mb-6">
          {isGuest
            ? "Sign up for free to unlock study modules, track your progress, and access quizzes."
            : "This content is available with a premium subscription. Upgrade to unlock all modules, formulas, connections, and practice exams."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isGuest ? (
            <button
              onClick={onSignup}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Sign Up Free
            </button>
          ) : (
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-colors"
            >
              Upgrade to Premium
            </Link>
          )}
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-tertiary text-text-secondary rounded-xl font-medium hover:bg-surface transition-colors border border-border"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
