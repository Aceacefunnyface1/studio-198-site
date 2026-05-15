import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(140deg, #060609 0%, #11081e 48%, #25113d 100%)",
          color: "#f4f1ff",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#ba8cff",
          }}
        >
          <span>Lawton, Oklahoma</span>
          <span>Cash Rides</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 94,
              lineHeight: 0.92,
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            Undercover Transportation
          </div>
          <div style={{ fontSize: 42, color: "#d6b8ff" }}>
            Reliable cash rides in Lawton
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 34 }}>
          <span>Starting at $6</span>
          <span>6AM - 9PM</span>
          <span>940-500-2960</span>
        </div>
      </div>
    ),
    size,
  );
}
