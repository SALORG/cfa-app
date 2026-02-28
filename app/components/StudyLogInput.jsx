import { useState } from "react";
import { Flame } from "lucide-react";
import { trackCustomEvent } from "~/lib/analytics";

function getToday() {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

function calculateStreak(studyLogs) {
  if (!studyLogs || studyLogs.length === 0) return 0;

  const sorted = [...studyLogs]
    .filter((l) => l.hours > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) return 0;

  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");

  // Streak must include today or yesterday
  if (sorted[0].date !== today && sorted[0].date !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prevDay = new Date(sorted[i - 1].date + "T00:00:00");
    const currDay = new Date(sorted[i].date + "T00:00:00");
    const diffDays = (prevDay - currDay) / 86400000;
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function StudyLogInput({ studyLogs, setStudyLogs, onGuestAction, onAfterLog }) {
  const today = getToday();
  const [inputHours, setInputHours] = useState("");
  const [inputDate, setInputDate] = useState(today);

  const selectedLog = studyLogs.find((l) => l.date === inputDate);
  const streak = calculateStreak(studyLogs);
  const totalHours = studyLogs.reduce((sum, l) => sum + (l.hours || 0), 0);
  const daysStudied = studyLogs.filter((l) => l.hours > 0).length;
  const avgHours = daysStudied > 0 ? Math.round((totalHours / daysStudied) * 10) / 10 : 0;
  const todayLog = studyLogs.find((l) => l.date === today);

  function handleLog() {
    if (onGuestAction) { onGuestAction(); return; }
    const hours = parseFloat(inputHours);
    if (isNaN(hours) || hours <= 0) return;

    // Upsert: replace existing entry for selected date
    const updated = studyLogs.filter((l) => l.date !== inputDate);
    updated.push({ date: inputDate, hours });
    setStudyLogs(updated);
    setInputHours("");

    trackCustomEvent("StudyHoursLogged", { hours, date: inputDate });
    if (onAfterLog) onAfterLog();
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Log Study Hours
      </h3>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 rounded-lg px-3 py-1.5 text-sm font-semibold">
          <Flame size={16} />
          {streak} day{streak !== 1 ? "s" : ""}
        </div>
        <div className="text-xs text-text-muted">
          {Math.round(totalHours * 10) / 10}h total
        </div>
        <div className="text-xs text-text-muted">
          {avgHours}h/day avg
        </div>
      </div>

      {/* Today's status */}
      {todayLog && (
        <p className="text-sm text-success mb-3">
          Today: {todayLog.hours}h logged
        </p>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="date"
          max={today}
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="bg-surface-tertiary border border-border rounded-lg px-2 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/50"
        />
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={inputHours}
          onChange={(e) => setInputHours(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLog()}
          placeholder={selectedLog ? `${selectedLog.hours}h logged` : "Hours"}
          className="flex-1 min-w-0 bg-surface-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
        />
        <button
          onClick={handleLog}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors shrink-0"
        >
          Log
        </button>
      </div>
    </div>
  );
}
