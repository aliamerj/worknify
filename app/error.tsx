"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        height: "58vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          border: "2px solid red",
          padding: "20px",
          borderRadius: "10px",
          fontSize: "2rem",
          margin: "50px",
        }}
      >
        <h3>Error</h3>
        <p>
          {error.message || "Something went wrong. Please try again later."}
        </p>

        <button
          onClick={() => reset()}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            color: "#fff",
            backgroundColor: "#8a2be2",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.2s",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#6920b0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#8a2be2")
          }
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(138, 43, 226, 0.5)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)")
          }
        >
          Try again
        </button>
      </div>
    </div>
  );
}
