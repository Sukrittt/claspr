import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Card, Avatar, Badge, TabBar, BG, FG, FG_MUTED, BORDER, ACCENT } from "../components/MockUI";
import { Cursor } from "../components/Cursor";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const STUDENTS = [
  { name: "Ava", color: "#E879A0" },
  { name: "Ben", color: "#60A5FA" },
  { name: "Cara", color: "#34D399" },
  { name: "Dan", color: "#FBBF24" },
  { name: "Eve", color: "#A78BFA" },
];

export const ClassroomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

  const cardSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15 },
  });
  const cardY = interpolate(cardSpring, [0, 1], [400, 0]);

  const codeOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tabSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 200 },
  });
  const tabY = interpolate(tabSpring, [0, 1], [60, 0]);

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
      {/* Section title */}
      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: FG,
          marginTop: 120,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
          opacity: titleSpring,
        }}
      >
        Classroom Management
      </div>

      <div
        style={{
          fontSize: 24,
          color: FG_MUTED,
          marginTop: 12,
          opacity: titleSpring,
        }}
      >
        Create & organize in seconds
      </div>

      {/* Classroom card */}
      <div
        style={{
          marginTop: 48,
          transform: `translateY(${cardY}px)`,
          opacity: cardSpring,
        }}
      >
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: FG }}>
                Computer Science 101
              </div>
              <div style={{ fontSize: 22, color: FG_MUTED, marginTop: 6 }}>
                Prof. Johnson
              </div>
            </div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: "#2F2F2F",
                border: `1px solid ${BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              🎓
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              opacity: codeOpacity,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Badge text="Class Code" />
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: ACCENT,
                letterSpacing: 4,
              }}
            >
              CS-2024
            </div>
          </div>
        </Card>
      </div>

      {/* Students joining */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 22, color: FG_MUTED, fontWeight: 600 }}>
          Students joining...
        </div>
        <div style={{ display: "flex", gap: -8 }}>
          {STUDENTS.map((student, i) => {
            const studentSpring = spring({
              frame: frame - 55 - i * 8,
              fps,
              config: { damping: 8 },
            });
            return (
              <div
                key={student.name}
                style={{
                  transform: `scale(${studentSpring}) translateX(${i * -8}px)`,
                  zIndex: STUDENTS.length - i,
                }}
              >
                <Avatar
                  name={student.name}
                  color={student.color}
                  size={64}
                  style={{
                    border: `3px solid ${BG}`,
                  }}
                />
              </div>
            );
          })}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#2F2F2F",
              border: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: FG_MUTED,
              fontWeight: 600,
              transform: `scale(${spring({ frame: frame - 55 - STUDENTS.length * 8, fps, config: { damping: 8 } })})`,
              marginLeft: -8,
            }}
          >
            +12
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div
        style={{
          marginTop: 40,
          transform: `translateY(${tabY}px)`,
          opacity: tabSpring,
        }}
      >
        <TabBar
          tabs={["All", "Section A", "Section B"]}
          activeIndex={Math.floor(frame / 40) % 3}
        />
      </div>
      <Cursor
        keyframes={[
          { frame: 5, x: 900, y: 200 },
          { frame: 15, x: 540, y: 350, click: true },
          { frame: 35, x: 300, y: 440, click: true },
          { frame: 65, x: 200, y: 700 },
          { frame: 75, x: 200, y: 770, click: true },
          { frame: 95, x: 370, y: 770, click: true },
        ]}
      />
    </AbsoluteFill>
  );
};
