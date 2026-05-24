import type { MapStat } from "@/types";

interface Props {
  maps: MapStat[];
  accentColor?: string;
}

export default function MapStats({ maps, accentColor = "var(--accent-purple)" }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {maps.map((m) => (
        <div key={m.name}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{m.name}</span>
            <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: m.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)" }}>
              {m.winRate}% <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>({m.played}g)</span>
            </span>
          </div>
          <div
            style={{
              height: 4,
              borderRadius: 99,
              background: "var(--bg-elevated)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${m.winRate}%`,
                borderRadius: 99,
                background: m.winRate >= 50 ? "var(--accent-green)" : "var(--accent-red)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
