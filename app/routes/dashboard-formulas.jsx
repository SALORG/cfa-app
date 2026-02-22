import { Link } from "react-router";
import { consolidated } from "~/data";
import LockedOverlay from "~/components/LockedOverlay";

export default function DashboardFormulas() {
  return <LockedOverlay title="Master Formulas" />;
  const { masterFormulas } = consolidated;

  if (!masterFormulas?.sections) {
    return (
      <div className="p-6">
        <p className="text-text-muted">No formula data available.</p>
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
          <span>Master Formulas</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          📐 Master Formula Sheet
        </h1>
        <p className="text-sm text-text-muted mt-1">
          All key formulas across all CFA Level I subjects
        </p>
      </div>

      <div className="space-y-8">
        {masterFormulas.sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-border">
              {section.subject}
            </h2>
            <div className="grid gap-3">
              {section.formulas.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-surface-secondary rounded-xl p-4 border border-border"
                >
                  <h3 className="font-medium text-text-primary mb-2">
                    {f.name}
                  </h3>
                  <div
                    className="text-accent font-mono text-sm bg-surface-tertiary rounded-lg px-3 py-2 mb-2"
                    dangerouslySetInnerHTML={{ __html: f.formula }}
                  />
                  {f.where && (
                    <p
                      className="text-xs text-text-muted"
                      dangerouslySetInnerHTML={{ __html: `Where: ${f.where}` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
