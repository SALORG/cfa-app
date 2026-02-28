import { useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore/lite";
import { db } from "~/lib/firebase";
import { useAuth } from "~/context/AuthContext";
import { useGuest } from "~/context/GuestContext";
import { getSubject, getModule, getAdjacentModules, isModuleLocked } from "~/data";
import { useDashboardContext } from "./dashboard";
import CheatSheet from "~/components/CheatSheet";
import MindMap from "~/components/MindMap";
import FlashCards from "~/components/FlashCards";
import Quiz from "~/components/Quiz";
import LockedOverlay from "~/components/LockedOverlay";
import { useGuestProgressToast } from "~/components/GuestProgressToast";
import { trackCustomEvent } from "~/lib/analytics";

const TABS = [
  { id: "cheatsheet", label: "Cheat Sheet", icon: "📋" },
  { id: "mindmap", label: "Mind Map", icon: "🧠" },
  { id: "flashcards", label: "Flash Cards", icon: "🃏" },
  { id: "quiz", label: "Quiz", icon: "❓" },
];

export default function DashboardModule() {
  const { user, isPremium, loading } = useAuth();
  const { isGuest, requireAuth, isTrialActive } = useGuest();
  const { subjectId, moduleId } = useParams();
  const { progress, setProgress, quizScores, setQuizScores } = useDashboardContext();
  const [activeTab, setActiveTab] = useState("cheatsheet");
  const { showToast, toast } = useGuestProgressToast();

  const subject = getSubject(subjectId);
  const mod = getModule(subjectId, moduleId);
  const { prev, next } = getAdjacentModules(subjectId, moduleId);
  const locked = isModuleLocked(subjectId, moduleId, isPremium, isTrialActive);

  const progressKey = `${subjectId}__${moduleId}`;
  const isCompleted = !!progress[progressKey];

  const moduleScores = useMemo(
    () => quizScores.filter((s) => s.moduleKey === progressKey),
    [quizScores, progressKey]
  );

  const handleQuizScore = useCallback(
    ({ score, total }) => {
      if (!user && !isTrialActive) { requireAuth("quiz_submit"); return; }
      const entry = {
        moduleKey: progressKey,
        score,
        total,
        date: Timestamp.now(),
      };
      if (user) {
        updateDoc(doc(db, "users", user.uid), {
          quizScores: arrayUnion(entry),
        });
      }
      setQuizScores((prev) => [...prev, entry]);
      if (!user) showToast();
    },
    [user, isTrialActive, progressKey, setQuizScores, requireAuth, showToast]
  );

  const toggleComplete = () => {
    if (isGuest && !isTrialActive) { requireAuth("mark_complete"); return; }
    const wasCompleted = progress[progressKey];
    setProgress((prev) => ({
      ...prev,
      [progressKey]: !prev[progressKey],
    }));
    if (!wasCompleted) {
      trackCustomEvent("ModuleCompleted", {
        module_id: moduleId,
        subject_id: subjectId,
        module_name: mod?.title,
        subject_name: subject?.name,
      });
    }
    if (isGuest) showToast();
  };

  if (loading) {
    return null;
  }

  if (locked) {
    return <LockedOverlay title="Premium Module" isGuest={isGuest} onSignup={() => requireAuth("locked_module")} />;
  }

  if (!subject || !mod) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-danger">Module not found</h1>
        <Link to="/dashboard" className="text-accent mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Link to="/dashboard" className="hover:text-accent">
            Dashboard
          </Link>
          <span>/</span>
          <span style={{ color: subject.color }}>
            {subject.icon} {subject.name}
          </span>
          <span>/</span>
          <span>LM {mod.number}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              LM {mod.number}: {mod.title}
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {subject.name} &middot; {subject.weight}
            </p>
          </div>

          <button
            onClick={toggleComplete}
            className={`shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isCompleted
                ? "bg-success/20 text-success border border-success/30"
                : "bg-surface-tertiary text-text-secondary border border-border hover:border-accent/50"
            }`}
          >
            {isCompleted ? "✓ Completed" : "Mark Complete"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-secondary rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "cheatsheet" && mod.cheatSheet && (
          <CheatSheet cheatSheet={mod.cheatSheet} />
        )}
        {activeTab === "mindmap" && mod.mindMap && (
          <MindMap mindMap={mod.mindMap} />
        )}
        {activeTab === "flashcards" && <FlashCards module={mod} />}
        {activeTab === "quiz" && mod.quiz?.questions && (
          <Quiz questions={mod.quiz.questions} onScoreSubmit={handleQuizScore} previousScores={moduleScores} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        {prev ? (
          <Link
            to={`/dashboard/${prev.subjectId}/${prev.id}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
            onClick={() => setActiveTab("cheatsheet")}
          >
            <span>←</span>
            <div>
              <p className="text-xs text-text-muted">Previous</p>
              <p className="font-medium">
                LM {prev.number}: {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            to={`/dashboard/${next.subjectId}/${next.id}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors text-right"
            onClick={() => setActiveTab("cheatsheet")}
          >
            <div>
              <p className="text-xs text-text-muted">Next</p>
              <p className="font-medium">
                LM {next.number}: {next.title}
              </p>
            </div>
            <span>→</span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {toast}
    </div>
  );
}
