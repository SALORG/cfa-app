import { useState } from "react";
import { Link } from "react-router";
import { Pencil, Plus, X, RotateCcw } from "lucide-react";
import { consolidated } from "~/data";
import { useAuth } from "~/context/AuthContext";
import { useGuest } from "~/context/GuestContext";
import LockedOverlay from "~/components/LockedOverlay";
import { useUserNotes } from "~/hooks/useUserNotes";
import { useGuestProgressToast } from "~/components/GuestProgressToast";

export default function DashboardFormulas() {
  const { isPremium, user } = useAuth();
  const { isGuest, requireAuth, isTrialActive } = useGuest();
  const { showToast, toast } = useGuestProgressToast();

  if (!isPremium && !isTrialActive) return <LockedOverlay title="Master Formulas" isGuest={isGuest} onSignup={() => requireAuth("locked_module")} />;

  const staticFormulas = consolidated.masterFormulas;
  const { data: masterFormulas, isCustom, save, reset } = useUserNotes("formulas__master", staticFormulas);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  if (!masterFormulas?.sections) {
    return (
      <div className="p-6">
        <p className="text-text-muted">No formula data available.</p>
      </div>
    );
  }

  function startEditing() {
    setDraft(JSON.parse(JSON.stringify(masterFormulas)));
    setIsEditing(true);
  }

  function handleSave() {
    save(draft);
    setIsEditing(false);
    setDraft(null);
    if (isGuest) showToast();
  }

  function handleCancel() {
    setDraft(null);
    setIsEditing(false);
  }

  function handleReset() {
    reset();
    setDraft(null);
    setIsEditing(false);
  }

  function updateFormula(sIdx, fIdx, updates) {
    setDraft((d) => {
      const sections = [...d.sections];
      const formulas = [...sections[sIdx].formulas];
      formulas[fIdx] = { ...formulas[fIdx], ...updates };
      sections[sIdx] = { ...sections[sIdx], formulas };
      return { ...d, sections };
    });
  }

  function removeFormula(sIdx, fIdx) {
    setDraft((d) => {
      const sections = [...d.sections];
      sections[sIdx] = { ...sections[sIdx], formulas: sections[sIdx].formulas.filter((_, i) => i !== fIdx) };
      return { ...d, sections };
    });
  }

  function addFormula(sIdx) {
    setDraft((d) => {
      const sections = [...d.sections];
      sections[sIdx] = { ...sections[sIdx], formulas: [...sections[sIdx].formulas, { name: "", formula: "", where: "" }] };
      return { ...d, sections };
    });
  }

  const sections = isEditing ? draft.sections : masterFormulas.sections;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Link to="/dashboard" className="hover:text-accent">Dashboard</Link>
          <span>/</span>
          <span>Master Formulas</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Master Formula Sheet</h1>
            <p className="text-sm text-text-muted mt-1">All key formulas across all CFA Level I subjects</p>
          </div>
          <div className="flex items-center gap-2">
            {isCustom && !isEditing && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-warning transition-colors">
                <RotateCcw size={12} /> Reset to default
              </button>
            )}
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">Save</button>
              </>
            ) : (
              <button onClick={startEditing} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-accent border border-border rounded-lg transition-colors">
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-border">
              {section.subject}
            </h2>
            <div className="grid gap-3">
              {section.formulas.map((f, fIdx) => (
                <div key={fIdx} className="relative bg-surface-secondary rounded-xl p-4 border border-border">
                  {isEditing && (
                    <button onClick={() => removeFormula(sIdx, fIdx)} className="absolute top-2 right-2 p-1 text-text-muted hover:text-danger transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={f.name}
                        onChange={(e) => updateFormula(sIdx, fIdx, { name: e.target.value })}
                        placeholder="Formula name"
                        className="w-full bg-surface-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-medium mb-2 focus:outline-none focus:border-accent/50"
                      />
                      <textarea
                        value={f.formula}
                        onChange={(e) => updateFormula(sIdx, fIdx, { formula: e.target.value })}
                        placeholder="Formula (supports HTML)"
                        rows={2}
                        className="w-full bg-surface-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono mb-2 focus:outline-none focus:border-accent/50 resize-y"
                      />
                      <input
                        type="text"
                        value={f.where || f.note || ""}
                        onChange={(e) => updateFormula(sIdx, fIdx, { where: e.target.value })}
                        placeholder="Where clause / note (optional)"
                        className="w-full bg-surface-tertiary border border-border rounded-lg px-3 py-2 text-xs text-text-muted focus:outline-none focus:border-accent/50"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium text-text-primary mb-2">{f.name}</h3>
                      <div className="text-accent font-mono text-sm bg-surface-tertiary rounded-lg px-3 py-2 mb-2" dangerouslySetInnerHTML={{ __html: f.formula }} />
                      {f.where && <p className="text-xs text-text-muted" dangerouslySetInnerHTML={{ __html: `Where: ${f.where}` }} />}
                    </>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <button onClick={() => addFormula(sIdx)} className="mt-3 flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors">
                <Plus size={14} /> Add Formula
              </button>
            )}
          </div>
        ))}
      </div>

      {toast}
    </div>
  );
}
