import { useState, useMemo, useCallback } from "react";

const CATEGORIES = {
  ALL: "All",
  CONCEPTS: "Concepts",
  FORMULAS: "Formulas",
  DECISIONS: "Decisions",
  QUIZ: "Quiz",
};

function buildCards(module) {
  const cards = [];
  const cs = module?.cheatSheet;

  if (cs?.concepts) {
    cs.concepts.forEach((c) => {
      cards.push({
        category: CATEGORIES.CONCEPTS,
        front: c.title,
        back: c.desc || c.description || "",
      });
    });
  }

  if (cs?.formulas) {
    cs.formulas.forEach((f) => {
      const backParts = [f.formula || ""];
      if (f.where) backParts.push(`<p class="mt-2 text-xs opacity-70">${f.where}</p>`);
      cards.push({
        category: CATEGORIES.FORMULAS,
        front: f.name,
        back: backParts.join(""),
      });
    });
  }

  if (cs?.decisions) {
    cs.decisions.forEach((d) => {
      const usePart =
        d.use && d.use.length > 0
          ? `<p class="font-semibold text-green-400 mb-1">Use when:</p><ul class="list-disc pl-4 mb-2">${d.use.map((u) => `<li>${u}</li>`).join("")}</ul>`
          : "";
      const avoidPart =
        d.avoid && d.avoid.length > 0
          ? `<p class="font-semibold text-red-400 mb-1">Avoid when:</p><ul class="list-disc pl-4">${d.avoid.map((a) => `<li>${a}</li>`).join("")}</ul>`
          : "";
      cards.push({
        category: CATEGORIES.DECISIONS,
        front: d.question,
        back: usePart + avoidPart,
      });
    });
  }

  const quiz = module?.quizQuestions || module?.quiz?.questions;
  if (quiz) {
    quiz.forEach((q) => {
      cards.push({
        category: CATEGORIES.QUIZ,
        front: q.question,
        back: q.explanation || q.answer || "",
      });
    });
  }

  return cards;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashCards({ module }) {
  const allCards = useMemo(() => buildCards(module), [module]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);
  const [deck, setDeck] = useState(allCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filteredCards = useMemo(() => {
    if (activeCategory === CATEGORIES.ALL) return deck;
    return deck.filter((c) => c.category === activeCategory);
  }, [deck, activeCategory]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeIndex] || null;

  const handleCategoryChange = useCallback(
    (cat) => {
      setActiveCategory(cat);
      setCurrentIndex(0);
      setFlipped(false);
    },
    []
  );

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((prev) => Math.min(filteredCards.length - 1, prev + 1));
  }, [filteredCards.length]);

  const handleShuffle = useCallback(() => {
    setDeck(shuffle(allCards));
    setCurrentIndex(0);
    setFlipped(false);
  }, [allCards]);

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  if (allCards.length === 0) {
    return (
      <p className="text-text-muted text-center py-8">
        No flashcard data available.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {Object.values(CATEGORIES).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-accent text-white"
                : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Card counter */}
      <p className="text-text-muted text-sm mb-4">
        Card {filteredCards.length > 0 ? safeIndex + 1 : 0} of {filteredCards.length}
      </p>

      {/* Flip card */}
      {currentCard ? (
        <div
          className="flip-card w-full max-w-lg min-h-[300px] cursor-pointer mb-6"
          onClick={handleFlip}
        >
          <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
            {/* Front */}
            <div className="flip-card-front bg-surface-secondary border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
                {currentCard.category}
              </span>
              <div
                className="text-text-primary text-lg font-medium leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentCard.front }}
              />
              <p className="text-text-muted text-xs mt-4">Click to reveal answer</p>
            </div>

            {/* Back */}
            <div className="flip-card-back bg-accent/10 border border-accent/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
                Answer
              </span>
              <div
                className="text-text-primary text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentCard.back }}
              />
              <p className="text-text-muted text-xs mt-4">Click to see question</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg min-h-[300px] bg-surface-secondary border border-border rounded-2xl flex items-center justify-center mb-6">
          <p className="text-text-muted">No cards in this category.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="px-4 py-2 rounded-lg bg-surface-secondary border border-border text-text-secondary text-sm font-medium hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={handleShuffle}
          className="px-4 py-2 rounded-lg bg-surface-secondary border border-border text-text-secondary text-sm font-medium hover:bg-surface-tertiary transition-colors"
        >
          Shuffle
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={safeIndex >= filteredCards.length - 1}
          className="px-4 py-2 rounded-lg bg-surface-secondary border border-border text-text-secondary text-sm font-medium hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
