import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore/lite";
import { db } from "~/lib/firebase";
import { useAuth } from "~/context/AuthContext";

/**
 * Hook for loading/saving per-user content notes in Firestore.
 * Key format: "subjectId__moduleId__type" (e.g., "quants__quants-lm1__cheatsheet")
 *
 * @param {string} noteKey - Unique key for this content piece
 * @param {object} staticData - The default static JSON data
 * @returns {{ data, isCustom, save, reset, loading }}
 */
export function useUserNotes(noteKey, staticData) {
  const { user } = useAuth();
  const [customData, setCustomData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load custom notes from Firestore on mount
  useEffect(() => {
    if (!user || !noteKey) return;
    setLoading(true);
    const ref = doc(db, "users", user.uid, "notes", noteKey);
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          setCustomData(snap.data().content);
        }
      })
      .finally(() => setLoading(false));
  }, [user, noteKey]);

  const save = useCallback(
    (updatedData) => {
      setCustomData(updatedData);
      if (!user) return; // Guest — in-memory only
      const ref = doc(db, "users", user.uid, "notes", noteKey);
      setDoc(ref, { content: updatedData });
    },
    [user, noteKey]
  );

  const reset = useCallback(() => {
    setCustomData(null);
    if (!user) return;
    const ref = doc(db, "users", user.uid, "notes", noteKey);
    deleteDoc(ref);
  }, [user, noteKey]);

  return {
    data: customData || staticData,
    isCustom: !!customData,
    save,
    reset,
    loading,
  };
}
