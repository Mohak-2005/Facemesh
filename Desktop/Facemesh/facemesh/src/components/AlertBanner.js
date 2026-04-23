import React from "react";

const AlertBanner = ({ drowsy, direction }) => {
  const isDistracted = direction !== "forward";

  if (!drowsy && !isDistracted) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: drowsy ? "#ff2222" : "#ffaa00",
        color: "white",
        padding: "12px 24px",
        borderRadius: "24px",
        zIndex: 99,
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily: "monospace",
      }}
    >
      {drowsy
        ? "⚠️ DROWSY! Please take a break!"
        : `👀 Look Forward! (Looking ${direction})`}
    </div>
  );
};

export default AlertBanner;
