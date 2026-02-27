import { useState } from "react";
import { Pencil, Plus, X, RotateCcw } from "lucide-react";

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

function EditInput({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-surface-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 ${className}`}
    />
  );
}

function EditTextarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-surface-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-y"
    />
  );
}

function DeleteButton({ onClick }) {
  return (
    <button onClick={onClick} className="absolute top-2 right-2 p-1 text-text-muted hover:text-danger transition-colors" title="Remove">
      <X size={14} />
    </button>
  );
}

function ConceptsSection({ concepts, isEditing, onUpdate }) {
  if (!isEditing && (!concepts || concepts.length === 0)) return null;
  const items = concepts || [];

  return (
    <section className="mb-8">
      <SectionHeading title="Concepts" count={items.length} />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((concept, i) => (
          <div key={i} className="relative bg-surface-secondary rounded-xl p-4 border border-border">
            {isEditing && <DeleteButton onClick={() => onUpdate(items.filter((_, j) => j !== i))} />}
            {isEditing ? (
              <>
                <EditInput
                  value={concept.title}
                  onChange={(v) => { const u = [...items]; u[i] = { ...u[i], title: v }; onUpdate(u); }}
                  placeholder="Concept title"
                  className="font-bold mb-2"
                />
                <EditTextarea
                  value={concept.desc || concept.description || ""}
                  onChange={(v) => { const u = [...items]; u[i] = { ...u[i], desc: v }; onUpdate(u); }}
                  placeholder="Description"
                />
              </>
            ) : (
              <>
                <h4 className="font-bold text-text-primary mb-2">{concept.title}</h4>
                <div className="text-text-secondary text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: concept.desc || concept.description }} />
              </>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <button
          onClick={() => onUpdate([...items, { title: "", desc: "" }])}
          className="mt-3 flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          <Plus size={14} /> Add Concept
        </button>
      )}
    </section>
  );
}

function FormulasSection({ formulas, isEditing, onUpdate }) {
  if (!isEditing && (!formulas || formulas.length === 0)) return null;
  const items = formulas || [];

  return (
    <section className="mb-8">
      <SectionHeading title="Key Formulas" count={items.length} />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((formula, i) => (
          <div key={i} className="relative bg-surface-secondary rounded-xl p-4 border border-border">
            {isEditing && <DeleteButton onClick={() => onUpdate(items.filter((_, j) => j !== i))} />}
            {isEditing ? (
              <>
                <EditInput
                  value={formula.name}
                  onChange={(v) => { const u = [...items]; u[i] = { ...u[i], name: v }; onUpdate(u); }}
                  placeholder="Formula name"
                  className="font-bold mb-2"
                />
                <EditTextarea
                  value={formula.formula}
                  onChange={(v) => { const u = [...items]; u[i] = { ...u[i], formula: v }; onUpdate(u); }}
                  placeholder="Formula (supports HTML like <sup>, <sub>)"
                  rows={2}
                />
                <EditInput
                  value={formula.where || ""}
                  onChange={(v) => { const u = [...items]; u[i] = { ...u[i], where: v }; onUpdate(u); }}
                  placeholder="Where clause (optional)"
                  className="mt-2"
                />
              </>
            ) : (
              <>
                <h4 className="font-bold text-text-primary mb-2">{formula.name}</h4>
                <div className="text-accent font-mono text-sm bg-surface-tertiary rounded-lg px-3 py-2 mb-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: formula.formula }} />
                {formula.where && <p className="text-text-muted text-xs leading-relaxed">{formula.where}</p>}
              </>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <button
          onClick={() => onUpdate([...items, { name: "", formula: "", where: "" }])}
          className="mt-3 flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          <Plus size={14} /> Add Formula
        </button>
      )}
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
          <div key={i} className="bg-surface-secondary rounded-xl p-4 border border-border">
            <h4 className="font-bold text-text-primary mb-3">{decision.question}</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {decision.use && decision.use.length > 0 && (
                <div>
                  <p className="text-success text-xs font-semibold uppercase tracking-wide mb-2">Use when</p>
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
                  <p className="text-danger text-xs font-semibold uppercase tracking-wide mb-2">Avoid when</p>
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
          <div key={i} className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-warning text-lg shrink-0" aria-hidden="true">&#x26A0;</span>
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

  return (
    <section className="mb-8">
      <SectionHeading title="Worked Examples" count={examples.length} />
      <div className="space-y-4">
        {examples.map((example, i) => (
          <div key={i} className="bg-surface-secondary rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left p-4 flex items-center justify-between hover:bg-surface-tertiary transition-colors"
            >
              <div>
                <h4 className="font-bold text-text-primary text-sm">{example.title}</h4>
                <p className="text-text-secondary text-sm mt-1">{example.problem}</p>
              </div>
              <span className={`text-text-muted ml-4 shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">Solution</p>
                  <div className="text-text-secondary text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: example.solution }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CheatSheet({ cheatSheet, editable, onSave, onReset, isCustom }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  if (!cheatSheet) {
    return <p className="text-text-muted text-center py-8">No cheat sheet data available.</p>;
  }

  const data = isEditing ? draft : cheatSheet;
  const { concepts, formulas, decisions, pitfalls, examples } = data;

  function startEditing() {
    setDraft(JSON.parse(JSON.stringify(cheatSheet)));
    setIsEditing(true);
  }

  function handleSave() {
    onSave(draft);
    setIsEditing(false);
    setDraft(null);
  }

  function handleCancel() {
    setDraft(null);
    setIsEditing(false);
  }

  function handleReset() {
    onReset();
    setDraft(null);
    setIsEditing(false);
  }

  return (
    <div>
      {/* Edit toolbar */}
      {editable && (
        <div className="flex items-center justify-end gap-2 mb-4">
          {isCustom && !isEditing && (
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-warning transition-colors">
              <RotateCcw size={12} /> Reset to default
            </button>
          )}
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
                Save
              </button>
            </>
          ) : (
            <button onClick={startEditing} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-accent border border-border rounded-lg transition-colors">
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>
      )}

      <ConceptsSection
        concepts={concepts}
        isEditing={isEditing}
        onUpdate={(updated) => setDraft((d) => ({ ...d, concepts: updated }))}
      />
      <FormulasSection
        formulas={formulas}
        isEditing={isEditing}
        onUpdate={(updated) => setDraft((d) => ({ ...d, formulas: updated }))}
      />
      <DecisionsSection decisions={decisions} />
      <PitfallsSection pitfalls={pitfalls} />
      <ExamplesSection examples={examples} />
    </div>
  );
}
