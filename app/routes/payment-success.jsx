import { useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";

export default function PaymentSuccess() {
  const { user, isPremium, refreshSubscription } = useAuth();

  // Poll for subscription activation
  useEffect(() => {
    if (isPremium || !user) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 5000);

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => clearInterval(interval), 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPremium, user]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-surface-secondary rounded-2xl border border-border p-10">
          {isPremium ? (
            <>
              <span className="text-5xl mb-4 block">&#10003;</span>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                You're All Set!
              </h1>
              <p className="text-text-secondary mb-6">
                Your premium access is now active. All subjects, formulas,
                practice exams, and more are unlocked.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Payment Received!
              </h1>
              <p className="text-text-secondary mb-6">
                Thank you for your purchase. Your premium access is being
                activated and will be ready shortly.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface-tertiary text-text-secondary rounded-xl font-medium hover:bg-surface transition-colors border border-border"
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
