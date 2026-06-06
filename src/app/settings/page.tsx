"use client";

import { useState } from "react";
import { DEFAULTS, useSettings, type Settings, type Theme, type AccentColor, type DefaultGame, type MatchCount, type Region } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { Check, RotateCcw, User, Palette, LayoutDashboard, Shield } from "lucide-react";

// ── Reusable setting row ──────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} style={{ color: "var(--accent-purple)" }} />
        </div>
        <h2 className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>{title}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: value ? "var(--accent-purple)" : "var(--bg-elevated)",
        border: `1px solid ${value ? "var(--accent-purple)" : "var(--border-default)"}`,
        cursor: "pointer", position: "relative", transition: "all 0.2s",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2,
        left: value ? 22 : 2,
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

function Select<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as T)}
      style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)", color: "var(--text-primary)",
        padding: "7px 12px", fontSize: 13, cursor: "pointer",
        fontFamily: "var(--font-body)", outline: "none", minWidth: 140,
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { settings, update, reset } = useSettings();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<Settings>(settings);

  const changeDraft = (patch: Partial<Settings>) => {
    setDraft(prev => ({ ...prev, ...patch }));
    setSaved(false);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(settings);

  const handleSave = () => {
    update(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    reset();
    setDraft(DEFAULTS);
    setSaved(false);
  };

  const ACCENT_OPTIONS: { color: AccentColor; hex: string; label: string }[] = [
    { color: "purple", hex: "#a78bfa", label: "Purple"   },
    { color: "val",    hex: "#ff4655", label: "Valorant" },
    { color: "lol",    hex: "#c89b3c", label: "League"   },
    { color: "cs2",    hex: "#e06b30", label: "CS2"      },
    { color: "dota2",  hex: "#e05c30", label: "Dota 2"   },
  ];

  const AVATAR_COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#f472b6", "#ff4655", "#c89b3c", "#e06b30"];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 720, width: "100%" }}>

      {/* Header */}
      <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Settings</h1>
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, marginTop: 2 }}>Manage your preferences and account</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleReset}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges && !saved}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: "var(--radius-md)", border: "none", background: "var(--accent-purple)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: hasChanges ? "pointer" : "default", opacity: hasChanges || saved ? 1 : 0.55, transition: "opacity 0.15s" }}
          >
            {saved ? <><Check size={13} /> Saved!</> : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── PROFILE ── */}
      <Section title="Profile" icon={User}>
        <SettingRow label="Display Name" description="Shown across the app and on your profile">
          <input
            value={draft.displayName}
            onChange={e => changeDraft({ displayName: e.target.value })}
            style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)", color: "var(--text-primary)",
              padding: "7px 12px", fontSize: 13, fontFamily: "var(--font-body)",
              outline: "none", width: 200,
            }}
          />
        </SettingRow>

        <SettingRow label="Avatar Color" description="Color used for your avatar initials">
          <div style={{ display: "flex", gap: 8 }}>
            {AVATAR_COLORS.map(c => (
              <button
                key={c}
                onClick={() => changeDraft({ avatarColor: c })}
                style={{
                  width: 28, height: 28, borderRadius: "50%", background: c,
                  border: draft.avatarColor === c ? "2px solid var(--text-primary)" : "2px solid transparent",
                  cursor: "pointer", outline: "none",
                  boxShadow: draft.avatarColor === c ? `0 0 0 2px var(--bg-base), 0 0 0 4px ${c}` : "none",
                  transition: "all 0.15s",
                }}
              />
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Region" description="Your primary gaming region">
          <Select<Region>
            value={draft.region}
            onChange={v => changeDraft({ region: v })}
            options={[
              { value: "NA",    label: "North America" },
              { value: "EU",    label: "Europe"        },
              { value: "AP",    label: "Asia Pacific"  },
              { value: "KR",    label: "Korea"         },
              { value: "BR",    label: "Brazil"        },
              { value: "LATAM", label: "Latin America" },
              { value: "OCE",   label: "Oceania"       },
            ]}
          />
        </SettingRow>

        {/* Connected accounts */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Connected Accounts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Riot Account", color: "#ff4655", connected: user?.provider === "riot", name: user?.provider === "riot" ? `${user.username}#${user.tagline ?? ""}` : null },
              { label: "Steam Account", color: "#c2c2c2", connected: user?.provider === "steam", name: user?.provider === "steam" ? user.username : null },
            ].map(acc => (
              <div key={acc.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: acc.connected ? acc.color : "var(--text-tertiary)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{acc.label}</div>
                  {acc.name && <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{acc.name}</div>}
                </div>
                <span style={{ fontSize: 11, color: acc.connected ? acc.color : "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                  {acc.connected ? "linked" : "not linked"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── APPEARANCE ── */}
      <Section title="Appearance" icon={Palette}>
        <SettingRow label="Theme" description="Choose your preferred color scheme">
          <div style={{ display: "flex", gap: 6, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 4 }}>
            {(["dark", "light", "system"] as Theme[]).map(t => (
              <button
                key={t}
                onClick={() => changeDraft({ theme: t })}
                style={{
                  padding: "6px 14px", borderRadius: "var(--radius-md)",
                  border: draft.theme === t ? "1px solid var(--border-default)" : "1px solid transparent",
                  background: draft.theme === t ? "var(--bg-card)" : "transparent",
                  color: draft.theme === t ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: 12, fontFamily: "var(--font-display)", fontWeight: draft.theme === t ? 600 : 400,
                  cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s",
                }}
              >{t}</button>
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Accent Color" description="Primary color used across the interface">
          <div style={{ display: "flex", gap: 8 }}>
            {ACCENT_OPTIONS.map(a => (
              <button
                key={a.color}
                onClick={() => changeDraft({ accentColor: a.color })}
                title={a.label}
                style={{
                  width: 28, height: 28, borderRadius: "var(--radius-sm)", background: a.hex,
                  border: draft.accentColor === a.color ? "2px solid var(--text-primary)" : "2px solid transparent",
                  cursor: "pointer", outline: "none",
                  boxShadow: draft.accentColor === a.color ? `0 0 0 2px var(--bg-base), 0 0 0 4px ${a.hex}` : "none",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {draft.accentColor === a.color && <Check size={12} color="#fff" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Compact Mode" description="Reduce spacing for a more data-dense layout">
          <Toggle value={draft.compactMode} onChange={v => changeDraft({ compactMode: v })} />
        </SettingRow>
      </Section>

      {/* ── DASHBOARD PREFERENCES ── */}
      <Section title="Dashboard Preferences" icon={LayoutDashboard}>
        <SettingRow label="Default Game" description="Which game loads first when you open the dashboard">
          <Select<DefaultGame>
            value={draft.defaultGame}
            onChange={v => changeDraft({ defaultGame: v })}
            options={[
              { value: "valorant", label: "Valorant"          },
              { value: "league",   label: "League of Legends" },
              { value: "cs2",      label: "CS2"               },
              { value: "dota2",    label: "Dota 2"            },
            ]}
          />
        </SettingRow>

        <SettingRow label="Recent Matches to Show" description="Number of matches displayed in match history">
          <Select<string>
            value={String(draft.matchCount)}
            onChange={v => changeDraft({ matchCount: Number(v) as MatchCount })}
            options={[
              { value: "5",  label: "5 matches"  },
              { value: "10", label: "10 matches" },
              { value: "20", label: "20 matches" },
            ]}
          />
        </SettingRow>

        <SettingRow label="Show Rank Banner" description="Display your current rank at the top of game pages">
          <Toggle value={draft.showRankBanner} onChange={v => changeDraft({ showRankBanner: v })} />
        </SettingRow>

        <SettingRow label="Show Radar Chart" description="Display the skill overview radar on game pages">
          <Toggle value={draft.showRadarChart} onChange={v => changeDraft({ showRadarChart: v })} />
        </SettingRow>

        <SettingRow label="Show Map Stats" description="Display map performance section on game pages">
          <Toggle value={draft.showMapStats} onChange={v => changeDraft({ showMapStats: v })} />
        </SettingRow>
      </Section>

      {/* ── PRIVACY ── */}
      <Section title="Privacy" icon={Shield}>
        <div style={{ padding: "14px 16px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Privacy controls like profile visibility and search preferences will be available once the account database is set up.
            For now your profile is visible to anyone who visits the site.
          </div>
        </div>
      </Section>

      {/* Bottom save button */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
        <button
          onClick={handleSave}
          disabled={!hasChanges && !saved}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 28px", borderRadius: "var(--radius-md)", border: "none", background: "var(--accent-purple)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: hasChanges ? "pointer" : "default", opacity: hasChanges || saved ? 1 : 0.55 }}
        >
          {saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
