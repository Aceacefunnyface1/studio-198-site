import type { Metadata } from "next";
import { bookingNotes, siteInfo } from "@/lib/shine-on-data";

export const metadata: Metadata = {
  title: `Contact | ${siteInfo.name}`,
  description: "Contact Shine On Tattoo in Lawton, Oklahoma for walk-ins, booking questions, and shop hours.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Get In Touch</p>
          <h1>Call, stop by, or get directions to the shop.</h1>
          <p className="page-hero__lead">
            Shine On Tattoo keeps it simple. For bookings, walk-in questions, and availability, call the shop or come by during business hours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container info-grid">
          <article className="info-panel info-panel--accent" id="booking">
            <p className="section-label">Contact</p>
            <h2>{siteInfo.name}</h2>
            <p>
              {siteInfo.addressLine1}
              <br />
              {siteInfo.addressLine2}
            </p>
            <p>
              <a href={siteInfo.phoneHref}>{siteInfo.phoneDisplay}</a>
            </p>
            <div className="hero-actions">
              <a href={siteInfo.phoneHref} className="button button--primary">
                Call Now
              </a>
              <a href={siteInfo.mapHref} target="_blank" rel="noreferrer" className="button button--ghost">
                Get Directions
              </a>
            </div>
          </article>

          <article className="info-panel">
            <p className="section-label">Hours</p>
            <ul className="stack-list">
              {siteInfo.hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="section-label section-label--spaced">Shop Notes</p>
            <ul className="stack-list">
              {siteInfo.policies.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>

          <article className="info-panel">
            <p className="section-label">Booking Info</p>
            <ul className="stack-list">
              {bookingNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
