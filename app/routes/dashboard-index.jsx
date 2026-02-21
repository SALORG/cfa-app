import { Link } from "react-router";
import { subjects, allModules } from "~/data";
import { useDashboardContext } from "./dashboard";

export default function DashboardIndex() {
  const { progress } = useDashboardContext();

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalModules = allModules.length;
  const overallPercent =
    totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          CFA Level I Study Dashboard
        </h1>
        <p className="text-text-secondary text-lg">
          2026 Curriculum &middot; {completedCount}/{totalModules} modules
          completed ({overallPercent}%)
        </p>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Modules" value={totalModules} />
        <StatCard label="Completed" value={completedCount} color="text-success" />
        <StatCard
          label="Remaining"
          value={totalModules - completedCount}
          color="text-warning"
        />
        <StatCard label="Progress" value={`${overallPercent}%`} color="text-accent" />
      </div>

      {/* Subject Cards */}
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Subjects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {subjects.map((subject) => {
          const subjectModules = subject.modules;
          const subjectCompleted = subjectModules.filter(
            (m) => progress[`${subject.id}__${m.id}`]
          ).length;
          const pct =
            subjectModules.length > 0
              ? Math.round((subjectCompleted / subjectModules.length) * 100)
              : 0;

          return (
            <Link
              key={subject.id}
              to={`/dashboard/${subject.id}/${subject.modules[0]?.id}`}
              className="group block bg-surface-secondary rounded-xl p-5 border border-border hover:border-accent/50 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: subject.color + "20" }}
                  >
                    {subject.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {subject.modules.length} modules &middot; {subject.weight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-tertiary rounded-full h-2 mb-1">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>
              <p className="text-xs text-text-muted text-right">
                {subjectCompleted}/{subjectModules.length} ({pct}%)
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Links */}
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Quick Links
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickLink
          to="/dashboard/formulas"
          icon="📐"
          title="Master Formulas"
          desc="All key formulas in one place"
        />
        <QuickLink
          to="/dashboard/connections"
          icon="🔗"
          title="Inter-Subject Connections"
          desc="See how topics relate"
        />
        <QuickLink
          to="/dashboard/practice-exam"
          icon="📝"
          title="Practice Exam"
          desc="Full 180-question mock exam"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-text-primary" }) {
  return (
    <div className="bg-surface-secondary rounded-xl p-4 border border-border">
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function QuickLink({ to, icon, title, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 bg-surface-secondary rounded-xl p-4 border border-border hover:border-accent/50 transition-all hover:shadow-lg group"
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-text-muted">{desc}</p>
      </div>
    </Link>
  );
}
