import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "~/context/AuthContext";
import SignupModal from "~/components/SignupModal";

const GuestContext = createContext(null);

export function GuestProvider({ children }) {
  const { user } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupSource, setSignupSource] = useState(null);

  const isGuest = !user;

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
    <GuestContext.Provider value={{ isGuest, requireAuth }}>
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
