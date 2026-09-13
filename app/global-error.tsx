"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0b0f0e",
          color: "#f4f4f5",
        }}
      >
        <title>Something went wrong · GearUp</title>
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>GearUp hit a snag</h1>
          <p style={{ color: "#a1a1aa", marginBottom: 24 }}>
            The app failed to load. Please try again.
            {error.digest ? ` (Ref: ${error.digest})` : ""}
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              background: "#059669",
              color: "white",
              border: 0,
              borderRadius: 12,
              padding: "12px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
