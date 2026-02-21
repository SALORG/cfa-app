import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { useAuth } from "~/context/AuthContext";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user } = useAuth();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cfa_theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  // Load theme from Firestore when user logs in
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists() && snap.data().theme) {
        setIsDark(snap.data().theme === "dark");
      }
    });
  }, [user]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cfa_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (user) {
        updateDoc(doc(db, "users", user.uid), { theme: next ? "dark" : "light" });
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
