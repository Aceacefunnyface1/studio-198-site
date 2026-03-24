import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Snap Critique works, who reviews the films, and how Studio 198 ties the platform together.",
};

export default function AboutPage() {
  return (
    <div className="page-stack">
      <section className="about-shell">
        <p className="eyebrow">About Snap Critique</p>
        <h1>About Snap Critique</h1>
        <div className="info-grid">
          <div>
            <h2>Snap Critique is built to answer one question fast:</h2>
            <p>What are we watching tonight?</p>
            <p>
              No long reads. No filler.
            </p>
            <p>
              You see the poster, you see the verdict, and you know if it&apos;s
              worth your time.
            </p>

            <h2>Who&apos;s Behind It</h2>
            <p>This isn&apos;t just one opinion.</p>
            <p>Reviews come from:</p>
            <ul>
              <li>Ace</li>
              <li>and two working filmmakers</li>
            </ul>
            <p>
              Different perspectives, same goal:
              <br />
              call it straight.
            </p>

            <h2>How It Works</h2>
            <ul>
              <li>Poster first</li>
              <li>Verdict first</li>
              <li>Quick take</li>
              <li>Full breakdown if you want it</li>
            </ul>
            <p>You don&apos;t have to dig for the answer. It&apos;s right there.</p>
          </div>
          <div>
            <h2>What You&apos;ll Start Seeing</h2>
            <p>
              Short hits. Fast reviews. 5-10 second drops.
            </p>
            <p>
              You&apos;ll see something, think &ldquo;should we watch this?&rdquo; and
              land here for the answer.
            </p>

            <h2>Studio 198</h2>
            <p>Snap Critique runs under Studio 198.</p>
            <p>
              Film, reviews, and everything around it connect back here.
            </p>

            <h2>Bottom Line</h2>
            <p>You don&apos;t need another opinion.</p>
            <p>You need a decision.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
