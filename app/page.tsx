import Image from "next/image";
import { siteInfo } from "@/lib/shine-on-data";

const trustItems = [
  "Cash Rides",
  "Work Rides",
  "Local Driver",
  "Out-of-Town Available",
  "Starting at $6",
  "No Base Rides",
] as const;

const reasonsToCall = [
  "Better than waiting on an app",
  "Great for daily work rides",
  "Local Lawton driver",
  "Cash-friendly rides",
  "Call or text directly",
  "Out-of-town rides available",
] as const;

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="hero">
        <div className="container">
          <div className="hero__layout">
            <div className="hero__copy">
              <p className="eyebrow">Cash rides in Lawton, Oklahoma</p>
              <h1>UNDERCOVER TRANSPORTATION</h1>
              <h2>Reliable Cash Rides in Lawton</h2>
              <p className="hero__lead">
                No app. No waiting around. Just call or text Matthew and get where
                you need to go.
              </p>
              <div className="hero__details">
                <p>Rides start at $6.</p>
                <p>Available daily from 6AM to 9PM.</p>
                <p>Work rides, local rides, and out-of-town rides available.</p>
              </div>
              <div className="cta-row">
                <a href={siteInfo.phoneHref} className="button button--primary">
                  CALL NOW - {siteInfo.phoneDisplay}
                </a>
                <a href={siteInfo.smsHref} className="button button--secondary">
                  TEXT MATTHEW
                </a>
              </div>
            </div>

            <div className="hero__panel">
              <div className="hero__image-wrap">
                <Image
                  src="/home-hero/undercover-hero.png"
                  alt="Black car driving at night on a purple-lit city road"
                  fill
                  priority
                  className="hero__image"
                  sizes="(max-width: 980px) 100vw, 46vw"
                />
                <div className="hero__image-overlay" aria-hidden="true" />
              </div>
              <div className="hero__card">
                <p className="hero__card-label">Call or text Matthew Rogers</p>
                <a href={siteInfo.phoneHref} className="hero__phone">
                  {siteInfo.phoneDisplay}
                </a>
                <p className="hero__card-copy">
                  Direct rides around Lawton with simple pricing, reliable pickup,
                  and no base rides.
                </p>
              </div>
            </div>
          </div>

          <div className="trust-strip" aria-label="Service highlights">
            {trustItems.map((item) => (
              <span key={item} className="trust-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container narrow-stack">
          <p className="eyebrow">Need a dependable ride?</p>
          <h2>Need a dependable ride?</h2>
          <p className="section-copy">
            Undercover Transportation helps people in Lawton get to work,
            appointments, stores, home, and anywhere else they need to go. Matthew
            specializes in reliable work rides and repeat customers who need
            someone they can count on.
          </p>
        </div>
      </section>

      <section className="section section--panel">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Why call Matthew?</p>
            <h2>Why call Matthew?</h2>
          </div>
          <div className="card-grid">
            {reasonsToCall.map((item) => (
              <article key={item} className="reason-card">
                <span className="reason-card__mark" aria-hidden="true">
                  +
                </span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="container split-panel">
          <div>
            <p className="eyebrow">Simple pricing</p>
            <h2>Simple pricing</h2>
            <p className="section-copy">
              Rides start at $6. Final price depends on pickup, drop-off, distance,
              and time. Call or text Matthew for a quick quote.
            </p>
          </div>
          <div className="quote-box">
            <p className="quote-box__label">Quick info</p>
            <ul className="info-list">
              <li>Cash-friendly rides</li>
              <li>Daily availability from 6AM to 9PM</li>
              <li>No military base rides</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--panel" id="coverage">
        <div className="container narrow-stack">
          <p className="eyebrow">Serving Lawton and beyond</p>
          <h2>Serving Lawton and beyond</h2>
          <p className="section-copy">
            Based in Lawton, Oklahoma. Local rides available in town, plus
            out-of-town trips when scheduled.
          </p>
        </div>
      </section>

      <section className="section section--cta">
        <div className="container cta-block">
          <div>
            <p className="eyebrow">Need a ride today?</p>
            <h2>Need a ride today?</h2>
            <p className="section-copy">Call or text Matthew Rogers now.</p>
          </div>
          <div className="cta-row">
            <a href={siteInfo.phoneHref} className="button button--primary">
              CALL {siteInfo.phoneDisplay}
            </a>
            <a href={siteInfo.smsHref} className="button button--secondary">
              TEXT {siteInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
