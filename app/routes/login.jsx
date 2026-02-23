import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { trackEvent, trackCustomEvent } from "~/lib/analytics";


export default function Login() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } =
    useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        trackEvent("CompleteRegistration", { content_name: "Email Sign Up", status: true });
        trackCustomEvent("SignUp", { method: "email" });
      } else {
        await signInWithEmail(email, password);
        trackCustomEvent("Login", { method: "email" });
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await signInWithGoogle();
      trackEvent("CompleteRegistration", { content_name: "Google Sign In", status: true });
      trackCustomEvent("Login", { method: "google" });
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="CFA Master" className="h-16 w-auto mx-auto mb-3 dark:hidden" />
          <img src="/logo-dark.png" alt="CFA Master" className="h-16 w-auto mx-auto mb-3 hidden dark:block" />
          <h1 className="text-2xl font-bold text-text-primary">
            CFA Study Dashboard
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Sign in to track your progress
          </p>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3 px-4 rounded-lg border border-border bg-surface-secondary text-text-primary font-medium hover:bg-surface-tertiary transition-colors"
        >
          Sign in with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-muted text-xs">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

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
            className="w-full py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-4">
          {isSignUp ? "Already have an account?" : "No account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-accent hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
