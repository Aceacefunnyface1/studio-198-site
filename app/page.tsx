import Image from "next/image";
import Link from "next/link";
import { BrowseExplorer } from "@/components/browse-explorer";
import NewsletterBlock from "@/components/newsletter-block";
import { PosterShelfRow } from "@/components/poster-shelf-row";
import { POSTER_MATCH_ROUTE } from "@/lib/poster-match";
import {
  getDailyFeaturedReview,
  getHomepageShelfBundle,
  getPublishedReviewsWithStats,
} from "@/lib/review-queries";

export default async function HomePage() {
  const reviews = await getPublishedReviewsWithStats();
  const heroReview = getDailyFeaturedReview(reviews);
  const homepageShelves = await getHomepageShelfBundle();

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
              <Link href={POSTER_MATCH_ROUTE} className="button-primary">
                Play Poster Match
              </Link>
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
              <Image
                src="/inferno/demon-garage.png"
                alt="Infernal hot rods in front of a towering demon"
                fill
                sizes="(max-width: 980px) 100vw, 46vw"
                priority
              />
            </div>

            <div className="cinema-stage__mini cinema-stage__mini--top">
              <Image
                src="/inferno/hellscape-wide.png"
                alt="Burning fortress on the edge of a lava field"
                fill
                sizes="102px"
              />
            </div>

            <div className="cinema-stage__featured">
              <div className="cinema-stage__featured-poster">
                <Image
                  src={heroReview?.resolvedPosterImage ?? "/posters/next-review-slot.svg"}
                  alt={
                    heroReview
                      ? `${heroReview.movieTitle} poster`
                      : "Next review slot"
                  }
                  fill
                  sizes="112px"
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

        <section className="cinema-panel cinema-panel--weekly-picks">
          <div className="cinema-panel__heading">
            <h2>Three Picks from the Furnace</h2>
          </div>

          <div
            className="weekly-picks-row"
            aria-label="Three Picks from the Furnace"
          >
            {homepageShelves.weeklyPicks.map((pick) => (
              <Link
                key={pick.review.id}
                href={`/reviews/${pick.review.slug}`}
                className="weekly-pick-card"
              >
                <div className="weekly-pick-card__poster">
                  <Image
                    src={pick.review.resolvedPosterImage}
                    alt={`${pick.review.movieTitle} poster`}
                    fill
                    sizes="(max-width: 699px) 110px, 132px"
                  />
                </div>
                <div className="weekly-pick-card__body">
                  <h3>{pick.review.movieTitle}</h3>
                  <p className="weekly-pick-card__reviewer">{pick.reviewerName}</p>
                  <p className="weekly-pick-card__reason">{pick.reason}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {homepageShelves.shelves.map((section) => (
          <section key={section.title} className="cinema-panel cinema-panel--shelf">
            <div
              className={`cinema-panel__heading ${
                section.title === "The Bloody Birth of Horror"
                  ? "cinema-panel__heading--bloody-birth"
                  : ""
              }`}
            >
              <div>
                {section.title === "The Bloody Birth of Horror" ? (
                  <p className="cinema-panel__kicker">1896-1969</p>
                ) : null}
                <h2>{section.title}</h2>
              </div>
              <Link href={section.viewAllHref}>View All</Link>
            </div>
            <PosterShelfRow
              ariaLabel={section.title}
              reviews={section.reviews}
            />
          </section>
        ))}

        <section className="cinema-panel cinema-panel--explorer">
          <div className="cinema-panel__heading cinema-panel__heading--stacked">
            <div>
              <p className="eyebrow">Full Archive</p>
              <h2>Full Archive</h2>
            </div>
            <p>
              Full cards, filters, and search live down here after the curated
              shelves.
            </p>
          </div>
          <BrowseExplorer
            reviews={reviews}
            emptyMessage="Nothing survived this filter pass."
          />
        </section>

        <section className="cinema-panel cinema-panel--newsletter">
          <NewsletterBlock />
        </section>

        <section className="cinema-panel cinema-panel--support">
          <div className="support-panel">
            <div className="support-panel__copy">
              <p className="eyebrow">Support</p>
              <h2>SUPPORT THE VERDICT</h2>
              <p>If Snap Critique hits, support keeps it alive.</p>
              <a
                href="https://buymeacoffee.com/ace198"
                target="_blank"
                rel="noreferrer"
                className="button-primary"
              >
                Support Snap Critique
              </a>
            </div>

            <div className="support-panel__qr">
              <Image
                src="/bmc_qr.png"
                alt="Buy Me a Coffee QR code for Snap Critique support"
                width={220}
                height={220}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
