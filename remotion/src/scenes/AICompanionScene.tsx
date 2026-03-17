import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ChatBubble } from "../components/ChatBubble";
import { BG, FG, FG_MUTED, BORDER, BG_ELEVATED, BG_HOVER } from "../components/MockUI";
import { Cursor } from "../components/Cursor";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const PERSONAS = ["Teacher", "Question Expert", "Note Creator"];

export const AICompanionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });

  const personaIndex = Math.min(
    PERSONAS.length - 1,
    Math.floor(frame / 50)
  );
  const personaSpring = spring({
    frame: frame % 50,
    fps,
    config: { damping: 15 },
  });

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
          AI Companion
        </div>
        <div style={{ fontSize: 24, color: FG_MUTED, marginTop: 8 }}>
          Your personal study assistant
        </div>
      </div>

      {/* AI Persona selector */}
      <div
        style={{
          marginTop: 36,
          display: "flex",
          gap: 12,
        }}
      >
        {PERSONAS.map((persona, i) => {
          const isActive = i === personaIndex;
          return (
            <div
              key={persona}
              style={{
                padding: "10px 20px",
                borderRadius: 14,
                fontSize: 20,
                fontWeight: 600,
                backgroundColor: isActive ? FG : BG_HOVER,
                color: isActive ? BG : FG_MUTED,
                border: isActive ? "none" : `1px solid ${BORDER}`,
                transform: isActive ? `scale(${interpolate(personaSpring, [0, 1], [0.9, 1])})` : "scale(1)",
              }}
            >
              {persona}
            </div>
          );
        })}
      </div>

      {/* Chat area */}
      <div
        style={{
          marginTop: 40,
          backgroundColor: BG_ELEVATED,
          border: `1px solid ${BORDER}`,
          borderRadius: 24,
          padding: 28,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          maxHeight: 900,
        }}
      >
        <ChatBubble
          text="Can you explain recursion in simple terms?"
          isUser={true}
          delay={20}
        />
        <ChatBubble
          text="Recursion is when a function calls itself to solve smaller versions of the same problem. Think of it like Russian nesting dolls — each doll opens to reveal a smaller one inside, until you reach the smallest doll (the base case)."
          isUser={false}
          delay={45}
          typewriter
          charFrames={1}
        />
      </div>

      <Cursor
        keyframes={[
          { frame: 10, x: 800, y: 600 },
          { frame: 20, x: 540, y: 500, click: true },
          { frame: 45, x: 200, y: 240 },
          { frame: 50, x: 120, y: 240, click: true },
          { frame: 90, x: 340, y: 240 },
          { frame: 100, x: 340, y: 240, click: true },
        ]}
      />

      {/* AI thinking indicator */}
      {frame > 30 && frame < 50 && (
        <div
          style={{
            position: "absolute",
            bottom: 340,
            left: 76,
            display: "flex",
            gap: 8,
            padding: "12px 20px",
            backgroundColor: BG_HOVER,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: FG_MUTED,
                opacity: interpolate(
                  (frame + i * 5) % 20,
                  [0, 10, 20],
                  [0.3, 1, 0.3]
                ),
              }}
            />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
