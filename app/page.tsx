/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { BrowseExplorer } from "@/components/browse-explorer";
import { ReviewCard } from "@/components/review-card";
import {
  getDailyFeaturedReview,
  getPublishedReviewsWithStats,
} from "@/lib/review-queries";

export default async function HomePage() {
  const reviews = await getPublishedReviewsWithStats();
  const heroReview = getDailyFeaturedReview(reviews);
  const latest = [...reviews]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 3);
  const spotlightReviews = (
    heroReview
      ? [heroReview, ...latest.filter((review) => review.id !== heroReview.id)]
      : latest
  ).slice(0, 3);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="hero-haze hero-haze-left" />
          <div className="hero-haze hero-haze-right" />
          <div className="hero-light-streak" />
          <div className="hero-shadow-form" />
          <div className="hero-silhouette hero-silhouette-left" />
          <div className="hero-silhouette hero-silhouette-right" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">STUDIO 198 PRESENTS</p>
          <h1>SNAP CRITIQUE</h1>
          <p className="hero-slogan">Not Meant to Feel Safe.</p>
          <p className="hero-body">
            Fast verdicts. Sharp takes. No fake praise.
            <br />
            If a movie hits, it earns it. If it doesn&apos;t, it gets buried.
          </p>
          <p className="hero-accent">No Hype. No Mercy.</p>
          <div className="hero-actions">
            <Link href="/reviews" className="button-primary">
              Enter Reviews
            </Link>
            <Link
              href={heroReview ? `/reviews/${heroReview.slug}` : "/reviews"}
              className="button-secondary"
            >
              Read the Verdict
            </Link>
          </div>
        </div>

        {heroReview ? (
          <div className="hero-feature">
            <div className="hero-feature-poster">
              <div className="hero-feature-media">
                <img
                  src={heroReview.resolvedPosterImage}
                  alt={`${heroReview.movieTitle} poster`}
                />
              </div>
              <div className="hero-feature-burn" aria-hidden="true" />
            </div>
            <div className="hero-feature-content">
              <p className="hero-feature-label">Tonight&apos;s Verdict</p>
              <span className={`verdict-badge verdict-${heroReview.verdictKey}`}>
                {heroReview.verdict}
              </span>
              <h2>{heroReview.movieTitle}</h2>
              <p className="hero-feature-hook">
                {heroReview.quickHit || "Review copy pending Studio 198."}
              </p>
              <div className="meta-row">
                {heroReview.releaseYear ? <span>{heroReview.releaseYear}</span> : null}
                <span>{heroReview.ratingLabel}</span>
                <span>🔥 {heroReview.heatCount} HEAT</span>
              </div>
              <div className="hero-feature-strip">
                <div>
                  <strong>Filed under</strong>
                  <span>{heroReview.genreTags.slice(0, 3).join(" / ")}</span>
                </div>
                <div>
                  <strong>Stamped by</strong>
                  <span>{heroReview.reviewerName}</span>
                </div>
              </div>
              <Link
                href={`/reviews/${heroReview.slug}`}
                className="button-primary"
              >
                Read the Verdict
              </Link>
            </div>
          </div>
        ) : (
          <div className="hero-feature hero-feature-empty">
            <div className="hero-feature-content">
              <p className="hero-feature-label">Tonight&apos;s Verdict</p>
              <h2>The wall is loading.</h2>
              <p className="hero-feature-hook">
                Studio 198 is lining up the next poster. Step into the archive
                and dig through the damage.
              </p>
              <img
                src="/posters/next-review-slot.svg"
                alt="Next review slot"
                className="hero-feature-placeholder"
              />
            </div>
          </div>
        )}
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FEATURED VERDICTS</p>
            <h2>Poster wall. Fresh damage.</h2>
          </div>
          <Link href="/reviews" className="text-link">
            Enter the archive
          </Link>
        </div>
        <div className="card-grid card-grid-featured">
          {spotlightReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DIG THROUGH THE WALL</p>
            <h2>Search the cuts. Sort the wreckage.</h2>
          </div>
        </div>
        <BrowseExplorer
          reviews={reviews}
          emptyMessage="Nothing matches the current cut of the archive."
        />
      </section>

      <section className="content-section two-column-callout">
        <div className="callout-block">
          <p className="eyebrow">LATEST FILES</p>
          <h2>Fresh cuts from the booth</h2>
          <p>
            New verdicts hit fast, land hard, and stay on the wall until
            something meaner replaces them.
          </p>
          <div className="stack-list">
            {latest.map((review) => (
              <Link key={review.id} href={`/reviews/${review.slug}`} className="list-link">
                <span>{review.movieTitle}</span>
                <span>🔥 {review.heatCount} HEAT</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="callout-block">
          <p className="eyebrow">THE HOUSE STYLE</p>
          <h2>No soft focus. No mercy edits.</h2>
          <p>
            Studio 198 doesn&apos;t hand out participation trophies. Every review
            is built to hit quick, read clean, and leave a mark after the page
            goes black.
          </p>
          <Link href="/about" className="button-secondary">
            Read the manifesto
          </Link>
        </div>
      </section>
    </div>
  );
}
