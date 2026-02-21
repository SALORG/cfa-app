import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Outlet, useOutletContext, useParams } from "react-router";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "~/lib/firebase";
import { useAuth } from "~/context/AuthContext";
import TopBar from "~/components/TopBar";
import Sidebar from "~/components/Sidebar";
import { allModules } from "~/data";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const [quizScores, setQuizScores] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const params = useParams();

  // Load progress from Firestore on mount
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.progress) setProgress(data.progress);
        if (data.quizScores) setQuizScores(data.quizScores);
      }
      setLoaded(true);
    });
  }, [user]);

  // Wrap setProgress to also write to Firestore immediately
  const setProgressAndSync = useCallback(
    (updater) => {
      setProgress((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (user && loaded) {
          updateDoc(doc(db, "users", user.uid), { progress: next });
        }
        return next;
      });
    },
    [user, loaded]
  );

  const overallProgress = useMemo(() => {
    if (allModules.length === 0) return 0;
    const completed = Object.values(progress).filter(Boolean).length;
    return (completed / allModules.length) * 100;
  }, [progress]);

  function handleToggleSidebar() {
    setSidebarOpen((prev) => !prev);
  }

  function handleCloseSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-surface">
      <TopBar
        progress={overallProgress}
        onToggleSidebar={handleToggleSidebar}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        currentSubjectId={params.subjectId}
        currentModuleId={params.moduleId}
        progress={progress}
      />

      <main className="pt-16 lg:ml-72 min-h-screen">
        <Outlet context={{ progress, setProgress: setProgressAndSync, quizScores, setQuizScores }} />
      </main>
    </div>
  );
}

export function useDashboardContext() {
  return useOutletContext();
}
