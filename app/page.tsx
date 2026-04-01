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
  const featuredReview = heroReview
    ? {
        title: heroReview.movieTitle,
        slug: heroReview.slug,
        posterImage: heroReview.resolvedPosterImage,
        releaseYear: heroReview.releaseYear,
        rating: heroReview.ratingLabel,
        quickHit: heroReview.quickHit,
        heat: heroReview.heatCount,
        verdict: heroReview.verdict,
      }
    : null;

  return (
    <>
      <section className="studio-hero relative min-h-[92vh] w-full overflow-hidden bg-black">
        <div className="studio-hero__bg" />
        <div className="studio-hero__texture" />
        <div className="studio-hero__vignette" />
        <div className="studio-hero__crack" />
        <div className="studio-hero__haze" />
        <div className="studio-hero__embers" />

        <div className="relative z-10 h-auto min-h-[92vh] w-full lg:h-[92vh]">
          <div className="mx-auto grid h-full max-w-[1800px] grid-cols-1 gap-10 px-6 pt-28 pb-16 lg:grid-cols-[42%_8%_50%] lg:gap-0 lg:px-[6vw] lg:py-0">
            <div className="flex h-full flex-col justify-center pb-0 pt-0 lg:pb-[10vh] lg:pt-[18vh]">
              <p className="studio-hero__eyebrow">STUDIO 198 PRESENTS</p>

              <h1 className="studio-hero__title">
                <span>SNAP</span>
                <span>CRITIQUE</span>
              </h1>

              <p className="studio-hero__tagline">Not Meant to Feel Safe.</p>

              <div className="mt-6 max-w-[34rem] space-y-2">
                <p className="studio-hero__body">
                  Fast verdicts. Sharp takes. No fake praise.
                </p>
                <p className="studio-hero__body">
                  If it hits, it earns it. If it doesn&apos;t, it gets buried.
                </p>
              </div>

              <p className="studio-hero__aggression mt-8">NO HYPE. NO MERCY.</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/reviews" className="studio-btn studio-btn--primary">
                  ENTER REVIEWS
                </Link>
                <Link
                  href={featuredReview ? `/reviews/${featuredReview.slug}` : "/reviews"}
                  className="studio-btn studio-btn--secondary"
                >
                  READ THE VERDICT
                </Link>
              </div>
            </div>

            <div className="pointer-events-none relative hidden h-full lg:block" />

            <div className="relative flex h-full items-center justify-center pb-0 pt-0 lg:justify-end lg:pb-[8vh] lg:pt-[16vh]">
              <div className="studio-poster-wrap">
                <div className="studio-poster">
                  {featuredReview ? (
                    <img
                      src={featuredReview.posterImage}
                      alt={`${featuredReview.title} poster`}
                    />
                  ) : (
                    <img
                      src="/posters/next-review-slot.svg"
                      alt="Next review slot"
                    />
                  )}
                </div>

                <div className="studio-poster-meta">
                  <p className="studio-poster-meta__eyebrow">TONIGHT&apos;S VERDICT</p>
                  <p className="studio-poster-meta__stamp">
                    {featuredReview?.verdict ?? "WATCH"}
                  </p>
                  <h2 className="studio-poster-meta__title">
                    {featuredReview?.title ?? "LOADING"}
                  </h2>
                  <p className="studio-poster-meta__desc">
                    {featuredReview?.quickHit ??
                      "The next featured verdict is loading into the frame."}
                  </p>

                  <div className="studio-poster-meta__row">
                    {featuredReview?.releaseYear ? (
                      <span>{featuredReview.releaseYear}</span>
                    ) : null}
                    {featuredReview?.rating ? <span>{featuredReview.rating}</span> : null}
                    {featuredReview ? <span>🔥 {featuredReview.heat} HEAT</span> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-stack">
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
    </>
  );
}
