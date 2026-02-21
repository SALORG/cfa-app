import { useState } from "react";

function SectionHeading({ title, count }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <span className="bg-accent/20 text-accent text-xs font-bold px-2.5 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  );
}

function ConceptsSection({ concepts }) {
  if (!concepts || concepts.length === 0) return null;
  return (
    <section className="mb-8">
      <SectionHeading title="Concepts" count={concepts.length} />
      <div className="grid gap-4 sm:grid-cols-2">
        {concepts.map((concept, i) => (
          <div
            key={i}
            className="bg-surface-secondary rounded-xl p-4 border border-border"
          >
            <h4 className="font-bold text-text-primary mb-2">
              {concept.title}
            </h4>
            <div
              className="text-text-secondary text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: concept.desc || concept.description }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function FormulasSection({ formulas }) {
  if (!formulas || formulas.length === 0) return null;
  return (
    <section className="mb-8">
      <SectionHeading title="Key Formulas" count={formulas.length} />
      <div className="grid gap-4 sm:grid-cols-2">
        {formulas.map((formula, i) => (
          <div
            key={i}
            className="bg-surface-secondary rounded-xl p-4 border border-border"
          >
            <h4 className="font-bold text-text-primary mb-2">
              {formula.name}
            </h4>
            <div
              className="text-accent font-mono text-sm bg-surface-tertiary rounded-lg px-3 py-2 mb-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: formula.formula }}
            />
            {formula.where && (
              <p className="text-text-muted text-xs leading-relaxed">
                {formula.where}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function DecisionsSection({ decisions }) {
  if (!decisions || decisions.length === 0) return null;
  return (
    <section className="mb-8">
      <SectionHeading title="Decision Framework" count={decisions.length} />
      <div className="grid gap-4">
        {decisions.map((decision, i) => (
          <div
            key={i}
            className="bg-surface-secondary rounded-xl p-4 border border-border"
          >
            <h4 className="font-bold text-text-primary mb-3">
              {decision.question}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {decision.use && decision.use.length > 0 && (
                <div>
                  <p className="text-success text-xs font-semibold uppercase tracking-wide mb-2">
                    Use when
                  </p>
                  <ul className="space-y-1">
                    {decision.use.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-success mt-0.5 shrink-0">&#x2022;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {decision.avoid && decision.avoid.length > 0 && (
                <div>
                  <p className="text-danger text-xs font-semibold uppercase tracking-wide mb-2">
                    Avoid when
                  </p>
                  <ul className="space-y-1">
                    {decision.avoid.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-danger mt-0.5 shrink-0">&#x2022;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PitfallsSection({ pitfalls }) {
  if (!pitfalls || pitfalls.length === 0) return null;
  return (
    <section className="mb-8">
      <SectionHeading title="Common Pitfalls" count={pitfalls.length} />
      <div className="space-y-3">
        {pitfalls.map((pitfall, i) => (
          <div
            key={i}
            className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-start gap-3"
          >
            <span className="text-warning text-lg shrink-0" aria-hidden="true">
              &#x26A0;
            </span>
            <p className="text-text-secondary text-sm leading-relaxed">
              {typeof pitfall === "string" ? pitfall : pitfall.text || pitfall.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExamplesSection({ examples }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!examples || examples.length === 0) return null;

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="mb-8">
      <SectionHeading title="Worked Examples" count={examples.length} />
      <div className="space-y-4">
        {examples.map((example, i) => (
          <div
            key={i}
            className="bg-surface-secondary rounded-xl border border-border overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full text-left p-4 flex items-center justify-between hover:bg-surface-tertiary transition-colors"
            >
              <div>
                <h4 className="font-bold text-text-primary text-sm">
                  {example.title}
                </h4>
                <p className="text-text-secondary text-sm mt-1">
                  {example.problem}
                </p>
              </div>
              <span
                className={`text-text-muted ml-4 shrink-0 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">
                    Solution
                  </p>
                  <div
                    className="text-text-secondary text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: example.solution }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CheatSheet({ cheatSheet }) {
  if (!cheatSheet) {
    return (
      <p className="text-text-muted text-center py-8">
        No cheat sheet data available.
      </p>
    );
  }

  const { concepts, formulas, decisions, pitfalls, examples } = cheatSheet;

  return (
    <div>
      <ConceptsSection concepts={concepts} />
      <FormulasSection formulas={formulas} />
      <DecisionsSection decisions={decisions} />
      <PitfallsSection pitfalls={pitfalls} />
      <ExamplesSection examples={examples} />
    </div>
  );
}
