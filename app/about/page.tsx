import type { Metadata } from "next";
import Image from "next/image";
import { serviceHighlights, siteInfo } from "@/lib/shine-on-data";

export const metadata: Metadata = {
  title: `About | ${siteInfo.name}`,
  description:
    "Learn why Shine On Tattoo has become one of the most trusted tattoo shops in Lawton, Oklahoma.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero__grid">
          <div>
            <p className="section-label">About The Shop</p>
            <h1>A LAWTON TATTOO SHOP BUILT ON REPUTATION</h1>
            <div className="prose-block">
              <p>
                Shine On Tattoo is one of the most established and trusted tattoo shops in Lawton, Oklahoma. With hundreds of verified reviews and a strong local following, the shop has built its reputation on consistency, professionalism, and quality work.
              </p>
              <p>
                The artists at Shine On Tattoo focus on delivering clean, long-lasting tattoos tailored to each client. Whether you&apos;re coming in for your first piece or adding to a full sleeve, the goal is the same - solid work done right the first time.
              </p>
              <p>
                This isn&apos;t a high-pressure, gimmick-driven shop. It&apos;s a place where clients come back again and again because they trust the artists, the environment, and the results.
              </p>
            </div>
          </div>

          <div className="page-hero__visual">
            <div className="media-frame">
              <Image
                src="/inferno/demon-garage.png"
                alt="Gritty visual backdrop for Shine On Tattoo"
                fill
                sizes="(max-width: 960px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="section-label">What Clients Come Back For</p>
            <h2>Clear communication, solid execution, and a shop that takes the work seriously.</h2>
          </div>
          <div className="feature-grid">
            {serviceHighlights.map((item, index) => (
              <article key={item} className="feature-card">
                <span className="feature-card__index">{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--contrast">
        <div className="container info-grid">
          <div className="info-panel">
            <p className="section-label">Visit</p>
            <h2>{siteInfo.addressLine1}</h2>
            <p>{siteInfo.addressLine2}</p>
            <p>
              <a href={siteInfo.phoneHref}>{siteInfo.phoneDisplay}</a>
            </p>
          </div>
          <div className="info-panel">
            <p className="section-label">Hours</p>
            <ul className="stack-list">
              {siteInfo.hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
              {siteInfo.policies.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
