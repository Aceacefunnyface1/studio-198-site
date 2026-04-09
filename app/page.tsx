import Image from "next/image";
import Link from "next/link";
import { PosterShelfRow } from "@/components/poster-shelf-row";
import { getHomepageShelfBundle } from "@/lib/review-queries";

const reviewerPortraits = {
  Ace: {
    image: "/about/ace.jpg",
    alt: "Ace portrait",
  },
  Mindy: {
    image: "/about/mindy.jpg",
    alt: "Mindy portrait",
  },
  Leeanna: {
    image: "/about/leeanne.jpg",
    alt: "Leeanna portrait",
  },
} as const;

const ROB_ZOMBIE_FALLBACK_HREF = "/reviews?search=Rob%20Zombie#browse-all";
const TARANTINO_FALLBACK_HREF = "/reviews?search=Quentin%20Tarantino#browse-all";

export default async function HomePage() {
  const homepageShelves = await getHomepageShelfBundle();
  const collectionSectionByTitle = new Map(
    homepageShelves.collectionSections.map((section) => [section.title, section]),
  );
  const robZombieHref =
    collectionSectionByTitle.get("Rob Zombie Collection")?.viewAllHref ??
    ROB_ZOMBIE_FALLBACK_HREF;
  const tarantinoHref =
    collectionSectionByTitle.get("Quentin Tarantino Collection")?.viewAllHref ??
    TARANTINO_FALLBACK_HREF;

  return (
    <div className="cinema-home">
      <div className="cinema-home__backdrop" aria-hidden="true">
        <div className="cinema-home__backdrop-top" />
        <div className="cinema-home__backdrop-mid" />
        <div className="cinema-home__backdrop-bottom" />
      </div>

      <div className="cinema-home__column">
        <section className="cinema-panel cinema-panel--hero cinema-panel--hero-vault">
          <h1 className="sr-only">Studio 198 featured collection hero</h1>

          <div className="hero-vault-card">
            <div className="hero-vault-card__top-bar" aria-hidden="true" />

            <div className="hero-vault-card__media">
              <img
                src="/home-hero/hero-placeholder.png"
                alt="Hero placeholder art. Replace public/home-hero/hero-placeholder.png to swap this image."
              />
            </div>

            <div className="hero-vault-card__buttons" aria-label="Collection vault links">
              <Link href={robZombieHref} className="hero-vault-card__button">
                <img src="/home-hero/rob-zombie-button.png" alt="" />
                <span>Enter the Rob Zombie Vault</span>
              </Link>

              <Link href={tarantinoHref} className="hero-vault-card__button">
                <img src="/home-hero/tarantino-button.png" alt="" />
                <span>Enter the Tarantino Vault</span>
              </Link>
            </div>

            <div className="hero-vault-card__fire" aria-hidden="true">
              <img src="/home-hero/fire-strip.png" alt="" />
            </div>
          </div>
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

        {homepageShelves.collectionSections.map((section) => {
          const subtitle =
            section.title === "Quentin Tarantino Collection"
              ? "Full reviews, posters, and comments in the exact order you set."
              : section.title === "Rob Zombie Collection"
                ? "Every Rob Zombie title in one place."
                : section.title === "Alfred Hitchcock Collection"
                  ? "The Hitchcock run, lined up in chronological order."
                  : section.title === "Brian De Palma Collection"
                    ? "The De Palma run, lined up in chronological order."
                    : "";

          return (
            <section key={section.title} className="cinema-panel cinema-panel--shelf">
              <div className="cinema-panel__heading">
                <div>
                  <h2>{section.title}</h2>
                  {subtitle ? (
                    <p className="cinema-panel__subtitle">{subtitle}</p>
                  ) : null}
                </div>
                <Link href={section.viewAllHref}>View All</Link>
              </div>
              <PosterShelfRow ariaLabel={section.title} reviews={section.reviews} />
            </section>
          );
        })}

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
