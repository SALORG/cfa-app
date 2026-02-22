import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { auth, db } from "~/lib/firebase";

const AuthContext = createContext(null);

function emailToKey(email) {
  return email.toLowerCase().replace(/[.]/g, "_");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState({ plan: "free", status: null });
  const [role, setRole] = useState(null);

  const isPremium = subscription.plan === "premium" && subscription.status === "active";
  const isAdmin = role === "admin";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            progress: {},
            quizScores: [],
            theme: "dark",
            subscription: { plan: "free", status: null },
            email: firebaseUser.email,
          });
          // Create email-to-uid lookup for webhook resolution
          if (firebaseUser.email) {
            const emailKey = emailToKey(firebaseUser.email);
            await setDoc(doc(db, "usersByEmail", emailKey), { uid: firebaseUser.uid });
          }
        } else {
          const data = snap.data();
          if (data.subscription) {
            setSubscription(data.subscription);
          }
          if (data.role) {
            setRole(data.role);
          }
          // Backfill email-to-uid lookup for existing users
          if (firebaseUser.email) {
            const emailKey = emailToKey(firebaseUser.email);
            const emailRef = doc(db, "usersByEmail", emailKey);
            const emailSnap = await getDoc(emailRef);
            if (!emailSnap.exists()) {
              await setDoc(emailRef, { uid: firebaseUser.uid });
            }
          }
        }
        setLoading(false);
      } else {
        setSubscription({ plan: "free", status: null });
        setRole(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const refreshSubscription = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists() && snap.data().subscription) {
      setSubscription(snap.data().subscription);
    }
  };

  const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const signInWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const signUpWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  const logout = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user, loading, subscription, isPremium, isAdmin, refreshSubscription,
        signInWithGoogle, signInWithEmail, signUpWithEmail, signOut: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
