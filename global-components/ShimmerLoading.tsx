"use client";

import React from "react";

interface ShimmerLoadingProps {
  count: number;
}

export const ShimmerLoading: React.FC<ShimmerLoadingProps> = ({ count }) => {
  return (
    <div>
      <div
        style={{
          display: "grid",
          width: "80%", // Set the width to 70%
          margin: "0 auto", // This will center the grid horizontally
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "3rem",
          padding: "2rem",
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#e0e0e0", // Shimmer background
              padding: "2rem",
              borderRadius: "15px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              background:
                "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
              backgroundSize: "200% 200%",
              animation: "shimmer 1.5s infinite",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "10px",
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            ></div>

            <div
              style={{
                width: "70%",
                height: "20px",
                marginTop: "10px",
                borderRadius: "5px",
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            ></div>
            <div
              style={{
                width: "70%",
                height: "20px",
                marginTop: "10px",
                borderRadius: "5px",
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            ></div>
            <div
              style={{
                width: "70%",
                height: "20px",
                marginTop: "10px",
                borderRadius: "5px",
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            ></div>
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
