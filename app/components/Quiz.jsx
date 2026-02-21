import { useState, useCallback } from "react";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions?.length || 0;

  const handleSelect = useCallback(
    (questionIndex, optionIndex) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    },
    [submitted]
  );

  const handlePrev = useCallback(() => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentQuestion((prev) => Math.min(total - 1, prev + 1));
  }, [total]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setCurrentQuestion(0);
  }, []);

  const handleReset = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestion(0);
  }, []);

  if (!questions || questions.length === 0) {
    return (
      <p className="text-text-muted text-center py-8">
        No quiz questions available.
      </p>
    );
  }

  const score = submitted
    ? questions.reduce((acc, q, i) => {
        const selected = answers[i];
        const correctIndex =
          typeof q.correct === "number"
            ? q.correct
            : OPTION_LABELS.indexOf(String(q.correct).toUpperCase());
        return acc + (selected === correctIndex ? 1 : 0);
      }, 0)
    : 0;

  const q = questions[currentQuestion];
  const selectedOption = answers[currentQuestion];
  const correctIndex =
    typeof q.correct === "number"
      ? q.correct
      : OPTION_LABELS.indexOf(String(q.correct).toUpperCase());

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score summary (after submit) */}
      {submitted && (
        <div className="bg-surface-secondary border border-border rounded-xl p-5 mb-6 text-center">
          <p className="text-2xl font-bold text-text-primary mb-1">
            You scored {score}/{total} ({total > 0 ? Math.round((score / total) * 100) : 0}%)
          </p>
          <p className="text-text-muted text-sm">
            Review your answers below, then reset when ready.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Reset Quiz
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
          <span>
            Question {currentQuestion + 1} of {total}
          </span>
          {!submitted && (
            <span>{Object.keys(answers).length} answered</span>
          )}
        </div>
        <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface-secondary border border-border rounded-xl p-5 mb-6">
        <p className="text-text-primary font-medium leading-relaxed mb-5">
          {q.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {(q.options || []).map((option, oi) => {
            const isSelected = selectedOption === oi;
            const isCorrect = oi === correctIndex;

            let optionClasses =
              "w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-colors text-sm";

            if (submitted) {
              if (isCorrect) {
                optionClasses += " border-green-500/50 bg-green-500/10 text-success";
              } else if (isSelected && !isCorrect) {
                optionClasses += " border-red-500/50 bg-red-500/10 text-danger";
              } else {
                optionClasses += " border-border bg-surface text-text-muted";
              }
            } else if (isSelected) {
              optionClasses += " border-accent bg-accent/10 text-accent";
            } else {
              optionClasses +=
                " border-border bg-surface hover:bg-surface-tertiary text-text-secondary cursor-pointer";
            }

            return (
              <button
                key={oi}
                type="button"
                onClick={() => handleSelect(currentQuestion, oi)}
                disabled={submitted}
                className={optionClasses}
              >
                <span
                  className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                    isSelected && !submitted
                      ? "bg-accent text-white"
                      : submitted && isCorrect
                      ? "bg-green-500 text-white"
                      : submitted && isSelected && !isCorrect
                      ? "bg-red-500 text-white"
                      : "bg-surface-tertiary text-text-muted"
                  }`}
                >
                  {OPTION_LABELS[oi]}
                </span>
                <span className="pt-0.5">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation (after submit) */}
        {submitted && q.explanation && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
              Explanation
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="px-4 py-2 rounded-lg bg-surface-secondary border border-border text-text-secondary text-sm font-medium hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {!submitted && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
            className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={currentQuestion >= total - 1}
          className="px-4 py-2 rounded-lg bg-surface-secondary border border-border text-text-secondary text-sm font-medium hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
