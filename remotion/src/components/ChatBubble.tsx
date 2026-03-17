import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BG_HOVER, FG, FG_MUTED, ACCENT } from "./MockUI";

export const ChatBubble: React.FC<{
  text: string;
  isUser: boolean;
  delay?: number;
  typewriter?: boolean;
  charFrames?: number;
}> = ({ text, isUser, delay = 0, typewriter = false, charFrames = 1 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(localFrame, [0, 8], [20, 0], {
    extrapolateRight: "clamp",
  });

  const displayText = typewriter
    ? text.slice(0, Math.min(text.length, Math.floor(localFrame / charFrames)))
    : text;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "18px 24px",
          borderRadius: 20,
          fontSize: 24,
          lineHeight: 1.5,
          backgroundColor: isUser ? FG : BG_HOVER,
          color: isUser ? "#191919" : FG,
          borderBottomRightRadius: isUser ? 4 : 20,
          borderBottomLeftRadius: isUser ? 20 : 4,
          fontWeight: 400,
        }}
      >
        {displayText}
        {typewriter && localFrame / charFrames < text.length && (
          <span
            style={{
              opacity: interpolate(
                frame % 16,
                [0, 8, 16],
                [1, 0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
              color: FG_MUTED,
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  );
};
