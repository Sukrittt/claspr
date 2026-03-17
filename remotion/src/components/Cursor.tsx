import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

interface CursorProps {
  keyframes: CursorKeyframe[];
}

export const Cursor: React.FC<CursorProps> = ({ keyframes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (keyframes.length === 0) return null;

  // Find surrounding keyframes for interpolation
  let prevKf = keyframes[0];
  let nextKf = keyframes[0];
  for (let i = 0; i < keyframes.length; i++) {
    if (keyframes[i].frame <= frame) {
      prevKf = keyframes[i];
      nextKf = keyframes[i + 1] ?? keyframes[i];
    }
  }

  // Use spring-based interpolation between keyframes
  const moveProgress =
    prevKf === nextKf
      ? 1
      : spring({
          frame: frame - prevKf.frame,
          fps,
          config: { damping: 18, stiffness: 120 },
          durationInFrames: nextKf.frame - prevKf.frame,
        });

  const x = interpolate(moveProgress, [0, 1], [prevKf.x, nextKf.x]);
  const y = interpolate(moveProgress, [0, 1], [prevKf.y, nextKf.y]);

  // Check if we're at a click frame
  const activeClick = keyframes.find(
    (kf) => kf.click && frame >= kf.frame && frame < kf.frame + 12
  );

  const clickProgress = activeClick
    ? (frame - activeClick.frame) / 12
    : -1;

  const cursorScale =
    clickProgress >= 0
      ? interpolate(clickProgress, [0, 0.3, 1], [1, 0.85, 1])
      : 1;

  // Ripple effect on click
  const rippleOpacity =
    clickProgress >= 0
      ? interpolate(clickProgress, [0, 1], [0.5, 0])
      : 0;
  const rippleScale =
    clickProgress >= 0
      ? interpolate(clickProgress, [0, 1], [0, 1.5])
      : 0;

  // Fade in cursor at first keyframe
  const opacity = interpolate(frame, [keyframes[0].frame - 5, keyframes[0].frame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999,
        opacity,
      }}
    >
      {/* Ripple */}
      {clickProgress >= 0 && (
        <div
          style={{
            position: "absolute",
            left: x - 20,
            top: y - 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            opacity: rippleOpacity,
            transform: `scale(${rippleScale})`,
          }}
        />
      )}

      {/* Cursor SVG */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `scale(${cursorScale})`,
          transformOrigin: "top left",
        }}
      >
        <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
          <path
            d="M2 2L2 28L8.5 21.5L14.5 32L19.5 29.5L13.5 19L22 18L2 2Z"
            fill="white"
            stroke="#222"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
