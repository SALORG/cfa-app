import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";

export default function Admin() {
  const { isAdmin } = useAuth();
  const [searchEmail, setSearchEmail] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [updating, setUpdating] = useState(null);

  if (!isAdmin) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-20 text-center">
        <div className="bg-surface-secondary rounded-2xl border border-border p-10">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h2>
          <p className="text-text-secondary mb-6">You do not have admin access.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    setSearching(true);
    setResults([]);

    try {
      const { collection, query, where, getDocs } = await import("firebase/firestore/lite");
      const { db } = await import("~/lib/firebase");
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", searchEmail.trim().toLowerCase()));
      const snapshot = await getDocs(q);

      const users = [];
      snapshot.forEach((docSnap) => {
        users.push({ uid: docSnap.id, ...docSnap.data() });
      });

      setResults(users);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  }

  async function togglePremium(uid, currentPlan) {
    setUpdating(uid);
    try {
      const { doc, updateDoc } = await import("firebase/firestore/lite");
      const { db } = await import("~/lib/firebase");
      const userRef = doc(db, "users", uid);
      const isCurrentlyPremium = currentPlan === "premium";

      await updateDoc(userRef, {
        "subscription.plan": isCurrentlyPremium ? "free" : "premium",
        "subscription.status": isCurrentlyPremium ? null : "active",
        "subscription.updatedAt": new Date().toISOString(),
      });

      // Update local results
      setResults((prev) =>
        prev.map((u) =>
          u.uid === uid
            ? {
                ...u,
                subscription: {
                  ...u.subscription,
                  plan: isCurrentlyPremium ? "free" : "premium",
                  status: isCurrentlyPremium ? null : "active",
                },
              }
            : u
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
          <Link to="/dashboard" className="hover:text-accent">
            Dashboard
          </Link>
          <span>/</span>
          <span>Admin</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
        <p className="text-sm text-text-muted mt-1">
          Search users by email and manage their subscription status.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Search by email address..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={searching}
          className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((user) => {
            const plan = user.subscription?.plan || "free";
            const status = user.subscription?.status;
            const isPremium = plan === "premium" && status === "active";

            return (
              <div
                key={user.uid}
                className="bg-surface-secondary rounded-xl border border-border p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    UID: {user.uid}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isPremium
                          ? "bg-accent/20 text-accent"
                          : "bg-surface-tertiary text-text-muted"
                      }`}
                    >
                      {isPremium ? "Premium" : "Free"}
                    </span>
                    {user.subscription?.updatedAt && (
                      <span className="text-[10px] text-text-muted">
                        Updated: {new Date(user.subscription.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => togglePremium(user.uid, plan)}
                  disabled={updating === user.uid}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    isPremium
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                      : "bg-accent text-white hover:bg-accent-hover"
                  }`}
                >
                  {updating === user.uid
                    ? "Updating..."
                    : isPremium
                      ? "Revoke Premium"
                      : "Grant Premium"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {results.length === 0 && searchEmail && !searching && (
        <div className="text-center py-12 text-text-muted text-sm">
          No users found for "{searchEmail}"
        </div>
      )}
    </div>
  );
}
