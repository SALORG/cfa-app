import { useState, useCallback } from "react";
import { useGuest } from "~/context/GuestContext";

export function useGuestProgressToast() {
  const { isGuest, requireAuth } = useGuest();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const showToast = useCallback(() => {
    if (!isGuest || dismissed) return;
    setVisible(true);
  }, [isGuest, dismissed]);

  const toast = visible ? (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 bg-surface-secondary border border-amber-500/40 rounded-xl p-4 shadow-lg">
      <p className="text-sm font-medium text-amber-500 mb-1">
        Progress saved for this session only
      </p>
      <p className="text-xs text-text-secondary mb-3">
        Sign up free to keep your progress forever.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => requireAuth("guest_progress_toast")}
          className="px-4 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Sign Up Free
        </button>
        <button
          onClick={() => { setVisible(false); setDismissed(true); }}
          className="px-4 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  ) : null;

  return { showToast, toast };
}
