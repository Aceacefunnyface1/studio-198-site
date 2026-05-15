import type { Metadata } from "next";
import { faqs, siteInfo } from "@/lib/shine-on-data";

export const metadata: Metadata = {
  title: `FAQ | ${siteInfo.name}`,
  description:
    "Frequently asked questions for Shine On Tattoo in Lawton, Oklahoma.",
};

export default function FaqPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-label">FAQ</p>
          <h1>Quick answers before you come in.</h1>
          <p className="page-hero__lead">
            Straightforward shop info so you know what to expect before your appointment or walk-in visit.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container faq-list">
          {faqs.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
