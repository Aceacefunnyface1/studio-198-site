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
  const leadReview = spotlightReviews[0] ?? null;
  const supportReviews = spotlightReviews.slice(1, 3);

  return (
    <div className="cinema-home">
      <section className="cinema-band cinema-band--top">
        <div className="cinema-shell cinema-shell--hero">
          <div className="cinema-hero-copy">
            <p className="eyebrow cinema-home__eyebrow">Studio 198 presents</p>
            <h1 className="cinema-home__title">
              <span>SNAP</span>
              <span>CRITIQUE</span>
            </h1>
            <p className="cinema-home__tagline">NO HYPE. NO MERCY.</p>
            <p className="cinema-home__lede">
              Poster-first movie verdicts with heat, smoke, and zero patience
              for fake praise.
            </p>
            <p className="cinema-home__lede">
              If it hits, it earns obsession. If it misses, it gets dragged.
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

            <div className="cinema-home__stats" aria-label="Site atmosphere">
              <div>
                <span>Archive</span>
                <strong>{reviews.length} verdicts</strong>
              </div>
              <div>
                <span>Tone</span>
                <strong>Unforgiving</strong>
              </div>
              <div>
                <span>Heat</span>
                <strong>Always on</strong>
              </div>
            </div>
          </div>

          <div className="cinema-hero-stage">
            <div className="cinema-hero-stage__main">
              <img
                src="/inferno/demon-garage.png"
                alt="Infernal hot rods in front of a towering demon"
              />
            </div>

            <div className="cinema-hero-stage__featured">
              <p>Tonight&apos;s sacrifice</p>
              <div className="cinema-hero-stage__poster">
                <img
                  src={heroReview?.resolvedPosterImage ?? "/posters/next-review-slot.svg"}
                  alt={
                    heroReview
                      ? `${heroReview.movieTitle} poster`
                      : "Next review slot"
                  }
                />
              </div>
              <div className="cinema-hero-stage__featured-copy">
                <h2>{heroReview?.movieTitle ?? "Next film on the pyre"}</h2>
                <span>
                  {heroReview?.releaseYear ? `${heroReview.releaseYear} / ` : ""}
                  {heroReview?.ratingLabel ?? "Awaiting rating"}
                </span>
              </div>
            </div>

            <div className="cinema-hero-stage__detail cinema-hero-stage__detail--top">
              <img
                src="/inferno/hellscape-wide.png"
                alt="Burning fortress on the edge of a lava field"
              />
            </div>

            <div className="cinema-hero-stage__detail cinema-hero-stage__detail--bottom">
              <img
                src="/inferno/hellscape-alt.png"
                alt="Infernal canyon with a river of lava"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cinema-band cinema-band--middle">
        <div className="cinema-shell cinema-shell--poster-wall">
          <div className="cinema-section-heading">
            <div>
              <p className="eyebrow">Featured verdicts</p>
              <h2>POSTER WALL. FRESH DAMAGE.</h2>
            </div>
            <Link href="/reviews" className="cinema-section-heading__link">
              See all reviews
            </Link>
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
                  <span className={`verdict-badge verdict-${leadReview.verdictKey}`}>
                    {leadReview.verdict}
                  </span>
                  <div>
                    <h3>{leadReview.movieTitle}</h3>
                    <p>
                      {leadReview.quickHit?.split(".")[0] ??
                        "Fresh damage on the wall."}
                    </p>
                  </div>
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
                    <span className={`verdict-badge verdict-${review.verdictKey}`}>
                      {review.verdict}
                    </span>
                    <div>
                      <h3>{review.movieTitle}</h3>
                      <p>{review.quickHit?.split(".")[0] ?? "Still burning."}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="cinema-shell cinema-shell--explorer">
          <div className="cinema-section-heading cinema-section-heading--stacked">
            <div>
              <p className="eyebrow">Dig through the ash</p>
              <h2>Sort the bodies.</h2>
            </div>
            <p className="cinema-section-heading__copy">
              Search, filter, and pull up every review without losing the dark
              theatrical feel from the landing page.
            </p>
          </div>
          <BrowseExplorer
            reviews={reviews}
            emptyMessage="Nothing survived this filter pass."
          />
        </div>

        <div className="cinema-shell cinema-shell--latest">
          <div className="cinema-section-heading cinema-section-heading--stacked">
            <div>
              <p className="eyebrow">Latest files</p>
              <h2>New arrivals on the lower level.</h2>
            </div>
            <p className="cinema-section-heading__copy">
              Fresh reviews stay front and center before they disappear into the
              wider archive.
            </p>
          </div>

          <div className="card-grid card-grid-featured cinema-latest-grid">
            {latest.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <section className="cinema-band cinema-band--bottom">
        <div className="cinema-bottom-spacer" aria-hidden="true" />
      </section>
    </div>
  );
}
