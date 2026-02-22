function buildHeatmapData(studyLogs) {
  const hoursMap = Object.fromEntries(
    (studyLogs || []).map((l) => [l.date, l.hours])
  );

  const today = new Date();
  const todayDay = today.getDay(); // 0=Sun, 1=Mon...
  // End of grid = this Saturday (end of current week)
  const endOffset = todayDay === 0 ? 0 : 6 - todayDay; // days until Saturday
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + endOffset);

  // 12 weeks = 84 days
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 83);

  const cells = [];
  for (let i = 0; i < 84; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("en-CA");
    const isFuture = d > today;
    cells.push({
      date: dateStr,
      hours: isFuture ? null : hoursMap[dateStr] || 0,
      dayOfWeek: d.getDay(),
      month: d.getMonth(),
    });
  }
  return cells;
}

function getOpacity(hours) {
  if (hours === null) return 0.05;
  if (hours === 0) return 1; // for the empty color
  if (hours <= 1) return 0.35;
  if (hours <= 2) return 0.55;
  if (hours <= 3) return 0.8;
  return 1;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function StudyHeatmap({ studyLogs }) {
  const cells = buildHeatmapData(studyLogs);
  const cellSize = 13;
  const cellGap = 2;
  const leftMargin = 18;
  const topMargin = 16;
  const totalWidth = leftMargin + 12 * (cellSize + cellGap);
  const totalHeight = topMargin + 7 * (cellSize + cellGap);

  // Month labels — find where months change
  const monthLabels = [];
  for (let col = 0; col < 12; col++) {
    const cellIndex = col * 7;
    if (cellIndex < cells.length) {
      const month = cells[cellIndex].month;
      if (col === 0 || cells[(col - 1) * 7]?.month !== month) {
        monthLabels.push({
          col,
          label: MONTH_NAMES[month],
        });
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="w-full"
      role="img"
      aria-label="Study activity heatmap"
    >
      {/* Month labels */}
      {monthLabels.map(({ col, label }) => (
        <text
          key={`month-${col}`}
          x={leftMargin + col * (cellSize + cellGap)}
          y={10}
          fill="var(--color-text-muted)"
          style={{ fontSize: "8px" }}
        >
          {label}
        </text>
      ))}

      {/* Day labels */}
      {[1, 3, 5].map((day) => (
        <text
          key={`day-${day}`}
          x={0}
          y={topMargin + day * (cellSize + cellGap) + cellSize - 3}
          fill="var(--color-text-muted)"
          style={{ fontSize: "8px" }}
        >
          {DAY_LABELS[day]}
        </text>
      ))}

      {/* Cells */}
      {cells.map((cell, i) => {
        const col = Math.floor(i / 7);
        const row = i % 7;
        const x = leftMargin + col * (cellSize + cellGap);
        const y = topMargin + row * (cellSize + cellGap);
        const isStudied = cell.hours !== null && cell.hours > 0;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx={2.5}
            fill={
              isStudied
                ? "var(--color-accent)"
                : "var(--color-surface-tertiary)"
            }
            opacity={isStudied ? getOpacity(cell.hours) : cell.hours === null ? 0.3 : 1}
          >
            <title>
              {cell.date}: {cell.hours === null ? "—" : `${cell.hours}h`}
            </title>
          </rect>
        );
      })}
    </svg>
  );
}
