"use client";

import { use } from "react";
import Link from "next/link";
import { MOCK_DOTA2_STATS } from "@/lib/mock/data";
import { ArrowLeft } from "lucide-react";

const DOTA_COLOR  = "#e05c30";
const DOTA_ACCENT = "#f09b3a";

export default function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const match = MOCK_DOTA2_STATS.recentMatches.find(m => m.matchId === matchId);

  if (!match) {
    return (
      <div style={{ padding: "40px 32px", color: "var(--text-tertiary)" }}>
        Match not found. <Link href="/games/dota2" style={{ color: DOTA_COLOR }}>Go back</Link>
      </div>
    );
  }

  const resultColor = match.result === "win" ? "var(--accent-green)" : "var(--accent-red)";

  // Group skill timeline by skill name for display
  const skillGroups: Record<string, number[]> = {};
  match.skillTimeline.forEach(s => {
    if (!skillGroups[s.skillName]) skillGroups[s.skillName] = [];
    skillGroups[s.skillName].push(s.minute);
  });

  // All minutes in the timeline for the x-axis
  const maxMinute = Math.max(...match.skillTimeline.map(s => s.minute));
  const minutes = Array.from({ length: maxMinute + 1 }, (_, i) => i);

  return (
    <div style={{ padding: "28px 32px", width: "100%" }}>

      {/* Back + header */}
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <Link href="/games/dota2" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-tertiary)", textDecoration: "none", fontSize: 13, marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Dota 2
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: `${DOTA_COLOR}20`, border: `1px solid ${DOTA_COLOR}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: DOTA_COLOR, fontFamily: "var(--font-display)" }}>
            {match.hero.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700 }}>{match.hero}</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <span className="stat-pill">{match.role}</span>
              <span className="stat-pill">{match.durationMinutes} min</span>
              <span className="stat-pill">{match.playedAt}</span>
              <span style={{ padding: "2px 10px", borderRadius: 99, background: match.result === "win" ? "rgba(52,211,153,0.10)" : "rgba(248,113,113,0.10)", color: resultColor, fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                {match.result}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core stats row */}
      <div className="fade-up-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "KDA",         value: `${match.kills} / ${match.deaths} / ${match.assists}` },
          { label: "GPM / XPM",   value: `${match.gpm} / ${match.xpm}`, color: DOTA_ACCENT },
          { label: "Last Hits",   value: `${match.lastHits} / ${match.denies}d` },
          { label: "Net Worth",   value: `${(match.netWorth / 1000).toFixed(1)}k` },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "14px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)", marginBottom: 6 }}>{s.label}</div>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: s.color ?? "var(--text-primary)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Damage / healing row */}
      <div className="fade-up-delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Hero Damage",   value: match.heroDamage.toLocaleString(),  color: "var(--accent-red)"   },
          { label: "Tower Damage",  value: match.towerDamage.toLocaleString(), color: DOTA_ACCENT           },
          { label: "Healing Done",  value: match.healingDone.toLocaleString(), color: "var(--accent-green)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "14px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)", marginBottom: 6 }}>{s.label}</div>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Items + Skill timeline grid */}
      <div className="fade-up-delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16 }}>

        {/* Items */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Items</h2>

          {/* Final build */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)", marginBottom: 10 }}>Final Build</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {match.items.map(item => (
                <div key={item.id} style={{ background: "var(--bg-elevated)", border: `1px solid ${DOTA_COLOR}25`, borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: DOTA_ACCENT, fontFamily: "var(--font-mono)" }}>{item.cost.toLocaleString()}g</div>
                </div>
              ))}
            </div>
          </div>

          {/* Item buy timeline */}
          <div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)", marginBottom: 10 }}>Buy Timeline</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...match.items].sort((a, b) => a.boughtAt - b.boughtAt).map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", width: 32, flexShrink: 0 }}>{item.boughtAt}m</div>
                  <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: DOTA_ACCENT, fontFamily: "var(--font-mono)" }}>{item.cost.toLocaleString()}g</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill timeline */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <h2 className="font-display" style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Skill Build Timeline</h2>

          {/* Visual grid */}
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <div style={{ minWidth: 480 }}>
              {/* Skill rows */}
              {Object.entries(skillGroups).map(([skillName, skillMinutes]) => (
                <div key={skillName} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 6 }}>
                  <div style={{ width: 130, fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", flexShrink: 0, paddingRight: 8 }}>
                    {skillName}
                  </div>
                  <div style={{ flex: 1, display: "flex", gap: 2 }}>
                    {minutes.map(min => {
                      const pickedHere = skillMinutes.includes(min);
                      return (
                        <div
                          key={min}
                          title={pickedHere ? `${skillName} @ ${min}m` : undefined}
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            background: pickedHere ? DOTA_COLOR : "var(--bg-elevated)",
                            border: `1px solid ${pickedHere ? DOTA_COLOR : "var(--border-subtle)"}`,
                            flexShrink: 0,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Minute labels */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 6 }}>
                <div style={{ width: 130, flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", gap: 2 }}>
                  {minutes.map(min => (
                    <div key={min} style={{ width: 14, textAlign: "center", fontSize: 8, color: min % 5 === 0 ? "var(--text-tertiary)" : "transparent", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                      {min}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skill order list */}
          <div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-mono)", marginBottom: 10 }}>Skill Order</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {match.skillTimeline.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "4px 8px" }}>
                  <span style={{ fontSize: 10, color: DOTA_COLOR, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{s.minute}m</span>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.skillName}</span>
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>Lv{s.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
