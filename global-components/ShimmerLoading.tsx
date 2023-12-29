"use client";

import React from "react";

interface ShimmerLoadingProps {
  count: number;
}

export const ShimmerLoading: React.FC<ShimmerLoadingProps> = ({ count }) => {
  // Function to create the shimmer effect style
  const shimmerEffectStyle = (
    width: string,
    height: string,
    marginTop = "0",
  ) => ({
    width,
    height,
    marginTop,
    borderRadius: "5px",
    background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div
        style={{
          display: "grid",
          width: "100%",
          maxWidth: "1200px",
          margin: "auto",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "2rem",
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#e0e0e0",
              padding: "2rem",
              borderRadius: "15px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={shimmerEffectStyle("100px", "100px")}></div>
            <div style={shimmerEffectStyle("70%", "20px", "10px")}></div>
            <div style={shimmerEffectStyle("70%", "20px", "10px")}></div>
            <div style={shimmerEffectStyle("70%", "20px", "10px")}></div>
          </div>
        ))}

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ShimmerLoading;
