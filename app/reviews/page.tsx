import type { Metadata } from "next";
import Link from "next/link";
import { BrowseExplorer } from "@/components/browse-explorer";
import { ReviewCard } from "@/components/review-card";
import {
  EARLY_HORROR_SUBTITLE,
  EARLY_HORROR_SUPPORT_LINE,
  EARLY_HORROR_TITLE,
} from "@/lib/early-horror";
import { applyReviewFilters, type ReviewFilters } from "@/lib/review-filters";
import { getPublishedReviewsWithStats } from "@/lib/review-queries";
import { ReviewWithStats } from "@/lib/types";
import { getReviewerPresentation } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviews Archive",
  description:
    "Browse every published Snap Critique review by verdict, genre, rating, or popularity.",
};

type ReviewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type ArchiveSection = {
  title: string;
  eyebrow: string;
  viewAllHref: string;
  reviews: ReviewWithStats[];
};

type ReviewerPick = {
  review: ReviewWithStats;
  reviewerName: string;
  tone: "ace" | "mandy" | "leeanna";
  reason: string;
};

function getSectionReviews(
  reviews: ReviewWithStats[],
  filters: Partial<ReviewFilters>,
  limit = 10,
) {
  return applyReviewFilters(reviews, {
    search: "",
    verdict: "all",
    genre: "all",
    decade: "all",
    rating: "all",
    sort: "newest",
    featuredOnly: false,
    ...filters,
  }).slice(0, limit);
}

function getDecadeSection(
  reviews: ReviewWithStats[],
  decade: string,
): ArchiveSection | null {
  const decadeReviews = getSectionReviews(reviews, { decade });

  if (decadeReviews.length === 0) {
    return null;
  }

  return {
    title: `${decade} Verdicts`,
    eyebrow: "Decade",
    viewAllHref: `/reviews?decade=${encodeURIComponent(decade)}#browse-all`,
    reviews: decadeReviews,
  };
}

function getTopDecadeSections(
  reviews: ReviewWithStats[],
  excludedDecades: Set<string> = new Set(),
) {
  const counts = new Map<string, number>();

  for (const review of reviews) {
    if (typeof review.releaseYear !== "number") {
      continue;
    }

    const decade = `${Math.floor(review.releaseYear / 10) * 10}s`;
    counts.set(decade, (counts.get(decade) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([decade]) => !excludedDecades.has(decade))
    .filter(([, count]) => count >= 6)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([decade]) => ({
      title: `${decade} Verdicts`,
      eyebrow: "Decade",
      viewAllHref: `/reviews?decade=${encodeURIComponent(decade)}#browse-all`,
      reviews: getSectionReviews(reviews, { decade }),
    }));
}

function getTopGenreSections(reviews: ReviewWithStats[]) {
  const counts = new Map<string, number>();

  for (const review of reviews) {
    for (const genre of review.genreTags) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 12)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([genre]) => ({
      title: genre,
      eyebrow: "Genre",
      viewAllHref: `/reviews?genre=${encodeURIComponent(genre)}#browse-all`,
      reviews: getSectionReviews(reviews, { genre }),
    }));
}

function getArchiveSections(reviews: ReviewWithStats[]): ArchiveSection[] {
  const anchoredDecades = ["1970s", "1980s"];
  const fixedDecades = anchoredDecades
    .map((decade) => getDecadeSection(reviews, decade))
    .filter((section): section is ArchiveSection => Boolean(section));
  const remainingDecades = getTopDecadeSections(
    reviews,
    new Set(anchoredDecades),
  );

  return [...fixedDecades, ...remainingDecades, ...getTopGenreSections(reviews)];
}

function getPickReason(review: ReviewWithStats) {
  const sentence = review.quickHit
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .find(Boolean);

  return sentence || "Read the full verdict.";
}

function getReviewerWeeklyPicks(reviews: ReviewWithStats[]): ReviewerPick[] {
  const reviewerOrder = ["Ace", "Mindy", "Leeanna"];

  return reviewerOrder
    .map((reviewerName) => {
      const review = reviews
        .filter((entry) => entry.reviewerName === reviewerName)
        .sort(
          (left, right) =>
            +new Date(right.createdAt) - +new Date(left.createdAt),
        )[0];

      if (!review) {
        return null;
      }

      const presentation = getReviewerPresentation(reviewerName);

      return {
        review,
        reviewerName,
        tone: presentation.tone,
        reason: getPickReason(review),
      } satisfies ReviewerPick;
    })
    .filter((entry): entry is ReviewerPick => Boolean(entry));
}

function getSingleSearchParam(
  value: string | string[] | undefined,
  fallback: string,
) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function getInitialFilters(
  searchParams: Record<string, string | string[] | undefined>,
): Partial<ReviewFilters> {
  return {
    search: getSingleSearchParam(searchParams.search, ""),
    verdict: getSingleSearchParam(searchParams.verdict, "all"),
    genre: getSingleSearchParam(searchParams.genre, "all"),
    decade: getSingleSearchParam(searchParams.decade, "all"),
    rating: getSingleSearchParam(searchParams.rating, "all"),
    sort: getSingleSearchParam(searchParams.sort, "newest"),
    featuredOnly: getSingleSearchParam(searchParams.featuredOnly, "no") === "yes",
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const reviews = await getPublishedReviewsWithStats();
  const resolvedSearchParams = await searchParams;
  const archiveSections = getArchiveSections(reviews);
  const weeklyPicks = getReviewerWeeklyPicks(reviews);
  const initialFilters = getInitialFilters(resolvedSearchParams);

  return (
    <div className="page-stack">
      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviews Archive</p>
            <h2>Every published verdict in one place</h2>
          </div>
        </div>

        <section className="furnace-picks-section" aria-labelledby="furnace-picks-title">
          <div className="section-heading archive-row-section__heading">
            <div>
              <p className="eyebrow">Weekly Picks</p>
              <h2 id="furnace-picks-title">Three Picks from the Furnace</h2>
            </div>
          </div>

          <div className="furnace-picks-row" aria-label="Three Picks from the Furnace">
            {weeklyPicks.map((pick) => (
              <Link
                key={pick.review.id}
                href={`/reviews/${pick.review.slug}`}
                className={`furnace-pick-card furnace-pick-card--${pick.tone}`}
              >
                <div className="furnace-pick-card__poster">
                  <img
                    src={pick.review.resolvedPosterImage}
                    alt={`${pick.review.movieTitle} poster`}
                  />
                </div>

                <div className="furnace-pick-card__body">
                  <p className="furnace-pick-card__reviewer">{pick.reviewerName}</p>
                  <h3>{pick.review.movieTitle}</h3>
                  <p className="furnace-pick-card__reason">{pick.reason}</p>
                  <span className="furnace-pick-card__cta">Read Review</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bloody-birth-callout" aria-labelledby="bloody-birth-title">
          <div>
            <p className="eyebrow">{EARLY_HORROR_SUBTITLE}</p>
            <h2 id="bloody-birth-title">{EARLY_HORROR_TITLE}</h2>
            <p>{EARLY_HORROR_SUPPORT_LINE}</p>
          </div>
          <Link href="/early-horror" className="text-link">
            Browse The Bloody Birth of Horror
          </Link>
        </section>

        <div className="archive-section-stack">
          {archiveSections.map((section) => (
            <section key={section.title} className="archive-row-section">
              <div className="section-heading archive-row-section__heading">
                <div>
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.title}</h2>
                </div>
                <Link href={section.viewAllHref} className="text-link">
                  View All
                </Link>
              </div>

              <div className="archive-row" aria-label={section.title}>
                {section.reviews.map((review) => (
                  <div key={review.id} className="archive-row__item">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="content-section" id="browse-all">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse All</p>
            <h2>Filter the full archive</h2>
          </div>
        </div>
        <BrowseExplorer
          reviews={reviews}
          emptyMessage="No reviews matched the archive filters."
          initialFilters={initialFilters}
        />
      </section>
    </div>
  );
}
