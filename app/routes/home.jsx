import { Link } from "react-router";
import { subjects, allModules } from "~/data";
import { useTheme } from "~/context/ThemeContext";
import { trackEvent } from "~/lib/analytics";
import {
  Sun,
  Moon,
  FileText,
  Network,
  Layers,
  CircleCheckBig,
  FunctionSquare,
  ClipboardList,
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Target,
  Zap,
  BarChart3,
  Trophy,
  RefreshCw,
  Cloud,
  Search,
  AlertTriangle,
  Lightbulb,
  Monitor,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Cheat Sheets",
    desc: "Key concepts and definitions distilled into scannable summaries for all 59 modules.",
  },
  {
    icon: Network,
    title: "Mind Maps",
    desc: "Visual connections between topics so you see how the entire curriculum fits together.",
  },
  {
    icon: Layers,
    title: "725+ Flash Cards",
    desc: "Flip through formulas, concepts, and decision frameworks built for active recall.",
  },
  {
    icon: CircleCheckBig,
    title: "248 Quiz Questions",
    desc: "Test yourself after each module with targeted questions and detailed explanations.",
  },
  {
    icon: FunctionSquare,
    title: "80+ Formulas",
    desc: "Every key formula across all 10 subjects — searchable and organized in one place.",
  },
  {
    icon: ClipboardList,
    title: "180-Question Mock Exam",
    desc: "A full-length practice exam that simulates the real CFA Level I test experience.",
  },
];

const proofPoints = [
  { icon: BookOpen, label: "Complete 2026 Curriculum" },
  { icon: Target, label: "59 Modules Covered" },
  { icon: GraduationCap, label: "Exam-Day Ready" },
  { icon: Zap, label: "Start Instantly" },
];

export default function Home() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CFA Master" className="h-8 w-auto dark:hidden" />
            <img src="/logo-dark.png" alt="CFA Master" className="h-8 w-auto hidden dark:block" />
          </div>
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
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors text-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-accent font-semibold text-sm mb-4 tracking-wide uppercase">
              Built for 2026 CFA Level I Candidates
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
              Pass CFA Level I{" "}
              <span className="text-accent">with Smart Study Tools</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mb-8">
              {subjects.length} subjects, {allModules.length} modules, 80+ formulas,
              and a full 180-question mock exam — everything you need in one dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/dashboard"
                onClick={() => {
                  trackEvent("Lead", { content_name: "Hero CTA" });
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
              >
                Start Studying Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop"
              alt="Study desk with notes and books"
              className="rounded-2xl shadow-2xl object-cover w-full h-[420px] border border-border"
            />
            <p className="text-xs text-text-muted mt-2 text-right">
              Photo by{" "}
              <a
                href="https://unsplash.com/@craftedbygc"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-text-secondary"
              >
                Green Chameleon
              </a>
              {" "}on{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-text-secondary"
              >
                Unsplash
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-surface-secondary py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-4">
          {proofPoints.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="flex items-center gap-2 text-text-secondary">
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{p.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Everything You Need to Pass
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Six built-in study tools designed for efficient CFA exam preparation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-surface-secondary rounded-xl p-6 border border-border hover:border-accent/40 transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {f.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 px-6 bg-surface-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            10 Subjects Covered
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Comprehensive coverage of the entire CFA Level I curriculum.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="bg-surface rounded-xl p-4 border border-border text-center hover:border-accent/40 transition-all"
              >
                <span
                  className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg mx-auto mb-3"
                  style={{ backgroundColor: s.color + "20" }}
                >
                  {s.icon}
                </span>
                <h3 className="font-medium text-text-primary text-sm mb-1">
                  {s.name}
                </h3>
                <p className="text-xs text-text-muted">
                  {s.modules.length} modules · {s.weight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Your Progress */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Track Every Step of Your Progress
            </h2>
            <p className="text-text-secondary mb-8">
              See exactly where you stand across the entire curriculum. Mark modules complete,
              track quiz scores over time, and watch your progress ring fill up as you master each subject.
            </p>
            <div className="space-y-4">
              {[
                { icon: BarChart3, title: "Visual Progress Dashboard", desc: "Progress bars for each subject and an overall completion ring at a glance." },
                { icon: Trophy, title: "Score History & Personal Bests", desc: "Every quiz attempt is recorded. Beat your personal best and see your improvement over time." },
                { icon: Cloud, title: "Cloud Sync Across Devices", desc: "Sign in once and your progress follows you — laptop, tablet, or phone." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm">{item.title}</h3>
                      <p className="text-text-secondary text-sm">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop"
              alt="Analytics dashboard on screen"
              className="rounded-2xl shadow-2xl object-cover w-full h-[400px] border border-border"
            />
            <p className="text-xs text-text-muted mt-2 text-right">
              Photo by{" "}
              <a href="https://unsplash.com/@carlheyerdahl" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">
                Carl Heyerdahl
              </a>
              {" "}on{" "}
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">
                Unsplash
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Smart Study Features */}
      <section className="py-20 px-6 bg-surface-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Study Smarter, Not Harder
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Built-in tools that help you focus on what matters most for exam day.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Instant Search", desc: "Find any module or formula in seconds with full-text search." },
              { icon: AlertTriangle, title: "Common Pitfalls", desc: "Each module highlights mistakes candidates frequently make on exam day." },
              { icon: Lightbulb, title: "Worked Examples", desc: "Step-by-step solutions that show you exactly how to approach problems." },
              { icon: RefreshCw, title: "Shuffle Mode", desc: "Randomize flashcards to prevent memorizing card order instead of content." },
              { icon: Network, title: "Cross-Subject Links", desc: "See how concepts connect across subjects — the way the exam tests them." },
              { icon: CheckCircle, title: "Decision Frameworks", desc: "Know when to use (and when not to use) each formula and concept." },
              { icon: Monitor, title: "Dark & Light Mode", desc: "Study comfortably day or night with a theme that syncs to your preference." },
              { icon: GraduationCap, title: "2026 Curriculum Aligned", desc: "Content mapped to the official CFA Institute learning modules." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-surface rounded-xl p-5 border border-border"
                >
                  <Icon className="w-6 h-6 text-accent mb-3" />
                  <h3 className="font-semibold text-text-primary text-sm mb-1">{item.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Three steps to start preparing for CFA Level I.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick a Module", desc: "Choose from 59 modules across 10 subjects. Start wherever you want." },
              { step: "2", title: "Study & Practice", desc: "Read the cheat sheet, flip through flashcards, then test yourself with a quiz." },
              { step: "3", title: "Track & Repeat", desc: "Mark modules complete, review your scores, and tackle the full mock exam when you're ready." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-surface-secondary border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Start Passing — Today
          </h2>
          <p className="text-text-secondary mb-8">
            Jump into the dashboard and begin working through the 2026 curriculum today.
          </p>
          <Link
            to="/dashboard"
            onClick={() => {
              trackEvent("Lead", { content_name: "Footer CTA" });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
          >
            Start Studying Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-text-muted text-sm mt-4">
            Sign in to save your progress across devices.
          </p>
        </div>
      </section>
    </div>
  );
}
