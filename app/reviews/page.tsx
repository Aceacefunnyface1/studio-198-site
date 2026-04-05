import type { Metadata } from "next";
import Link from "next/link";
import { BrowseExplorer } from "@/components/browse-explorer";
import { ReviewCard } from "@/components/review-card";
import { applyReviewFilters, type ReviewFilters } from "@/lib/review-filters";
import { getPublishedReviewsWithStats } from "@/lib/review-queries";
import { ReviewWithStats } from "@/lib/types";

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

function getTopDecadeSections(reviews: ReviewWithStats[]) {
  const counts = new Map<string, number>();

  for (const review of reviews) {
    if (typeof review.releaseYear !== "number") {
      continue;
    }

    const decade = `${Math.floor(review.releaseYear / 10) * 10}s`;
    counts.set(decade, (counts.get(decade) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 6)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([decade]) => ({
      title: `${decade} Verdicts`,
      eyebrow: "Decade",
      viewAllHref: `/reviews?decade=${encodeURIComponent(decade)}#browse-all`,
      reviews: applyReviewFilters(reviews, {
        search: "",
        verdict: "all",
        genre: "all",
        decade,
        rating: "all",
        sort: "newest",
        featuredOnly: false,
      }).slice(0, 10),
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
      reviews: applyReviewFilters(reviews, {
        search: "",
        verdict: "all",
        genre,
        decade: "all",
        rating: "all",
        sort: "newest",
        featuredOnly: false,
      }).slice(0, 10),
    }));
}

function getArchiveSections(reviews: ReviewWithStats[]): ArchiveSection[] {
  return [...getTopDecadeSections(reviews), ...getTopGenreSections(reviews)];
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
  const initialFilters = getInitialFilters(resolvedSearchParams);

  return (
    <div className="page-stack">
      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviews Archive</p>
            <h2>Every published verdict in one place</h2>
          </div>
          <Link href="/early-horror" className="text-link">
            Browse The Bloody Birth of Horror
          </Link>
        </div>
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
