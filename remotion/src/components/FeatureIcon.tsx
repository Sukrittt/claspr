import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BG_ELEVATED, FG, BORDER } from "./MockUI";

export const FeatureIcon: React.FC<{
  emoji: string;
  label: string;
  delay?: number;
  targetX?: number;
  targetY?: number;
  converge?: boolean;
  convergeDelay?: number;
}> = ({
  emoji,
  label,
  delay = 0,
  targetX = 0,
  targetY = 0,
  converge = false,
  convergeDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8 },
  });

  const convergeProgress = converge
    ? spring({
        frame: frame - convergeDelay,
        fps,
        config: { damping: 12 },
      })
    : 0;

  const x = interpolate(convergeProgress, [0, 1], [0, targetX]);
  const y = interpolate(convergeProgress, [0, 1], [0, targetY]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transform: `scale(${entrance}) translate(${x}px, ${y}px)`,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: BG_ELEVATED,
          border: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: FG,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};
