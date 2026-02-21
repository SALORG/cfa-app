import { useState, useMemo } from "react";
import { Outlet, useOutletContext, useParams, useNavigate } from "react-router";
import TopBar from "~/components/TopBar";
import Sidebar from "~/components/Sidebar";
import { allModules } from "~/data";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const params = useParams();
  const navigate = useNavigate();

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

  function handleSearch(query) {
    navigate(`/dashboard?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen bg-surface">
      <TopBar
        progress={overallProgress}
        onToggleSidebar={handleToggleSidebar}
        onSearch={handleSearch}
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
