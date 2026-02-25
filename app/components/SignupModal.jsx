import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { trackEvent, trackCustomEvent } from "~/lib/analytics";

const SOURCE_HEADLINES = {
  subject_card: "Sign up to access study modules",
  quick_link: "Sign up to unlock this feature",
  study_log: "Sign up to track your study hours",
  mark_complete: "Sign up to track your progress",
  quiz_submit: "Sign up to save quiz scores",
  sidebar_module: "Sign up to access this module",
  sidebar_quick_link: "Sign up to unlock this feature",
  sidebar_signup: "Create your free account",
  topbar_signup: "Create your free account",
  guest_banner: "Create your free account",
};

export default function SignupModal({ source, onClose }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const backdropRef = useRef(null);

  const headline = SOURCE_HEADLINES[source] || "Create your free account";

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) onClose();
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        trackEvent("CompleteRegistration", { content_name: "Guest Modal", status: true });
        trackCustomEvent("GuestSignup", { method: "email", source });
        onClose();
        navigate("/dashboard");
      } else {
        await signInWithEmail(email, password);
        trackCustomEvent("Login", { method: "email", source: "guest_modal" });
        onClose();
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      trackEvent("CompleteRegistration", { content_name: "Guest Modal Google", status: true });
      trackCustomEvent("GuestSignup", { method: "google", source });
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <div className="w-full max-w-sm bg-surface rounded-2xl border border-border p-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text-muted hover:text-text-primary text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="CFA Master" className="h-12 w-auto mx-auto mb-2 dark:hidden" />
          <img src="/logo-dark.png" alt="CFA Master" className="h-12 w-auto mx-auto mb-2 hidden dark:block" />
          <h2 className="text-lg font-bold text-text-primary">{headline}</h2>
          <p className="text-text-muted text-sm mt-1">
            {isSignUp ? "Free access to 2 subjects with 10 modules" : "Welcome back"}
          </p>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg border border-border bg-surface-secondary text-text-primary font-medium hover:bg-surface-tertiary transition-colors disabled:opacity-50"
        >
          {isSignUp ? "Sign up with Google" : "Sign in with Google"}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-muted text-xs">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2.5 rounded-lg bg-surface-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-3 py-2.5 rounded-lg bg-surface-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-4">
          {isSignUp ? "Already have an account?" : "No account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-accent hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
