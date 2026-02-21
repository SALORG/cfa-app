import { useState, useMemo, useEffect, useRef } from "react";
import { Outlet, useOutletContext, useParams } from "react-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "~/lib/firebase";
import { useAuth } from "~/context/AuthContext";
import TopBar from "~/components/TopBar";
import Sidebar from "~/components/Sidebar";
import { allModules } from "~/data";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const [loaded, setLoaded] = useState(false);
  const params = useParams();
  const debounceTimer = useRef(null);

  // Load progress from Firestore on mount
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists() && snap.data().progress) {
        setProgress(snap.data().progress);
      }
      setLoaded(true);
    });
  }, [user]);

  // Debounced write to Firestore on progress changes
  useEffect(() => {
    if (!loaded || !user) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateDoc(doc(db, "users", user.uid), { progress });
    }, 1000);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [progress, user, loaded]);

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
        <Outlet context={{ progress, setProgress }} />
      </main>
    </div>
  );
}

export function useDashboardContext() {
  return useOutletContext();
}
