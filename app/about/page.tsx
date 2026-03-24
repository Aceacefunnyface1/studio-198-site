import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn what Snap Critique is, how Studio 198 approaches reviews, and why the platform is built around verdict-first criticism.",
};

export default function AboutPage() {
  return (
    <div className="page-stack">
      <section className="about-shell">
        <p className="eyebrow">About Snap Critique</p>
        <h1>Verdict-first film criticism under the Studio 198 banner</h1>
        <div className="info-grid">
          <div>
            <p>
              Snap Critique is a review platform for fast, poster-driven movie
              takes. The layout is built to hit quickly: artwork first, verdict
              first, then the short reaction and full write-up.
            </p>
            <p>
              The goal is not to imitate a generic entertainment blog or an
              influencer feed. The goal is a darker editorial identity that can
              stretch from website to app without losing shape.
            </p>
          </div>
          <div>
            <p>
              Studio 198 is the parent brand. On this site that means the work
              is presented with a cinematic, premium tone anchored by black,
              deep red, and muted gold.
            </p>
            <p>
              Reviews are meant to be direct. A visitor should understand the
              verdict fast, then decide whether to read deeper, watch the video
              review, or jump to viewing options.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
