import { ImageResponse } from "next/og";

export const alt = "Snap Critique - No Hype. No Mercy.";
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
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 50% -10%, rgba(255, 77, 29, 0.38), transparent 28%), radial-gradient(circle at 82% 18%, rgba(255, 123, 38, 0.2), transparent 24%), radial-gradient(circle at 12% 22%, rgba(120, 8, 8, 0.22), transparent 28%), linear-gradient(180deg, #150100 0%, #090000 28%, #120100 64%, #060000 100%)",
          color: "#f6ddc7",
          fontFamily:
            'Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 4px)",
            opacity: 0.45,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -80,
            left: -120,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(255, 71, 25, 0.18)",
            filter: "blur(18px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -70,
            bottom: -110,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255, 166, 65, 0.12)",
            filter: "blur(22px)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "54px 62px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 24,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#f2ae58",
            }}
          >
            <div
              style={{
                width: 56,
                height: 2,
                background: "linear-gradient(90deg, #ff4c1d, #f2ae58)",
              }}
            />
            <span>Studio 198 presents</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 860,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 104,
                  fontWeight: 700,
                  lineHeight: 0.92,
                  letterSpacing: "-0.05em",
                }}
              >
                SNAP
              </span>
              <span
                style={{
                  fontSize: 104,
                  fontWeight: 700,
                  lineHeight: 0.92,
                  letterSpacing: "-0.05em",
                  color: "#ff8d4d",
                }}
              >
                CRITIQUE
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 18,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#fff0df",
              }}
            >
              <span>No Hype.</span>
              <span style={{ color: "#ff6a1a" }}>No Mercy.</span>
            </div>

            <p
              style={{
                margin: 0,
                display: "flex",
                maxWidth: 920,
                fontSize: 32,
                lineHeight: 1.35,
                color: "#e8c9af",
              }}
            >
              Short-form reviews. Instant verdicts. No fake praise. If it hits,
              it earns it. If it doesn't, it gets buried.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 26,
              borderTop: "1px solid rgba(255, 115, 43, 0.26)",
              fontSize: 24,
              color: "#d0ab92",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            <span>Short-form reviews</span>
            <span>moviesbybrad.com</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
