import { useState } from "react";
import "./App.css";

const drillModules = import.meta.glob("./drills/*/index.jsx", { eager: true });

const RANK_CONFIG = {
  "E-Rank": { color: "#4ade80", dim: "#166534", glow: "#4ade8022" },
  "D-Rank": { color: "#60a5fa", dim: "#1e3a8a", glow: "#60a5fa22" },
  "C-Rank": { color: "#c084fc", dim: "#581c87", glow: "#c084fc22" },
  "B-Rank": { color: "#fbbf24", dim: "#78350f", glow: "#fbbf2422" },
  "A-Rank": { color: "#f87171", dim: "#7f1d1d", glow: "#f8717122" },
  "S-Rank": { color: "#ffd700", dim: "#713f12", glow: "#ffd70033" },
};

function RankBadge({ rank }) {
  const r = RANK_CONFIG[rank] || RANK_CONFIG["E-Rank"];
  return (
    <span
      style={{
        background: r.glow,
        border: `1px solid ${r.dim}`,
        color: r.color,
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        fontFamily: "monospace",
        textTransform: "uppercase",
      }}
    >
      {rank}
    </span>
  );
}

function TopicTag({ label }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        background: "#ffffff08",
        color: "#94a3b8",
        borderRadius: 5,
        padding: "3px 9px",
        border: "1px solid #ffffff10",
        whiteSpace: "nowrap",
      }}
    >
      {label.replace(/^Skill:\s*/i, "")}
    </span>
  );
}

function QuestCard({ drill, onEnter }) {
  const r = RANK_CONFIG[drill.metadata.difficulty] || RANK_CONFIG["E-Rank"];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onEnter(drill.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#ffffff06" : "transparent",
        border: `1px solid ${hovered ? r.dim : "#ffffff0f"}`,
        borderRadius: 12,
        padding: "16px 24px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: hovered ? `0 0 24px ${r.glow}` : "none",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <RankBadge rank={drill.metadata.difficulty} />

      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#f1f5f9",
          minWidth: 220,
        }}
      >
        {drill.metadata.title}
      </span>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
        {drill.metadata.topics.map((t) => (
          <TopicTag key={t} label={t} />
        ))}
      </div>

      <span
        style={{
          fontSize: 11,
          color: "#ffffff20",
          fontFamily: "monospace",
          whiteSpace: "nowrap",
        }}
      >
        {drill.id.replace("./drills/", "").replace("/index.jsx", "")}
      </span>

      <span
        style={{
          color: hovered ? r.color : "#ffffff25",
          fontSize: 16,
          transition: "color 0.2s ease",
          flexShrink: 0,
        }}
      >
        →
      </span>
    </div>
  );
}

function Dashboard({ drills, onEnter }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        fontFamily: '"DM Sans", system-ui, sans-serif',
        color: "#f1f5f9",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0 32px",
          height: 56,
          borderBottom: "1px solid #ffffff0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "#09090bcc",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.01em",
            }}
          >
            ⚔ Feature Forge
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: "#4ade8088",
              background: "#4ade8011",
              border: "1px solid #4ade8022",
              padding: "2px 8px",
              borderRadius: 4,
              letterSpacing: "0.1em",
            }}
          >
            PHASE 2
          </span>
        </div>
        <span
          style={{ fontSize: 11, color: "#ffffff25", fontFamily: "monospace" }}
        >
          {drills.length} GATE{drills.length !== 1 ? "S" : ""} AVAILABLE
        </span>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: "72px 32px 48px",
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 11,
            fontFamily: "monospace",
            color: "#4ade80",
            background: "#4ade8011",
            border: "1px solid #4ade8022",
            padding: "4px 14px",
            borderRadius: 20,
            marginBottom: 20,
            letterSpacing: "0.12em",
          }}
        >
          PLAYER AWAKENING ACTIVE
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            margin: "0 0 16px",
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            lineHeight: 1.1,
          }}
        >
          Quest Log
        </h1>
        <p
          style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.6 }}
        >
          Each Gate is a production feature. Build it. The System evaluates. You
          evolve.
        </p>
      </div>

      {/* Grid */}
      <div style={{ padding: "0 32px 80px", maxWidth: 900, margin: "0 auto" }}>
        {drills.length === 0 ? (
          <div
            style={{
              padding: "48px 32px",
              borderRadius: 14,
              border: "1px dashed #ffffff10",
              color: "#334155",
              fontSize: 13,
              lineHeight: 2,
              fontFamily: "monospace",
              textAlign: "center",
            }}
          >
            <div>// no quests detected</div>
            <div>
              // drop a drill into{" "}
              <code style={{ color: "#4ade8055" }}>
                src/drills/name/index.jsx
              </code>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {drills.map((d) => (
              <QuestCard key={d.id} drill={d} onEnter={onEnter} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DrillPage({ drill, onBack }) {
  const r = RANK_CONFIG[drill.metadata.difficulty] || RANK_CONFIG["E-Rank"];
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        fontFamily: '"DM Sans", system-ui, sans-serif',
        color: "#f1f5f9",
      }}
    >
      <div
        style={{
          padding: "0 24px",
          height: 56,
          borderBottom: "1px solid #ffffff0f",
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "sticky",
          top: 0,
          background: "#09090bcc",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #ffffff15",
            background: "#ffffff08",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ffffff12";
            e.currentTarget.style.color = "#f1f5f9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff08";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          ← Back
        </button>
        <div style={{ width: 1, height: 20, background: "#ffffff10" }} />
        <RankBadge rank={drill.metadata.difficulty} />
        <span style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>
          {drill.metadata.title}
        </span>
      </div>

      <drill.Component />
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null);

  const drills = Object.entries(drillModules).map(([id, mod]) => ({
    id,
    metadata: mod.metadata,
    Component: mod.default,
  }));

  const active = drills.find((d) => d.id === activeId);

  if (active)
    return <DrillPage drill={active} onBack={() => setActiveId(null)} />;
  return <Dashboard drills={drills} onEnter={setActiveId} />;
}
