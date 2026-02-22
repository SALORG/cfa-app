import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router";
import { useTheme } from "~/context/ThemeContext";
import { useAuth } from "~/context/AuthContext";
import ProgressRing from "~/components/ProgressRing";
import { searchModules, searchFormulas } from "~/data";

export default function TopBar({ progress = 0, onToggleSidebar }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const moduleResults = useMemo(() => searchModules(query), [query]);
  const formulaResults = useMemo(() => searchFormulas(query), [query]);
  const hasResults = moduleResults.length > 0 || formulaResults.length > 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleInputChange(e) {
    setQuery(e.target.value);
    setIsOpen(true);
  }

  function handleModuleClick(mod) {
    navigate(`/dashboard/${mod.subjectId}/${mod.id}`);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function handleFormulaClick() {
    navigate("/dashboard/formulas");
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (moduleResults.length > 0) {
      handleModuleClick(moduleResults[0]);
    } else if (formulaResults.length > 0) {
      handleFormulaClick();
    }
  }

  function stripHtml(html) {
    return html.replace(/<[^>]*>/g, "");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-surface border-b border-border">
      {/* Left: Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-text-secondary hover:text-text-primary text-xl p-1"
          aria-label="Toggle menu"
        >
          &#9776;
        </button>
        <Link to="/dashboard" className="text-lg font-bold text-accent tracking-tight hover:opacity-80 transition-opacity">
          CFA Level I
        </Link>
      </div>

      {/* Center: Search */}
      <div ref={containerRef} className="hidden sm:block relative flex-1 max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Search modules, formulas..."
            className="w-full px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </form>

        {isOpen && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto z-[60]">
            {!hasResults && (
              <div className="px-4 py-3 text-sm text-text-muted">
                No results found for "{query}"
              </div>
            )}

            {moduleResults.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted bg-surface-secondary">
                  Modules
                </div>
                {moduleResults.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod)}
                    className="w-full text-left px-3 py-2 hover:bg-surface-secondary flex items-center gap-3 transition-colors"
                  >
                    <span
                      className="w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0"
                      style={{ backgroundColor: mod.subjectColor + "20", color: mod.subjectColor }}
                    >
                      {mod.subjectIcon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm text-text-primary truncate">
                        LM {mod.number}: {mod.title}
                      </div>
                      <div className="text-xs text-text-muted truncate">
                        {mod.subjectName}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {formulaResults.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted bg-surface-secondary">
                  Formulas
                </div>
                {formulaResults.map((f, i) => (
                  <button
                    key={`formula-${i}`}
                    onClick={handleFormulaClick}
                    className="w-full text-left px-3 py-2 hover:bg-surface-secondary flex items-center gap-3 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 bg-accent/10 text-accent">
                      fx
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm text-text-primary truncate">
                        {f.name}
                      </div>
                      <div className="text-xs text-text-muted truncate">
                        {stripHtml(f.formula)} &middot; {f.subject}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Progress, Theme Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <ProgressRing size={36} strokeWidth={3} progress={progress} />

        <button
          onClick={toggleTheme}
          className="text-text-secondary hover:text-text-primary text-lg p-1"
          aria-label="Toggle theme"
        >
          {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </button>

        {user && (
          <>
            <span className="text-xs text-text-muted hidden sm:inline truncate max-w-[120px]">
              {user.displayName || user.email}
            </span>
            <button
              onClick={signOut}
              className="text-xs text-text-secondary hover:text-danger transition-colors font-medium"
            >
              Sign Out
            </button>
          </>
        )}

      </div>
    </header>
  );
}
