import type { Metadata } from "next";
import { artists, bookingNotes, siteInfo } from "@/lib/shine-on-data";

export const metadata: Metadata = {
  title: `Artists | ${siteInfo.name}`,
  description:
    "Meet the tattoo artists working out of Shine On Tattoo in Lawton, Oklahoma.",
};

export default function ArtistsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Artists</p>
          <h1>Experienced tattoo artists serving Lawton with real shop standards.</h1>
          <p className="page-hero__lead">
            Meet the artists behind Shine On Tattoo. Different strengths, the same expectation: clean work, professional execution, and tattoos built to last.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container artist-grid artist-grid--full">
          {artists.map((artist) => (
            <article key={artist.name} className="artist-card artist-card--full">
              <div className="artist-card__badge">{artist.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <p className="artist-card__role">{artist.role}</p>
                <h2>{artist.name}</h2>
                <p>{artist.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--contrast">
        <div className="container info-grid">
          <div className="info-panel">
            <p className="section-label">Booking Notes</p>
            <ul className="stack-list">
              {bookingNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="info-panel info-panel--accent" id="booking">
            <p className="section-label">Ready To Book?</p>
            <h3>Call the shop and lock in your next piece.</h3>
            <p>
              Walk-ins are welcome when availability opens up, and larger custom pieces may need a deposit.
            </p>
            <div className="hero-actions">
              <a href={siteInfo.phoneHref} className="button button--primary">
                Call {siteInfo.phoneDisplay}
              </a>
              <a href={siteInfo.mapHref} target="_blank" rel="noreferrer" className="button button--ghost">
                Visit The Shop
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
