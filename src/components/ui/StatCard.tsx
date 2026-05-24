interface Props {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  accentColor?: string;
}

export default function StatCard({ label, value, sub, trend, accentColor }: Props) {
  const trendColor =
    trend === "up" ? "var(--accent-green)" :
    trend === "down" ? "var(--accent-red)" :
    "var(--text-tertiary)";

  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "";

  return (
    <div
      className="card"
      style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}
    >
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          color: accentColor || "var(--text-primary)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: trend ? trendColor : "var(--text-tertiary)" }}>
          {trendArrow && <span style={{ marginRight: 2 }}>{trendArrow}</span>}
          {sub}
        </div>
      )}
    </div>
  );
}
