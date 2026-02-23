import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { subjects, allModules, isContentLocked } from "~/data";
import { useAuth } from "~/context/AuthContext";
import { trackCustomEvent } from "~/lib/analytics";
import { useDashboardContext } from "./dashboard";
import StudyLogInput from "~/components/StudyLogInput";
import WeeklyBarChart from "~/components/WeeklyBarChart";
import StudyHeatmap from "~/components/StudyHeatmap";

export default function DashboardIndex() {
  const { isPremium, refreshSubscription } = useAuth();
  const { progress, studyLogs, setStudyLogs } = useDashboardContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Handle return from checkout
  useEffect(() => {
    if (searchParams.get("checkout") !== "success") return;

    setCheckoutSuccess(true);
    setSearchParams({}, { replace: true });

    // Poll for subscription update (webhook may arrive after redirect)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      await refreshSubscription();
      if (attempts >= 5) clearInterval(interval);
    }, 2000);

    const timeout = setTimeout(() => setCheckoutSuccess(false), 8000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalModules = allModules.length;
  const overallPercent =
    totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Checkout Success Banner */}
      {checkoutSuccess && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-500">Welcome to Premium!</p>
            <p className="text-sm text-text-secondary">
              Your subscription is being activated. All content will unlock shortly.
            </p>
          </div>
          <button
            onClick={() => setCheckoutSuccess(false)}
            className="ml-auto text-text-muted hover:text-text-primary text-sm"
          >
            &times;
          </button>
        </div>
      )}

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

      {/* Study Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-secondary rounded-xl border border-border p-6">
          <StudyLogInput studyLogs={studyLogs} setStudyLogs={setStudyLogs} />
        </div>
        <div className="bg-surface-secondary rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">This Week</h3>
          <WeeklyBarChart studyLogs={studyLogs} />
        </div>
        <div className="bg-surface-secondary rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Study Activity</h3>
          <StudyHeatmap studyLogs={studyLogs} />
        </div>
      </div>

      {/* Progress Round Chart */}
      <div className="bg-surface-secondary rounded-xl border border-border p-6 mb-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Overall Progress
        </h2>
        <svg viewBox="0 0 200 200" className="w-48 h-48 mb-4">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="var(--color-surface-tertiary)"
            strokeWidth="14"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${(overallPercent / 100) * 2 * Math.PI * 85} ${2 * Math.PI * 85}`}
            transform="rotate(-90 100 100)"
            className="transition-all duration-700"
          />
          {/* Center text */}
          <text x="100" y="90" textAnchor="middle" className="fill-text-primary text-4xl font-bold" style={{ fontSize: '40px' }}>
            {overallPercent}%
          </text>
          <text x="100" y="115" textAnchor="middle" className="fill-text-muted" style={{ fontSize: '13px' }}>
            {completedCount} of {totalModules}
          </text>
        </svg>

        {/* Per-subject mini bars */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {subjects.map((subject) => {
            const done = subject.modules.filter(
              (m) => progress[`${subject.id}__${m.id}`]
            ).length;
            const pct = subject.modules.length > 0 ? Math.round((done / subject.modules.length) * 100) : 0;
            return (
              <div key={subject.id} className="flex items-center gap-2">
                <span className="text-xs shrink-0">{subject.icon}</span>
                <div className="flex-1 bg-surface-tertiary rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: subject.color }}
                  />
                </div>
                <span className="text-[11px] text-text-muted tabular-nums w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Cards */}
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Subjects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {subjects.map((subject) => {
          const subjectModules = subject.modules;
          const locked = isContentLocked(subject.id, isPremium);
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
              onClick={() => {
                if (locked) {
                  trackCustomEvent("PremiumContentBlocked", { content_name: subject.name, content_type: "subject" });
                }
              }}
              className={`group block bg-surface-secondary rounded-xl p-5 border border-border transition-all ${locked ? "opacity-60" : "hover:border-accent/50 hover:shadow-lg"}`}
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
                {locked && <span className="text-lg">🔒</span>}
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
          locked={!isPremium}
        />
        <QuickLink
          to="/dashboard/connections"
          icon="🔗"
          title="Inter-Subject Connections"
          desc="See how topics relate"
          locked={!isPremium}
        />
        <QuickLink
          to="/dashboard/practice-exam"
          icon="📝"
          title="Practice Exam"
          desc="Full 180-question mock exam"
          locked={!isPremium}
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

function QuickLink({ to, icon, title, desc, locked }) {
  return (
    <Link
      to={to}
      onClick={() => {
        if (locked) {
          trackCustomEvent("PremiumContentBlocked", { content_name: title });
        }
      }}
      className={`flex items-center gap-4 bg-surface-secondary rounded-xl p-4 border border-border transition-all group ${locked ? "opacity-60" : "hover:border-accent/50 hover:shadow-lg"}`}
    >
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-text-muted">{desc}</p>
      </div>
      {locked && <span className="text-lg">🔒</span>}
    </Link>
  );
}
