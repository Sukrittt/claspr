import React from "react";

// Claspr dark theme palette
const BG = "#191919";
const BG_ELEVATED = "#262626";
const BG_HOVER = "#2F2F2F";
const BORDER = "#2D2D2D";
const FG = "#D6D6D6";
const FG_MUTED = "#636363";
const ACCENT = "#2578CA";
const DESTRUCTIVE = "#EB5757";

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: BG_ELEVATED,
      borderRadius: 20,
      padding: 28,
      border: `1px solid ${BORDER}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Badge: React.FC<{
  text: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, color = ACCENT, style }) => (
  <div
    style={{
      display: "inline-flex",
      backgroundColor: color + "18",
      color,
      borderRadius: 12,
      padding: "8px 18px",
      fontSize: 22,
      fontWeight: 600,
      ...style,
    }}
  >
    {text}
  </div>
);

export const Avatar: React.FC<{
  name: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ name, color = ACCENT, size = 56, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: size * 0.4,
      fontWeight: 700,
      ...style,
    }}
  >
    {name[0].toUpperCase()}
  </div>
);

export const TabBar: React.FC<{
  tabs: string[];
  activeIndex: number;
  style?: React.CSSProperties;
}> = ({ tabs, activeIndex, style }) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      ...style,
    }}
  >
    {tabs.map((tab, i) => (
      <div
        key={tab}
        style={{
          padding: "10px 24px",
          borderRadius: 12,
          fontSize: 22,
          fontWeight: 600,
          backgroundColor: i === activeIndex ? FG : BG_HOVER,
          color: i === activeIndex ? BG : FG_MUTED,
        }}
      >
        {tab}
      </div>
    ))}
  </div>
);

export const StatusBadge: React.FC<{
  status: string;
  style?: React.CSSProperties;
}> = ({ status, style }) => {
  const colors: Record<string, { bg: string; fg: string }> = {
    Pending: { bg: "#3A3520", fg: "#F5C542" },
    Approved: { bg: "#1A3A2A", fg: "#34D399" },
    Submitted: { bg: "#1A2A3A", fg: "#60A5FA" },
  };
  const c = colors[status] || colors.Pending;
  return (
    <div
      style={{
        display: "inline-flex",
        backgroundColor: c.bg,
        color: c.fg,
        borderRadius: 10,
        padding: "6px 16px",
        fontSize: 20,
        fontWeight: 600,
        ...style,
      }}
    >
      {status}
    </div>
  );
};

export { BG, BG_ELEVATED, BG_HOVER, BORDER, FG, FG_MUTED, ACCENT, DESTRUCTIVE };
