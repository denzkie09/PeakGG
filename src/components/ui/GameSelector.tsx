"use client";

import type { Game } from "@/types";

const GAMES: { id: Game; label: string; shortLabel: string; color: string }[] = [
  { id: "valorant", label: "Valorant",          shortLabel: "VAL", color: "var(--accent-val)" },
  { id: "league",   label: "League of Legends", shortLabel: "LoL", color: "var(--accent-lol)" },
  { id: "cs2",      label: "CS2",               shortLabel: "CS2", color: "var(--accent-cs)"  },
  { id: "dota2",    label: "Dota 2",            shortLabel: "D2",  color: "#e05c30"            },
];

interface Props {
  value: Game;
  onChange: (g: Game) => void;
}

export default function GameSelector({ value, onChange }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 4,
      }}
    >
      {GAMES.map((g) => {
        const active = value === g.id;
        return (
          <button
            key={g.id}
            onClick={() => onChange(g.id)}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: active ? `1px solid ${g.color}30` : "1px solid transparent",
              background: active ? `${g.color}12` : "transparent",
              color: active ? g.color : "var(--text-secondary)",
              fontFamily: "var(--font-display)",
              fontWeight: active ? 600 : 400,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );
}
