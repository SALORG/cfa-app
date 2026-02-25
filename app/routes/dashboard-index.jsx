import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { subjects, allModules, isContentLocked, FREE_SUBJECT_IDS } from "~/data";
import { useAuth } from "~/context/AuthContext";
import { useGuest } from "~/context/GuestContext";
import { trackCustomEvent } from "~/lib/analytics";
import { useDashboardContext } from "./dashboard";
import StudyLogInput from "~/components/StudyLogInput";
import WeeklyBarChart from "~/components/WeeklyBarChart";
import StudyHeatmap from "~/components/StudyHeatmap";

export default function DashboardIndex() {
  const { isPremium, user, refreshSubscription } = useAuth();
  const { isGuest, requireAuth } = useGuest();
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

      {/* Guest Banner */}
      {isGuest && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold text-accent">You're exploring as a guest</p>
            <p className="text-sm text-text-secondary">
              Sign up free to save your progress and unlock 2 subjects with 10 modules.
            </p>
          </div>
          <button
            onClick={() => requireAuth("guest_banner")}
            className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            Sign Up Free
          </button>
        </div>
      )}

      {/* Upgrade Banner for free users */}
      {user && !isPremium && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold text-amber-500">You've unlocked Quantitative Methods & Economics!</p>
            <p className="text-sm text-text-secondary">
              Upgrade to Premium to access all 10 subjects, 59 modules, practice exams, and more.
            </p>
          </div>
          <Link
            to="/pricing"
            className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            Upgrade to Premium
          </Link>
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
          <StudyLogInput studyLogs={studyLogs} setStudyLogs={setStudyLogs} onGuestAction={isGuest ? () => requireAuth("study_log") : undefined} />
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

          const guestLocked = isGuest && !FREE_SUBJECT_IDS.includes(subject.id);

          return (
            <Link
              key={subject.id}
              to={`/dashboard/${subject.id}/${subject.modules[0]?.id}`}
              onClick={(e) => {
                if (isGuest && !FREE_SUBJECT_IDS.includes(subject.id)) {
                  e.preventDefault();
                  requireAuth("subject_card");
                } else if (locked) {
                  trackCustomEvent("PremiumContentBlocked", { content_name: subject.name, content_type: "subject" });
                }
              }}
              className={`group block bg-surface-secondary rounded-xl p-5 border border-border transition-all ${locked || guestLocked ? "opacity-60" : "hover:border-accent/50 hover:shadow-lg"}`}
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
                {(locked || guestLocked) && <span className="text-lg">🔒</span>}
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
          isGuest={isGuest}
          requireAuth={requireAuth}
        />
        <QuickLink
          to="/dashboard/connections"
          icon="🔗"
          title="Inter-Subject Connections"
          desc="See how topics relate"
          locked={!isPremium}
          isGuest={isGuest}
          requireAuth={requireAuth}
        />
        <QuickLink
          to="/dashboard/practice-exam"
          icon="📝"
          title="Practice Exam"
          desc="Full 180-question mock exam"
          locked={!isPremium}
          isGuest={isGuest}
          requireAuth={requireAuth}
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

function QuickLink({ to, icon, title, desc, locked, isGuest, requireAuth }) {
  return (
    <Link
      to={to}
      onClick={(e) => {
        if (isGuest) {
          e.preventDefault();
          requireAuth("quick_link");
        } else if (locked) {
          trackCustomEvent("PremiumContentBlocked", { content_name: title });
        }
      }}
      className={`flex items-center gap-4 bg-surface-secondary rounded-xl p-4 border border-border transition-all group ${locked || isGuest ? "opacity-60" : "hover:border-accent/50 hover:shadow-lg"}`}
    >
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-text-muted">{desc}</p>
      </div>
      {(locked || isGuest) && <span className="text-lg">🔒</span>}
    </Link>
  );
}
