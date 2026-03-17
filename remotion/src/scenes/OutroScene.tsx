import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FeatureIcon } from "../components/FeatureIcon";
import { BG, FG, FG_MUTED, BORDER, BG_ELEVATED } from "../components/MockUI";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const FEATURES = [
  { emoji: "🎓", label: "Classrooms", x: -200, y: -300 },
  { emoji: "🤖", label: "AI Companion", x: 200, y: -300 },
  { emoji: "📋", label: "Assignments", x: -200, y: -100 },
  { emoji: "📅", label: "Calendar", x: 200, y: -100 },
  { emoji: "📝", label: "Notes", x: -200, y: 100 },
  { emoji: "💬", label: "Discussions", x: 200, y: 100 },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const convergeFrame = 40;

  const ctaSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 8 },
  });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.5, 1]);

  const urlOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle glow pulse
  const glowOpacity = interpolate(
    frame % 90,
    [0, 45, 90],
    [0.04, 0.08, 0.04]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: 300,
          background: `radial-gradient(circle, rgba(37,120,202,${glowOpacity}) 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Feature icons grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 40,
          width: 500,
          marginBottom: 60,
        }}
      >
        {FEATURES.map((feature, i) => (
          <FeatureIcon
            key={feature.label}
            emoji={feature.emoji}
            label={feature.label}
            delay={i * 4}
            converge={frame > convergeFrame}
            convergeDelay={convergeFrame + i * 3}
            targetX={-feature.x * 0.6}
            targetY={-feature.y * 0.3}
          />
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          transform: `scale(${ctaScale})`,
          opacity: ctaSpring,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: FG,
          }}
        >
          Try Claspr Today
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlOpacity,
          marginTop: 32,
          padding: "16px 40px",
          borderRadius: 20,
          backgroundColor: BG_ELEVATED,
          border: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: FG_MUTED,
            letterSpacing: 1,
          }}
        >
          claspr.vercel.app
        </div>
      </div>
    </AbsoluteFill>
  );
};
