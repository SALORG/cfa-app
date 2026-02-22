import { Link } from "react-router";
import { useTheme } from "~/context/ThemeContext";
import { useAuth } from "~/context/AuthContext";
import { Sun, Moon, Check, ArrowLeft } from "lucide-react";

const freeFeatures = [
  "1 subject (Quantitative Methods)",
  "6 modules with full content",
  "Cheat sheets & mind maps",
  "Flash cards & quizzes",
  "Progress tracking",
];

const premiumFeatures = [
  "All 10 subjects, 59 modules",
  "Master formula sheet (80+ formulas)",
  "Inter-subject connections",
  "Full 180-question practice exam",
  "Score history & analytics",
  "Priority updates",
];

export default function Pricing() {
  const { isDark, toggleTheme } = useTheme();
  const auth = useAuth();
  const user = auth?.user;
  const isPremium = auth?.isPremium;

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="CFA Master" className="h-8 w-auto dark:hidden" />
            <img src="/logo-dark.png" alt="CFA Master" className="h-8 w-auto hidden dark:block" />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-secondary transition-colors text-text-secondary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-surface-secondary text-text-primary rounded-lg font-medium hover:bg-surface-tertiary transition-colors text-sm border border-border"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Unlock Your Full CFA Prep
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Get access to all 10 subjects, 59 modules, practice exams, and more.
            Everything you need to pass CFA Level I.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-surface-secondary rounded-2xl border border-border p-8">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Free</h3>
            <p className="text-sm text-text-muted mb-6">Get started with basics</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">&#8377;0</span>
              <span className="text-text-muted ml-1">forever</span>
            </div>
            <Link
              to="/dashboard"
              className="block w-full text-center px-6 py-3 rounded-xl font-medium text-sm border border-border text-text-secondary hover:bg-surface-tertiary transition-colors mb-8"
            >
              Current Plan
            </Link>
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                  <Check className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-surface-secondary rounded-2xl border-2 border-accent p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
              Recommended
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Premium</h3>
            <p className="text-sm text-text-muted mb-6">Full exam preparation</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">&#8377;2,999</span>
              <span className="text-text-muted ml-1">one-time</span>
            </div>

            {isPremium ? (
              <div className="w-full text-center px-6 py-3 rounded-xl font-medium text-sm bg-accent/10 text-accent mb-8">
                Your Current Plan
              </div>
            ) : (
              <a
                href="https://rzp.io/rzp/cfa-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-sm bg-accent text-white hover:bg-accent-hover transition-colors mb-8"
              >
                Get Premium
              </a>
            )}

            <ul className="space-y-3">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tax note */}
        <p className="text-center text-xs text-text-muted mt-6">
          All prices are inclusive of applicable taxes.
        </p>
      </div>
    </div>
  );
}
