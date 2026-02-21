import { useState } from "react";
import { useTheme } from "~/context/ThemeContext";
import ProgressRing from "~/components/ProgressRing";

export default function TopBar({ progress = 0, onToggleSidebar, onSearch }) {
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
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
        <span className="text-lg font-bold text-accent tracking-tight">
          CFA Level I
        </span>
      </div>

      {/* Center: Search */}
      <form
        onSubmit={handleSubmit}
        className="hidden sm:flex flex-1 max-w-md mx-4"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search modules, formulas..."
          className="w-full px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-text-primary placeholder:text-text-secondary text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </form>

      {/* Right: Progress, Theme Toggle, Mobile Menu */}
      <div className="flex items-center gap-3 shrink-0">
        <ProgressRing size={36} strokeWidth={3} progress={progress} />

        <button
          onClick={toggleTheme}
          className="text-text-secondary hover:text-text-primary text-lg p-1"
          aria-label="Toggle theme"
        >
          {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </button>

        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-text-secondary hover:text-text-primary text-xl p-1"
          aria-label="Toggle sidebar"
        >
          &#9776;
        </button>
      </div>
    </header>
  );
}
