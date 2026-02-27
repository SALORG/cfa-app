import { useState } from "react";
import { Pencil, Plus, X, RotateCcw } from "lucide-react";

export default function MindMap({ mindMap, editable, onSave, onReset, isCustom }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  if (!mindMap || !mindMap.root) {
    return <p className="text-text-muted text-center py-8">No mind map data available.</p>;
  }

  const data = isEditing ? draft : mindMap;
  const { root, branches } = data;

  function startEditing() {
    setDraft(JSON.parse(JSON.stringify(mindMap)));
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

  function updateBranch(idx, updates) {
    setDraft((d) => {
      const b = [...d.branches];
      b[idx] = { ...b[idx], ...updates };
      return { ...d, branches: b };
    });
  }

  function removeBranch(idx) {
    setDraft((d) => ({ ...d, branches: d.branches.filter((_, i) => i !== idx) }));
  }

  function addBranch() {
    setDraft((d) => ({ ...d, branches: [...(d.branches || []), { label: "", leaves: [] }] }));
  }

  function updateLeaf(branchIdx, leafIdx, value) {
    setDraft((d) => {
      const b = [...d.branches];
      const leaves = [...b[branchIdx].leaves];
      leaves[leafIdx] = value;
      b[branchIdx] = { ...b[branchIdx], leaves };
      return { ...d, branches: b };
    });
  }

  function removeLeaf(branchIdx, leafIdx) {
    setDraft((d) => {
      const b = [...d.branches];
      b[branchIdx] = { ...b[branchIdx], leaves: b[branchIdx].leaves.filter((_, i) => i !== leafIdx) };
      return { ...d, branches: b };
    });
  }

  function addLeaf(branchIdx) {
    setDraft((d) => {
      const b = [...d.branches];
      b[branchIdx] = { ...b[branchIdx], leaves: [...(b[branchIdx].leaves || []), ""] };
      return { ...d, branches: b };
    });
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

      <div className="flex flex-col items-center py-6 overflow-x-auto">
        {/* Root node */}
        {isEditing ? (
          <input
            type="text"
            value={root}
            onChange={(e) => setDraft((d) => ({ ...d, root: e.target.value }))}
            className="bg-accent text-white rounded-full px-6 py-3 text-lg font-bold text-center shadow-lg shadow-accent/20 border-2 border-white/20 focus:outline-none"
          />
        ) : (
          <div className="bg-accent text-white rounded-full px-6 py-3 text-lg font-bold text-center shadow-lg shadow-accent/20">
            {root}
          </div>
        )}

        {/* Connector line from root */}
        {branches && branches.length > 0 && <div className="w-px h-8 bg-border" />}

        {/* Branches */}
        {branches && branches.length > 0 && (
          <div className="relative w-full max-w-5xl">
            {branches.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{ width: `${Math.min(100, branches.length * 20)}%` }} />
            )}

            <div className="flex flex-wrap justify-center gap-6 pt-0">
              {branches.map((branch, i) => (
                <div key={i} className="flex flex-col items-center min-w-[140px] max-w-[220px]">
                  <div className="w-px h-6 bg-border" />

                  {/* Branch node */}
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={branch.label}
                        onChange={(e) => updateBranch(i, { label: e.target.value })}
                        className="bg-surface-tertiary border border-border rounded-lg px-4 py-2 font-medium text-text-primary text-center text-sm focus:outline-none focus:border-accent/50 pr-7"
                      />
                      <button onClick={() => removeBranch(i)} className="absolute top-1 right-1 p-0.5 text-text-muted hover:text-danger">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-surface-tertiary border border-border rounded-lg px-4 py-2 font-medium text-text-primary text-center text-sm whitespace-nowrap">
                      {branch.label}
                    </div>
                  )}

                  {/* Connector to leaves */}
                  {branch.leaves && branch.leaves.length > 0 && <div className="w-px h-4 bg-border" />}

                  {/* Leaves */}
                  {branch.leaves && branch.leaves.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 max-w-[220px]">
                      {branch.leaves.map((leaf, j) => (
                        isEditing ? (
                          <div key={j} className="relative">
                            <input
                              type="text"
                              value={leaf}
                              onChange={(e) => updateLeaf(i, j, e.target.value)}
                              className="bg-surface-secondary border border-border rounded px-3 py-1 text-xs text-text-secondary text-center focus:outline-none focus:border-accent/50 w-[120px] pr-5"
                            />
                            <button onClick={() => removeLeaf(i, j)} className="absolute top-0.5 right-0.5 p-0.5 text-text-muted hover:text-danger">
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <span key={j} className="bg-surface-secondary border border-border rounded px-3 py-1 text-xs text-text-secondary text-center">
                            {leaf}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  {/* Add leaf button */}
                  {isEditing && (
                    <button onClick={() => addLeaf(i)} className="mt-1 text-accent hover:text-accent/80 transition-colors">
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add branch button */}
        {isEditing && (
          <button onClick={addBranch} className="mt-4 flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors">
            <Plus size={14} /> Add Branch
          </button>
        )}
      </div>
    </div>
  );
}
