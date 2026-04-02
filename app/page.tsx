/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { BrowseExplorer } from "@/components/browse-explorer";
import NewsletterBlock from "@/components/newsletter-block";
import { ReviewCard } from "@/components/review-card";
import {
  getDailyFeaturedReview,
  getPublishedReviewsWithStats,
} from "@/lib/review-queries";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const newsletterState =
    typeof params.newsletter === "string" ? params.newsletter : "";
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
  const leadReview = spotlightReviews[0] ?? null;
  const supportReviews = spotlightReviews.slice(1, 3);

  return (
    <div className="cinema-home">
      <div className="cinema-home__backdrop" aria-hidden="true">
        <div className="cinema-home__backdrop-top" />
        <div className="cinema-home__backdrop-mid" />
        <div className="cinema-home__backdrop-bottom" />
      </div>

      <div className="cinema-home__column">
        <section className="cinema-panel cinema-panel--hero">
          <div className="cinema-panel__copy">
            <p className="eyebrow cinema-home__eyebrow">Studio 198 presents</p>
            <h1 className="cinema-home__title">
              <span>SNAP</span>
              <span>CRITIQUE</span>
            </h1>
            <p className="cinema-home__tagline">NO HYPE. NO MERCY.</p>
            <p className="cinema-home__lede">
              Poster-first verdicts with smoke in the air and no patience for
              fake praise.
            </p>
            <p className="cinema-home__lede">
              Movies either survive the fire, earn the obsession, or get
              dragged straight into it.
            </p>

            <div className="cinema-home__actions">
              <Link href="/reviews" className="button-primary">
                Enter the Archive
              </Link>
              <Link
                href={heroReview ? `/reviews/${heroReview.slug}` : "/reviews"}
                className="button-secondary"
              >
                Read Tonight&apos;s Verdict
              </Link>
            </div>
          </div>

          <div className="cinema-panel__stage">
            <div className="cinema-stage__main">
              <img
                src="/inferno/demon-garage.png"
                alt="Infernal hot rods in front of a towering demon"
              />
            </div>

            <div className="cinema-stage__mini cinema-stage__mini--top">
              <img
                src="/inferno/hellscape-wide.png"
                alt="Burning fortress on the edge of a lava field"
              />
            </div>

            <div className="cinema-stage__featured">
              <div className="cinema-stage__featured-poster">
                <img
                  src={heroReview?.resolvedPosterImage ?? "/posters/next-review-slot.svg"}
                  alt={
                    heroReview
                      ? `${heroReview.movieTitle} poster`
                      : "Next review slot"
                  }
                />
              </div>
              <div className="cinema-stage__featured-copy">
                <p>Tonight&apos;s sacrifice</p>
                <h2>{heroReview?.movieTitle ?? "Next film on the pyre"}</h2>
                <span>
                  {heroReview?.releaseYear ? `${heroReview.releaseYear} / ` : ""}
                  {heroReview?.ratingLabel ?? "Awaiting rating"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="cinema-panel cinema-panel--wall">
          <div className="cinema-panel__heading">
            <h2>POSTER WALL. FRESH DAMAGE.</h2>
            <Link href="/reviews">SEE ALL REVIEWS</Link>
          </div>

          <div className="cinema-poster-wall">
            {leadReview ? (
              <Link
                href={`/reviews/${leadReview.slug}`}
                className="cinema-poster-wall__lead"
              >
                <img
                  src={leadReview.resolvedPosterImage}
                  alt={`${leadReview.movieTitle} poster`}
                />
                <div className="cinema-poster-wall__overlay">
                  <h3>{leadReview.movieTitle}</h3>
                  <p>
                    {leadReview.quickHit?.split(".")[0] ??
                      "Fresh damage on the wall."}
                  </p>
                </div>
              </Link>
            ) : null}

            <div className="cinema-poster-wall__stack">
              {supportReviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/reviews/${review.slug}`}
                  className="cinema-poster-wall__support"
                >
                  <img
                    src={review.resolvedPosterImage}
                    alt={`${review.movieTitle} poster`}
                  />
                  <div className="cinema-poster-wall__overlay">
                    <h3>{review.movieTitle}</h3>
                    <p>{review.quickHit?.split(".")[0] ?? "Still burning."}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="cinema-panel cinema-panel--newsletter">
          <NewsletterBlock state={newsletterState} />
        </section>

        <section className="cinema-panel cinema-panel--explorer">
          <div className="cinema-panel__heading cinema-panel__heading--stacked cinema-panel__heading--compact">
            <h2>DIG THROUGH THE ASH. SORT THE BODIES.</h2>
          </div>
          <BrowseExplorer
            reviews={reviews}
            emptyMessage="Nothing survived this filter pass."
          />
        </section>

        <section className="cinema-panel cinema-panel--latest">
          <div className="cinema-latest-grid">
            {latest.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
