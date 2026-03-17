import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BG, FG, FG_MUTED, BORDER } from "../components/MockUI";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const TAGLINE = "Organize, Engage, Elevate";
const CHAR_FRAMES = 3;

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 8 },
  });

  const logoRotation = interpolate(logoScale, [0, 1], [-8, 0]);

  const taglineStart = 30;
  const taglineFrame = Math.max(0, frame - taglineStart);
  const typedLength = Math.min(
    TAGLINE.length,
    Math.floor(taglineFrame / CHAR_FRAMES)
  );
  const typedText = TAGLINE.slice(0, typedLength);

  const cursorOpacity = interpolate(
    frame % 16,
    [0, 8, 16],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle radial glow
  const glowOpacity = interpolate(
    frame % 120,
    [0, 60, 120],
    [0.03, 0.06, 0.03]
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
          width: 800,
          height: 800,
          borderRadius: 400,
          background: `radial-gradient(circle, rgba(37,120,202,${glowOpacity}) 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Decorative border rings */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: 250,
          border: `1px solid ${BORDER}`,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: 350,
          border: `1px solid ${BORDER}`,
          opacity: 0.15,
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 36,
            backgroundColor: "#262626",
            border: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            color: FG,
            fontWeight: 700,
          }}
        >
          C
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: FG,
            letterSpacing: -2,
          }}
        >
          Claspr
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 48,
          fontSize: 36,
          fontWeight: 400,
          color: FG_MUTED,
          height: 50,
          letterSpacing: 1,
        }}
      >
        <span style={{ color: FG }}>{typedText}</span>
        {typedLength < TAGLINE.length && (
          <span style={{ opacity: cursorOpacity, color: FG_MUTED }}>|</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
