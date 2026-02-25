import { Outlet } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { GuestProvider } from "~/context/GuestContext";

export default function ProtectedLayout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GuestProvider>
      <Outlet />
    </GuestProvider>
  );
}
