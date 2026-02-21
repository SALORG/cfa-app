import { Link } from "react-router";
import { consolidated } from "~/data";

export default function DashboardConnections() {
  const connections = consolidated.interSubjectConnections?.connections || [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Link to="/dashboard" className="hover:text-accent">
            Dashboard
          </Link>
          <span>/</span>
          <span>Inter-Subject Connections</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          🔗 Inter-Subject Connections
        </h1>
        <p className="text-sm text-text-muted mt-1">
          See how CFA Level I topics connect across subjects
        </p>
      </div>

      {connections.length === 0 ? (
        <p className="text-text-muted">No connection data available.</p>
      ) : (
        <div className="space-y-4">
          {connections.map((conn, idx) => (
            <div
              key={idx}
              className="bg-surface-secondary rounded-xl p-5 border border-border"
            >
              <h3 className="font-semibold text-text-primary text-lg mb-2">
                {conn.title}
              </h3>
              {conn.subjects && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {conn.subjects.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <p
                className="text-text-secondary text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: conn.description || conn.desc || "",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
