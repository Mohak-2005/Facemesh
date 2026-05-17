import React from "react";

const AlertBanner = ({ drowsy, direction }) => {
  const isDistracted = direction !== "forward";

  if (!drowsy && !isDistracted) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        background: drowsy ? "var(--danger)" : "var(--warning)",
        color: drowsy ? "white" : "#0f172a",
        padding: "16px 32px",
        borderRadius: "100px",
        zIndex: 101,
        fontWeight: "600",
        fontSize: "18px",
        fontFamily: "'Outfit', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: drowsy 
          ? "0 10px 25px rgba(248, 113, 113, 0.4), 0 0 0 4px rgba(248, 113, 113, 0.2)" 
          : "0 10px 25px rgba(250, 204, 21, 0.4)",
        animation: drowsy ? "slide-in-bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), pulse-danger 2s infinite" : "slide-in-bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      <span style={{ fontSize: "24px" }}>
        {drowsy ? "⚠️" : "👀"}
      </span>
      {drowsy
        ? "DROWSINESS DETECTED! Please take a break."
        : `Looking ${direction}! Please focus on the screen.`}
    </div>
  );
};

export default AlertBanner;
