import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Card, Avatar, BG, BG_ELEVATED, BG_HOVER, FG, FG_MUTED, BORDER, ACCENT } from "../components/MockUI";
import { Cursor } from "../components/Cursor";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const NOTE_LINES = [
  { type: "h1", text: "Introduction to Algorithms" },
  { type: "p", text: "An algorithm is a step-by-step procedure for solving a problem." },
  { type: "h2", text: "Key Concepts" },
  { type: "bullet", text: "Time complexity — Big O notation" },
  { type: "bullet", text: "Space complexity analysis" },
  { type: "bullet", text: "Divide and conquer strategies" },
];

const REACTIONS = ["👍", "🔥", "💡", "❤️"];

const FOLDERS = [
  { name: "Lecture Notes", count: 12, emoji: "📝" },
  { name: "Study Guides", count: 5, emoji: "📚" },
  { name: "Resources", count: 8, emoji: "🔗" },
];

export const NotesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        fontFamily,
        padding: 48,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <div
        style={{
          marginTop: 120,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 700, color: FG }}>
          Notes & Discussions
        </div>
        <div style={{ fontSize: 24, color: FG_MUTED, marginTop: 8 }}>
          Collaborate and share knowledge
        </div>
      </div>

      {/* Rich text editor mock */}
      <div style={{ marginTop: 32 }}>
        <Card style={{ padding: 28 }}>
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              gap: 16,
              paddingBottom: 16,
              borderBottom: `1px solid ${BORDER}`,
              marginBottom: 20,
              fontSize: 22,
              color: FG_MUTED,
            }}
          >
            {["B", "I", "U", "H1", "H2", "•"].map((btn) => (
              <div
                key={btn}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: BG_HOVER,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: btn === "B" ? 700 : 400,
                  fontStyle: btn === "I" ? "italic" : "normal",
                  textDecoration: btn === "U" ? "underline" : "none",
                  color: FG_MUTED,
                }}
              >
                {btn}
              </div>
            ))}
          </div>

          {/* Content appearing line by line */}
          {NOTE_LINES.map((line, i) => {
            const lineDelay = 15 + i * 15;
            const lineOpacity = interpolate(frame, [lineDelay, lineDelay + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const lineX = interpolate(frame, [lineDelay, lineDelay + 10], [30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const style: React.CSSProperties = {
              opacity: lineOpacity,
              transform: `translateX(${lineX}px)`,
              marginBottom: 8,
              color: FG,
            };

            if (line.type === "h1") {
              return <div key={i} style={{ ...style, fontSize: 30, fontWeight: 700 }}>{line.text}</div>;
            }
            if (line.type === "h2") {
              return <div key={i} style={{ ...style, fontSize: 24, fontWeight: 600, marginTop: 12 }}>{line.text}</div>;
            }
            if (line.type === "bullet") {
              return (
                <div key={i} style={{ ...style, fontSize: 21, paddingLeft: 20, display: "flex", gap: 8 }}>
                  <span style={{ color: ACCENT }}>•</span>
                  {line.text}
                </div>
              );
            }
            return <div key={i} style={{ ...style, fontSize: 21, lineHeight: 1.6 }}>{line.text}</div>;
          })}
        </Card>
      </div>

      {/* Discussion thread */}
      <div style={{ marginTop: 24 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Avatar name="Sarah" color="#E879A0" size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: FG }}>Sarah K.</div>
              <div style={{ fontSize: 19, color: FG_MUTED, marginTop: 4, lineHeight: 1.5 }}>
                Great notes! The divide and conquer section really helped me understand merge sort.
              </div>
              {/* Emoji reactions */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {REACTIONS.map((emoji, i) => {
                  const reactionSpring = spring({
                    frame: frame - 110 - i * 6,
                    fps,
                    config: { damping: 8 },
                  });
                  return (
                    <div
                      key={emoji}
                      style={{
                        transform: `scale(${reactionSpring})`,
                        padding: "4px 12px",
                        borderRadius: 20,
                        backgroundColor: BG_HOVER,
                        border: `1px solid ${BORDER}`,
                        fontSize: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {emoji}
                      <span style={{ fontSize: 16, color: FG_MUTED }}>
                        {[3, 5, 2, 4][i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Cursor
        keyframes={[
          { frame: 5, x: 800, y: 250 },
          { frame: 15, x: 110, y: 275, click: true },
          { frame: 25, x: 195, y: 275, click: true },
          { frame: 60, x: 400, y: 500 },
          { frame: 105, x: 200, y: 850 },
          { frame: 115, x: 200, y: 870, click: true },
          { frame: 130, x: 290, y: 870, click: true },
        ]}
      />

      {/* Folder organization */}
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        {FOLDERS.map((folder, i) => {
          const folderSpring = spring({
            frame: frame - 130 - i * 10,
            fps,
            config: { damping: 10 },
          });
          return (
            <div
              key={folder.name}
              style={{
                flex: 1,
                transform: `scale(${folderSpring})`,
                backgroundColor: BG_ELEVATED,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: 18,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32 }}>{folder.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: FG, marginTop: 6 }}>
                {folder.name}
              </div>
              <div style={{ fontSize: 14, color: FG_MUTED }}>{folder.count} items</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
