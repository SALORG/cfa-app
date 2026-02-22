function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toLocaleDateString("en-CA"));
  }
  return days;
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
}

export default function WeeklyBarChart({ studyLogs }) {
  const days = getLast7Days();
  const hoursMap = Object.fromEntries(
    (studyLogs || []).map((l) => [l.date, l.hours])
  );
  const data = days.map((d) => ({ date: d, hours: hoursMap[d] || 0 }));
  const maxHours = Math.max(4, ...data.map((d) => d.hours));

  const barWidth = 28;
  const gap = 12;
  const chartHeight = 90;
  const totalWidth = 7 * barWidth + 6 * gap;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 130`}
      className="w-full"
      role="img"
      aria-label="Weekly study hours bar chart"
    >
      {data.map((d, i) => {
        const barHeight = (d.hours / maxHours) * chartHeight;
        const x = i * (barWidth + gap);
        const y = chartHeight - barHeight;
        const isToday = d.date === new Date().toLocaleDateString("en-CA");

        return (
          <g key={d.date}>
            {/* Bar */}
            <rect
              x={x}
              y={d.hours > 0 ? y : chartHeight - 3}
              width={barWidth}
              height={d.hours > 0 ? barHeight : 3}
              rx={4}
              fill="var(--color-accent)"
              opacity={d.hours > 0 ? 1 : 0.15}
            />
            {/* Hours label */}
            {d.hours > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fill="var(--color-text-primary)"
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                {d.hours}h
              </text>
            )}
            {/* Day label */}
            <text
              x={x + barWidth / 2}
              y={chartHeight + 16}
              textAnchor="middle"
              fill={
                isToday
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)"
              }
              style={{
                fontSize: "11px",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {formatDayLabel(d.date)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
