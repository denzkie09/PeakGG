interface MatchRowProps {
  map: string;
  agent?: string;
  champion?: string;
  result: "win" | "loss" | "draw";
  kills: number;
  deaths: number;
  assists: number;
  extra?: string;
  time: string;
}

export default function MatchRow({ map, agent, champion, result, kills, deaths, assists, extra, time }: MatchRowProps) {
  const isWin = result === "win";
  const isDraw = result === "draw";

  const resultColor = isWin ? "var(--accent-green)" : isDraw ? "var(--text-tertiary)" : "var(--accent-red)";
  const resultBg = isWin ? "rgba(52,211,153,0.08)" : isDraw ? "rgba(255,255,255,0.04)" : "rgba(248,113,113,0.08)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Result indicator */}
      <div
        style={{
          width: 3,
          height: 32,
          borderRadius: 99,
          background: resultColor,
          flexShrink: 0,
        }}
      />

      {/* Agent/Champion icon placeholder */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: "var(--text-tertiary)",
          flexShrink: 0,
          fontFamily: "var(--font-mono)",
        }}
      >
        {(agent || champion || "?").slice(0, 2).toUpperCase()}
      </div>

      {/* Map + agent */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {map}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
          {agent || champion}
        </div>
      </div>

      {/* KDA */}
      <div style={{ textAlign: "center", fontFamily: "var(--font-mono)" }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>
          <span style={{ color: "var(--accent-green)" }}>{kills}</span>
          <span style={{ color: "var(--text-tertiary)", margin: "0 2px" }}>/</span>
          <span style={{ color: "var(--accent-red)" }}>{deaths}</span>
          <span style={{ color: "var(--text-tertiary)", margin: "0 2px" }}>/</span>
          <span>{assists}</span>
        </div>
        {extra && <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{extra}</div>}
      </div>

      {/* Result badge + time */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 99,
            background: resultBg,
            color: resultColor,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}
        >
          {result}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{time}</div>
      </div>
    </div>
  );
}
