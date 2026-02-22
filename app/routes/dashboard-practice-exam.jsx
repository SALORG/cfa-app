import { useState } from "react";
import { Link } from "react-router";
import { consolidated } from "~/data";
import { useAuth } from "~/context/AuthContext";
import Quiz from "~/components/Quiz";
import LockedOverlay from "~/components/LockedOverlay";

export default function DashboardPracticeExam() {
  const { isPremium } = useAuth();
  const examData = consolidated.practiceExam;
  const [started, setStarted] = useState(false);

  if (!isPremium) return <LockedOverlay title="Practice Exam" />;

  if (!examData?.questions) {
    return (
      <div className="p-6">
        <p className="text-text-muted">No practice exam data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Link to="/dashboard" className="hover:text-accent">
            Dashboard
          </Link>
          <span>/</span>
          <span>Practice Exam</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          📝 {examData.title || "CFA Level I Practice Exam"}
        </h1>
        {examData.instructions && (
          <p className="text-sm text-text-muted mt-1">
            {examData.instructions}
          </p>
        )}
      </div>

      {!started ? (
        <div className="bg-surface-secondary rounded-xl p-8 border border-border text-center max-w-lg mx-auto">
          <p className="text-5xl mb-4">📝</p>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Full Practice Exam
          </h2>
          <p className="text-text-secondary mb-2">
            {examData.questions.length} questions covering all CFA Level I
            topics
          </p>
          <p className="text-sm text-text-muted mb-6">
            This simulates the actual exam format. Take your time and review
            explanations after submitting.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
          >
            Start Practice Exam
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setStarted(false)}
            className="mb-4 text-sm text-text-muted hover:text-accent transition-colors"
          >
            ← Back to exam info
          </button>
          <Quiz questions={examData.questions} />
        </div>
      )}
    </div>
  );
}
