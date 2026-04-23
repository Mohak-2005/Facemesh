import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({
  ear,
  blinkCount,
  direction,
  smiling,
  attentionData,
  drowsy,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "16px",
        borderRadius: "12px",
        width: "260px",
        zIndex: 99,
        fontFamily: "monospace",
      }}
    >
      <h3 style={{ margin: "0 0 12px", color: "aqua", fontSize: "14px" }}>
        📊 Live Analytics
      </h3>

      {/* Status Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <StatCard
          label="EAR Score"
          value={ear.toFixed(3)}
          color={ear < 0.25 ? "#ff4444" : "#44ff88"}
        />
        <StatCard label="Blinks" value={blinkCount} color="aqua" />
        <StatCard label="Direction" value={direction} color="#ffdd44" />
        <StatCard
          label="Smile"
          value={smiling ? "😊 Yes" : "😐 No"}
          color="#ff88ff"
        />
      </div>

      {/* Drowsiness Alert */}
      {drowsy && (
        <div
          style={{
            background: "#ff2222",
            padding: "8px",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "12px",
            animation: "pulse 1s infinite",
          }}
        >
          ⚠️ DROWSINESS DETECTED!
        </div>
      )}

      {/* Attention Graph */}
      <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 4px" }}>
        EAR over time
      </p>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={attentionData}>
          <Line
            type="monotone"
            dataKey="ear"
            stroke="aqua"
            dot={false}
            strokeWidth={1.5}
          />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 0.5]} hide />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "none",
              fontSize: "11px",
            }}
            formatter={(val) => [val.toFixed(3), "EAR"]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.05)",
      borderRadius: "8px",
      padding: "8px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: "10px", color: "#aaa" }}>{label}</div>
    <div style={{ fontSize: "13px", fontWeight: "bold", color }}>{value}</div>
  </div>
);

export default Dashboard;
