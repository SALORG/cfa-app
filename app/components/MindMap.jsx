export default function MindMap({ mindMap }) {
  if (!mindMap || !mindMap.root) {
    return (
      <p className="text-text-muted text-center py-8">
        No mind map data available.
      </p>
    );
  }

  const { root, branches } = mindMap;

  return (
    <div className="flex flex-col items-center py-6 overflow-x-auto">
      {/* Root node */}
      <div className="bg-accent text-white rounded-full px-6 py-3 text-lg font-bold text-center shadow-lg shadow-accent/20">
        {root}
      </div>

      {/* Connector line from root */}
      {branches && branches.length > 0 && (
        <div className="w-px h-8 bg-border" />
      )}

      {/* Horizontal rail connecting all branches */}
      {branches && branches.length > 0 && (
        <div className="relative w-full max-w-5xl">
          {/* Horizontal line across the top */}
          {branches.length > 1 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border" style={{ width: `${Math.min(100, branches.length * 20)}%` }} />
          )}

          {/* Branch columns */}
          <div className="flex flex-wrap justify-center gap-6 pt-0">
            {branches.map((branch, i) => (
              <div key={i} className="flex flex-col items-center min-w-[140px] max-w-[220px]">
                {/* Vertical connector to branch */}
                <div className="w-px h-6 bg-border" />

                {/* Branch node */}
                <div className="bg-surface-tertiary border border-border rounded-lg px-4 py-2 font-medium text-text-primary text-center text-sm whitespace-nowrap">
                  {branch.label}
                </div>

                {/* Connector to leaves */}
                {branch.leaves && branch.leaves.length > 0 && (
                  <div className="w-px h-4 bg-border" />
                )}

                {/* Leaves */}
                {branch.leaves && branch.leaves.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-[220px]">
                    {branch.leaves.map((leaf, j) => (
                      <span
                        key={j}
                        className="bg-surface-secondary border border-border rounded px-3 py-1 text-xs text-text-secondary text-center"
                      >
                        {leaf}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
