import type { Metadata } from "next";
import { EarlyHorrorBrowser } from "@/components/early-horror-browser";
import {
  EARLY_HORROR_SUBTITLE,
  EARLY_HORROR_SUPPORT_LINE,
  EARLY_HORROR_TITLE,
} from "@/lib/early-horror";
import { getEarlyHorrorArchiveBundle } from "@/lib/review-queries";

export const metadata: Metadata = {
  title: "The Birth of Horror",
  description:
    "Browse the Early Horror archive from 1896 through 1969 by decade, with live poster-backed reviews only.",
};

export default async function EarlyHorrorPage() {
  const archive = await getEarlyHorrorArchiveBundle();

  return (
    <div className="page-stack early-horror-page">
      <section className="content-section early-horror-hero">
        <div className="early-horror-hero__copy">
          <p className="eyebrow">Early Horror Archive</p>
          <h1>{EARLY_HORROR_TITLE}</h1>
          <p className="early-horror-hero__subtitle">{EARLY_HORROR_SUBTITLE}</p>
          <p className="early-horror-hero__support">{EARLY_HORROR_SUPPORT_LINE}</p>
        </div>
      </section>

      <section className="content-section early-horror-summary">
        <div className="early-horror-summary__item">
          <span>Film Count</span>
          <strong>{archive.summary.filmCount}</strong>
        </div>
        <div className="early-horror-summary__item">
          <span>Avg Rating</span>
          <strong>
            {typeof archive.summary.averageRating === "number"
              ? archive.summary.averageRating.toFixed(1)
              : "--"}
          </strong>
        </div>
        <div className="early-horror-summary__item">
          <span>Earliest Year</span>
          <strong>{archive.summary.earliestYear ?? "--"}</strong>
        </div>
        <div className="early-horror-summary__item">
          <span>Latest Year</span>
          <strong>{archive.summary.latestYear ?? "--"}</strong>
        </div>
      </section>

      <section className="content-section early-horror-content">
        <div className="section-heading early-horror-content__heading">
          <div>
            <p className="eyebrow">Decade Navigation</p>
            <h2>Move through the foundation instead of one endless wall</h2>
          </div>
        </div>

        <EarlyHorrorBrowser reviews={archive.reviews} decades={archive.decades} />
      </section>
    </div>
  );
}
