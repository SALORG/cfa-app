import { Link } from "react-router";
import { subjects, allModules } from "~/data";
import { useTheme } from "~/context/ThemeContext";
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
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Cheat Sheets",
    desc: "Concise summaries of key concepts and definitions for every module.",
  },
  {
    icon: Network,
    title: "Mind Maps",
    desc: "Visual connections between topics to see the big picture at a glance.",
  },
  {
    icon: Layers,
    title: "Flash Cards",
    desc: "Interactive flip cards for active recall and spaced repetition.",
  },
  {
    icon: CircleCheckBig,
    title: "Quizzes",
    desc: "Test your understanding with targeted questions after each module.",
  },
  {
    icon: FunctionSquare,
    title: "Master Formulas",
    desc: "Every key formula across all subjects collected in one place.",
  },
  {
    icon: ClipboardList,
    title: "Practice Exam",
    desc: "Full 180-question mock exam simulating the real CFA Level I test.",
  },
];

export default function Home() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-text-primary tracking-tight">
              CFA Study Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-surface-secondary transition-colors text-text-secondary"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors text-sm"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
            Master{" "}
            <span className="text-accent">CFA Level I</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-4">
            Your complete study companion for the 2026 CFA Level I curriculum.
            {" "}{subjects.length} subjects, {allModules.length} modules — everything you
            need in one place.
          </p>
          <p className="text-text-muted mb-10">
            Cheat sheets, mind maps, flash cards, quizzes, and a full practice exam.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
          >
            Start Studying
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-surface-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Everything You Need to Pass
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Built-in study tools designed for efficient CFA exam preparation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-surface rounded-xl p-6 border border-border hover:border-accent/40 transition-all hover:shadow-md"
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
      <section className="py-20 px-6">
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
                className="bg-surface-secondary rounded-xl p-4 border border-border text-center hover:border-accent/40 transition-all"
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

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-surface-secondary border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Ready to Start?
          </h2>
          <p className="text-text-secondary mb-8">
            Jump into the dashboard and begin working through the curriculum.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25"
          >
            Open Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
