import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useAuth } from "~/context/AuthContext";
import SignupModal from "~/components/SignupModal";

const GuestContext = createContext(null);

const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TRIAL_KEY = "cfa_trial_start";

function getTrialState() {
  if (typeof window === "undefined") return { isTrialActive: false, trialDaysLeft: 0 };

  let startStr = localStorage.getItem(TRIAL_KEY);
  if (!startStr) {
    startStr = String(Date.now());
    localStorage.setItem(TRIAL_KEY, startStr);
  }

  const elapsed = Date.now() - Number(startStr);
  const isTrialActive = elapsed < TRIAL_DURATION_MS;
  const trialDaysLeft = isTrialActive
    ? Math.ceil((TRIAL_DURATION_MS - elapsed) / (24 * 60 * 60 * 1000))
    : 0;

  return { isTrialActive, trialDaysLeft };
}

export function GuestProvider({ children }) {
  const { user, isPremium } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupSource, setSignupSource] = useState(null);

  const isGuest = !user;

  const trial = useMemo(() => {
    if (isPremium) return { isTrialActive: false, trialDaysLeft: 0 };
    return getTrialState();
  }, [isPremium]);

  const requireAuth = useCallback(
    (source = "unknown") => {
      if (user) return true;
      setSignupSource(source);
      setShowSignupModal(true);
      return false;
    },
    [user]
  );

  return (
    <GuestContext.Provider value={{ isGuest, requireAuth, isTrialActive: trial.isTrialActive, trialDaysLeft: trial.trialDaysLeft }}>
      {children}
      {showSignupModal && (
        <SignupModal
          source={signupSource}
          onClose={() => setShowSignupModal(false)}
        />
      )}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) throw new Error("useGuest must be used within GuestProvider");
  return context;
}
