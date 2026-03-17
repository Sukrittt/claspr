import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Card, StatusBadge, BG, FG, FG_MUTED, BORDER, BG_ELEVATED, ACCENT } from "../components/MockUI";
import { Cursor } from "../components/Cursor";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const ASSIGNMENTS = [
  { title: "Data Structures Quiz", due: "Mar 18", status: "Pending" },
  { title: "Algorithm Analysis", due: "Mar 22", status: "Submitted" },
  { title: "Final Project Proposal", due: "Mar 25", status: "Approved" },
];

const CALENDAR_DAYS = [
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
];

export const AssignmentsScene: React.FC = () => {
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
          Assignments & Calendar
        </div>
        <div style={{ fontSize: 24, color: FG_MUTED, marginTop: 8 }}>
          Never miss a deadline
        </div>
      </div>

      {/* Assignment cards */}
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
        {ASSIGNMENTS.map((assignment, i) => {
          const cardSpring = spring({
            frame: frame - 15 - i * 12,
            fps,
            config: { damping: 12 },
          });
          const cardX = interpolate(cardSpring, [0, 1], [600, 0]);

          const showApproved = i === 0 && frame > 100;
          const statusTransition = i === 0
            ? spring({ frame: frame - 100, fps, config: { damping: 15 } })
            : 1;

          return (
            <div
              key={assignment.title}
              style={{
                transform: `translateX(${cardX}px)`,
                opacity: cardSpring,
              }}
            >
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 600, color: FG }}>
                      {assignment.title}
                    </div>
                    <div style={{ fontSize: 20, color: FG_MUTED, marginTop: 4 }}>
                      Due: {assignment.due}
                    </div>
                  </div>
                  <div style={{ transform: `scale(${statusTransition})` }}>
                    <StatusBadge
                      status={showApproved ? "Approved" : assignment.status}
                    />
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Mini calendar */}
      <div
        style={{
          marginTop: 36,
          opacity: interpolate(frame, [50, 65], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Card style={{ padding: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: FG, marginBottom: 20 }}>
            March 2026
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 600,
                  color: FG_MUTED,
                }}
              >
                {d}
              </div>
            ))}
          </div>
          {CALENDAR_DAYS.map((week, wi) => (
            <div key={wi} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {week.map((day) => {
                const hasAssignment = [18, 22, 25].includes(day);
                const dotDelay = 65 + (day - 14) * 3;
                const dotSpring = spring({
                  frame: frame - dotDelay,
                  fps,
                  config: { damping: 8 },
                });

                return (
                  <div
                    key={day}
                    style={{
                      flex: 1,
                      height: 56,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      fontSize: 20,
                      fontWeight: day === 17 ? 700 : 400,
                      color: day === 17 ? BG : FG,
                      backgroundColor: day === 17 ? FG : "transparent",
                    }}
                  >
                    {day}
                    {hasAssignment && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: ACCENT,
                          marginTop: 2,
                          transform: `scale(${dotSpring})`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      </div>
      <Cursor
        keyframes={[
          { frame: 10, x: 800, y: 200 },
          { frame: 25, x: 700, y: 300 },
          { frame: 65, x: 400, y: 700 },
          { frame: 80, x: 500, y: 750 },
          { frame: 95, x: 700, y: 300, click: true },
        ]}
      />
    </AbsoluteFill>
  );
};
