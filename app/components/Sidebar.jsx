import { useState } from "react";
import { Link } from "react-router";
import { subjects } from "~/data";

const quickLinks = [
  { to: "/dashboard/formulas", label: "Master Formulas", icon: "fx" },
  { to: "/dashboard/connections", label: "Connections", icon: "\u21C4" },
  { to: "/dashboard/practice-exam", label: "Practice Exam", icon: "\u270E" },
];

export default function Sidebar({
  isOpen,
  onClose,
  currentSubjectId,
  currentModuleId,
  progress = {},
}) {
  const [expandedSubjects, setExpandedSubjects] = useState(() => {
    if (currentSubjectId) return new Set([currentSubjectId]);
    return new Set();
  });

  function toggleSubject(subjectId) {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) {
        next.delete(subjectId);
      } else {
        next.add(subjectId);
      }
      return next;
    });
  }

  function getSubjectProgress(subject) {
    let completed = 0;
    for (const mod of subject.modules) {
      if (progress[`${subject.id}__${mod.id}`]) completed++;
    }
    return completed;
  }

  const sidebarContent = (
    <nav className="flex flex-col h-full">
      {/* Subject List */}
      <div className="flex-1 overflow-y-auto py-2">
        {subjects.map((subject) => {
          const isExpanded = expandedSubjects.has(subject.id);
          const completedCount = getSubjectProgress(subject);

          return (
            <div key={subject.id}>
              {/* Subject Header */}
              <button
                onClick={() => toggleSubject(subject.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-surface transition-colors"
                style={{ borderLeft: `3px solid ${subject.color}` }}
              >
                <span className="text-base" role="img" aria-hidden="true">
                  {subject.icon}
                </span>
                <span className="flex-1 text-sm font-medium text-text-primary truncate">
                  {subject.name}
                </span>
                <span className="text-xs text-text-secondary tabular-nums">
                  {completedCount}/{subject.modules.length}
                </span>
                <span className="text-xs text-text-secondary transition-transform duration-200">
                  {isExpanded ? "\u25B2" : "\u25BC"}
                </span>
              </button>

              {/* Module List */}
              {isExpanded && (
                <div className="pb-1">
                  {subject.modules.map((mod) => {
                    const isActive =
                      currentSubjectId === subject.id &&
                      currentModuleId === mod.id;

                    return (
                      <Link
                        key={mod.id}
                        to={`/dashboard/${subject.id}/${mod.id}`}
                        onClick={onClose}
                        className={`flex items-center gap-2 pl-8 pr-3 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "text-accent bg-accent/10 font-medium"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface"
                        }`}
                      >
                        <span className="text-xs text-text-secondary w-5 shrink-0 tabular-nums">
                          {mod.number}.
                        </span>
                        <span className="truncate">{mod.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="border-t border-border px-3 py-3 space-y-1">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="flex items-center gap-2 px-2 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors"
          >
            <span className="w-5 text-center text-xs">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-surface-secondary border-r border-border transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-end px-3 py-2 lg:hidden">
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-lg p-1"
            aria-label="Close sidebar"
          >
            &#10005;
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  );
}
