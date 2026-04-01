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
      <section className="studio-hero hell-hero">
        <div className="studio-hero__bg" />
        <div className="studio-hero__texture" />
        <div className="studio-hero__vignette" />
        <div className="studio-hero__frame" />
        <div className="studio-hero__topline" />
        <div className="studio-hero__seal" />
        <div className="studio-hero__crack" />
        <div className="studio-hero__haze" />
        <div className="studio-hero__embers" />

        <div className="hell-hero__smoke" />
        <div className="hell-hero__lava" />
        <div className="hell-hero__ash" />

        <div className="hell-hero__inner">
          <div className="hell-hero__copy">
            <p className="studio-hero__eyebrow">STUDIO 198 DESCENDS</p>

            <h1 className="studio-hero__title hell-hero__title">
              <span>WELCOME</span>
              <span>BELOW</span>
            </h1>

            <p className="studio-hero__tagline hell-hero__tagline">
              A movie site that feels like the gates already closed behind you.
            </p>

            <div className="hell-hero__body">
              <p className="studio-hero__body">
                Lava in the sky. Smoke in the air. Reviews carved out with heat,
                venom, and no interest in playing nice.
              </p>
              <p className="studio-hero__body">
                This is the archive for films that earn obsession, survive the
                fire, or get dragged straight into it.
              </p>
            </div>

            <p className="studio-hero__aggression">ENTER AT YOUR OWN RISK.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/reviews" className="studio-btn studio-btn--primary">
                Enter the Fire
              </Link>
              <Link
                href={featuredReview ? `/reviews/${featuredReview.slug}` : "/reviews"}
                className="studio-btn studio-btn--secondary"
              >
                Read Tonight&apos;s Verdict
              </Link>
            </div>

            <div className="hell-hero__stats" aria-label="Site atmosphere">
              <div className="hell-stat">
                <span className="hell-stat__label">Atmosphere</span>
                <strong>Molten</strong>
              </div>
              <div className="hell-stat">
                <span className="hell-stat__label">Tone</span>
                <strong>Unforgiving</strong>
              </div>
              <div className="hell-stat">
                <span className="hell-stat__label">Archive</span>
                <strong>{reviews.length} verdicts burning</strong>
              </div>
            </div>
          </div>

          <div className="hell-stage">
            <div className="hell-stage__main">
              <img
                src="/inferno/demon-garage.png"
                alt="Infernal hot rods in front of a towering demon"
              />
            </div>

            <div className="hell-stage__card hell-stage__card--landscape">
              <img
                src="/inferno/hellscape-wide.png"
                alt="Hell landscape with rivers of lava and a burning fortress"
              />
              <div className="hell-stage__card-copy">
                <p>Outer Ring</p>
                <span>The horizon never cools down.</span>
              </div>
            </div>

            <div className="hell-stage__card hell-stage__card--featured">
              <div className="hell-stage__featured-label">Tonight&apos;s Sacrifice</div>
              <div className="hell-stage__featured-poster">
                <img
                  src={featuredReview?.posterImage ?? "/posters/next-review-slot.svg"}
                  alt={
                    featuredReview
                      ? `${featuredReview.title} poster`
                      : "Next review slot"
                  }
                />
              </div>
              <div className="hell-stage__featured-copy">
                <h2>{featuredReview?.title ?? "Next film on the pyre"}</h2>
                <p>
                  {featuredReview?.quickHit ??
                    "A fresh verdict is being hauled up from the flames."}
                </p>
                <div className="hell-stage__featured-meta">
                  {featuredReview?.releaseYear ? (
                    <span>{featuredReview.releaseYear}</span>
                  ) : null}
                  {featuredReview?.rating ? <span>{featuredReview.rating}</span> : null}
                  {featuredReview ? <span>🔥 {featuredReview.heat} HEAT</span> : null}
                </div>
              </div>
            </div>

            <div className="hell-stage__card hell-stage__card--river">
              <img
                src="/inferno/hellscape-alt.png"
                alt="A river of lava cutting through a scorched infernal valley"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="page-stack hell-page-stack">
        <section className="content-section inferno-band">
          <div className="inferno-band__grid">
            <div className="inferno-band__panel">
              <p className="eyebrow">THE AIR SHOULD HURT</p>
              <h2>Everything on the page now runs hotter.</h2>
              <p>
                The look leans into lava rivers, cathedral silhouettes, ember
                glow, and scorched metal so the whole site feels hostile in the
                best possible way.
              </p>
            </div>
            <div className="inferno-band__list">
              <div className="inferno-band__item">
                <span>01</span>
                <strong>Burning skies and abyssal depth</strong>
              </div>
              <div className="inferno-band__item">
                <span>02</span>
                <strong>Molten highlights instead of clean gloss</strong>
              </div>
              <div className="inferno-band__item">
                <span>03</span>
                <strong>Sharper contrast so every section hits harder</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FEATURED VERDICTS</p>
              <h2>Fresh damage from the furnace wall.</h2>
            </div>
            <Link href="/reviews" className="text-link">
              Walk the whole pit
            </Link>
          </div>
          <div className="card-grid card-grid-featured">
            {spotlightReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>

        <section className="content-section hell-search-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SEARCH THE RUINS</p>
              <h2>Dig through the ash. Sort the bodies.</h2>
            </div>
          </div>
          <BrowseExplorer
            reviews={reviews}
            emptyMessage="Nothing survived this filter pass."
          />
        </section>

        <section className="content-section two-column-callout">
          <div className="callout-block">
            <p className="eyebrow">LATEST FILES</p>
            <h2>Fresh arrivals on the lower level</h2>
            <p>
              New reviews drop into the fire first. The ones with heat rise.
              The rest stay buried under smoke.
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
            <p className="eyebrow">HOUSE RULES</p>
            <h2>No safe takes. No cold corners.</h2>
            <p>
              Every page should feel infernal, but the reviews still need to hit
              clean. The goal is atmosphere with teeth, not noise for its own
              sake.
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
