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
      className="glass-panel"
      style={{
        position: "absolute",
        top: 30,
        right: 40,
        padding: "24px",
        borderRadius: "20px",
        width: "320px",
        zIndex: 99,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)',
          boxShadow: '0 0 10px var(--success)'
        }} />
        <h3 style={{ margin: 0, fontFamily: 'Outfit', fontSize: "18px", fontWeight: 600 }}>
          Live Analysis
        </h3>
      </div>

      {/* Status Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          icon="👁️"
          label="EAR Score"
          value={ear.toFixed(3)}
          color={ear < 0.25 ? "var(--danger)" : "var(--primary)"}
        />
        <StatCard icon="⚡" label="Blinks" value={blinkCount} color="var(--primary)" />
        <StatCard 
          icon="🧭" 
          label="Direction" 
          value={direction} 
          color={direction !== 'forward' ? 'var(--warning)' : 'var(--success)'} 
          valueStyle={{ textTransform: 'capitalize' }}
        />
        <StatCard
          icon={smiling ? "😊" : "😐"}
          label="Expression"
          value={smiling ? "Smiling" : "Neutral"}
          color="var(--text-main)"
        />
      </div>

      {/* Attention Graph */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
            Attention Level
          </span>
          <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 600 }}>
            {(ear * 100).toFixed(0)}%
          </span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={attentionData}>
            <Line
              type="monotone"
              dataKey="ear"
              stroke="url(#colorEar)"
              dot={false}
              strokeWidth={3}
              isAnimationActive={false}
            />
            <defs>
              <linearGradient id="colorEar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 0.5]} hide />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "white",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
              }}
              formatter={(val) => [val.toFixed(3), "EAR"]}
              labelStyle={{ display: 'none' }}
              itemStyle={{ color: '#38bdf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, valueStyle }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      borderRadius: "12px",
      padding: "14px",
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'all 0.3s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: '0.5px' }}>
        {label}
      </span>
    </div>
    <div style={{ 
      fontSize: "18px", 
      fontWeight: 700, 
      color,
      fontFamily: 'Outfit',
      ...valueStyle
    }}>
      {value}
    </div>
  </div>
);

export default Dashboard;
