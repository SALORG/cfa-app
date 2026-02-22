import { useState, useEffect } from "react";
import { Link } from "react-router";
import { subjects } from "~/data";
import { useAuth } from "~/context/AuthContext";

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
  const { signOut } = useAuth();
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

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sidebarContent = (
    <nav className="h-full overflow-y-auto">
      {/* Subject List */}
      <div className="py-2">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Modules
          </span>
          <button
            onClick={() => {
              const allExpanded = expandedSubjects.size === subjects.length;
              setExpandedSubjects(
                allExpanded ? new Set() : new Set(subjects.map((s) => s.id))
              );
            }}
            className="text-[11px] text-text-muted hover:text-text-primary transition-colors"
          >
            {expandedSubjects.size === subjects.length ? "Collapse all" : "Expand all"}
          </button>
        </div>
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
                <span className="flex-1 text-sm font-medium text-text-primary truncate" title={subject.name}>
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
                        <span className="truncate" title={mod.title}>{mod.title}</span>
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

      {/* Legal & Logout */}
      <div className="border-t border-border px-3 py-3 space-y-1">
        <Link
          to="/terms"
          onClick={onClose}
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors"
        >
          <span className="w-5 text-center text-xs">{"\u2696"}</span>
          <span>Terms & Conditions</span>
        </Link>
        <Link
          to="/privacy"
          onClick={onClose}
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors"
        >
          <span className="w-5 text-center text-xs">{"\uD83D\uDD12"}</span>
          <span>Privacy Policy</span>
        </Link>
        <button
          onClick={() => { onClose(); signOut(); }}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-danger hover:text-red-400 hover:bg-surface rounded-md transition-colors"
        >
          <span className="w-5 text-center text-xs">{"\u21B6"}</span>
          <span>Logout</span>
        </button>
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
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-surface-secondary border-r border-border transition-transform duration-200 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
