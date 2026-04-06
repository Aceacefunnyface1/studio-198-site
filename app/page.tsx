import Image from "next/image";
import Link from "next/link";
import { PosterShelfRow } from "@/components/poster-shelf-row";
import { POSTER_MATCH_ROUTE } from "@/lib/poster-match";
import {
  getDailyFeaturedReview,
  getHomepageShelfBundle,
  getPublishedReviewsWithStats,
} from "@/lib/review-queries";

const reviewerPortraits = {
  Ace: {
    image: "/about/ace.jpg",
    alt: "Ace portrait",
  },
  Mindy: {
    image: "/about/mandy.jpg",
    alt: "Mindy portrait",
  },
  Leeanna: {
    image: "/about/leeanne.jpg",
    alt: "Leeanna portrait",
  },
} as const;

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

            <form
              action="/reviews"
              method="get"
              className="cinema-home__search"
              role="search"
            >
              <label htmlFor="home-search" className="sr-only">
                Search the archive
              </label>
              <div className="cinema-home__search-row">
                <input
                  id="home-search"
                  name="search"
                  type="search"
                  placeholder="Search movie title or review video"
                />
                <button type="submit" className="button-primary">
                  Search
                </button>
              </div>
            </form>

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

          <div
            className="cinema-panel__stage cinema-panel__stage--hero-art"
            aria-hidden="true"
          />
        </section>

        <section className="cinema-panel cinema-panel--weekly-picks">
          <div className="cinema-panel__heading">
            <h2>Three Picks from the Furnace</h2>
          </div>

          <div className="weekly-picks-grid" aria-label="Three Picks from the Furnace">
            {homepageShelves.weeklyPicks.map((pick) => {
              const portrait = reviewerPortraits[pick.reviewerName];

              return (
                <Link
                  key={pick.review.id}
                  href={`/reviews/${pick.review.slug}`}
                  className="weekly-pick-feature"
                >
                  <div className="weekly-pick-feature__media">
                    <div className="weekly-pick-feature__reviewer-image">
                      <Image
                        src={portrait.image}
                        alt={portrait.alt}
                        fill
                        sizes="76px"
                      />
                    </div>
                    <div className="weekly-pick-feature__poster">
                      <Image
                        src={pick.review.resolvedPosterImage}
                        alt={`${pick.review.movieTitle} poster`}
                        fill
                        sizes="90px"
                      />
                    </div>
                  </div>

                  <div className="weekly-pick-feature__copy">
                    <p className="weekly-pick-feature__name">{pick.reviewerName}</p>
                    <h3>{pick.review.movieTitle}</h3>
                    <p className="weekly-pick-feature__hook">{pick.reason}</p>
                  </div>
                </Link>
              );
            })}
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
                <h2>{section.title}</h2>
                {section.title === "The Bloody Birth of Horror" ? (
                  <p className="cinema-panel__subtitle">
                    Where horror began—tap a film and feel the first scream.
                  </p>
                ) : null}
              </div>
              <Link href={section.viewAllHref}>View All</Link>
            </div>
            <PosterShelfRow ariaLabel={section.title} reviews={section.reviews} />
          </section>
        ))}

        {homepageShelves.quentinTarantinoCollection ? (
          <section className="cinema-panel cinema-panel--shelf">
            <div className="cinema-panel__heading">
              <div>
                <h2>{homepageShelves.quentinTarantinoCollection.title}</h2>
                <p className="cinema-panel__subtitle">
                  Full reviews, posters, and comments in the exact order you set.
                </p>
              </div>
              <Link href={homepageShelves.quentinTarantinoCollection.viewAllHref}>
                View All
              </Link>
            </div>
            <PosterShelfRow
              ariaLabel={homepageShelves.quentinTarantinoCollection.title}
              reviews={homepageShelves.quentinTarantinoCollection.reviews}
            />
          </section>
        ) : null}

        {homepageShelves.robZombieCollection ? (
          <section className="cinema-panel cinema-panel--shelf">
            <div className="cinema-panel__heading">
              <div>
                <h2>{homepageShelves.robZombieCollection.title}</h2>
                <p className="cinema-panel__subtitle">
                  Every Rob Zombie title in one place.
                </p>
              </div>
              <Link href={homepageShelves.robZombieCollection.viewAllHref}>View All</Link>
            </div>
            <PosterShelfRow
              ariaLabel={homepageShelves.robZombieCollection.title}
              reviews={homepageShelves.robZombieCollection.reviews}
            />
          </section>
        ) : null}

        <section className="cinema-panel cinema-panel--archive-entry">
          <div className="archive-entry-block">
            <p className="eyebrow">Full Archive</p>
            <h2>Full Archive</h2>
            <p>Every film. No mercy. Dig in.</p>
            <Link href="/reviews" className="button-primary">
              Enter the Archive
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
