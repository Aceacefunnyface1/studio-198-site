import { ReviewWithStats } from "@/lib/types";

export type ReviewFilters = {
  search: string;
  verdict: string;
  genre: string;
  decade: string;
  rating: string;
  sort: string;
  featuredOnly: boolean;
};

export const defaultFilters: ReviewFilters = {
  search: "",
  verdict: "all",
  genre: "all",
  decade: "all",
  rating: "all",
  sort: "newest",
  featuredOnly: false,
};

export function collectGenres(reviews: ReviewWithStats[]) {
  return [...new Set(reviews.flatMap((review) => review.genreTags))].sort();
}

export function collectDecades(reviews: ReviewWithStats[]) {
  return [
    ...new Set(
      reviews
        .map((review) =>
          typeof review.releaseYear === "number"
            ? `${Math.floor(review.releaseYear / 10) * 10}s`
            : null,
        )
        .filter((decade): decade is string => Boolean(decade)),
    ),
  ].sort((left, right) => Number.parseInt(right, 10) - Number.parseInt(left, 10));
}

export function applyReviewFilters(
  reviews: ReviewWithStats[],
  filters: ReviewFilters,
) {
  const searchQuery = filters.search.trim().toLowerCase();

  const filtered = reviews.filter((review) => {
    const haystack = [
      review.movieTitle,
      review.director,
      review.collection,
      review.reviewVideoUrl,
      review.verdict,
      review.quickHit,
      review.fullTake,
      review.genreTags.join(" "),
      review.moodTags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchQuery || haystack.includes(searchQuery);
    const matchesVerdict =
      filters.verdict === "all" || review.verdict === filters.verdict;
    const matchesGenre =
      filters.genre === "all" || review.genreTags.includes(filters.genre);
    const matchesDecade =
      filters.decade === "all" ||
      (typeof review.releaseYear === "number" &&
        `${Math.floor(review.releaseYear / 10) * 10}s` === filters.decade);
    const matchesFeatured = !filters.featuredOnly || review.featured;
    const minRating =
      filters.rating === "all" ? null : Number.parseFloat(filters.rating);
    const matchesRating =
      minRating === null ||
      (review.rating !== null && review.rating >= minRating);

    return (
      matchesSearch &&
      matchesVerdict &&
      matchesGenre &&
      matchesDecade &&
      matchesFeatured &&
      matchesRating
    );
  });

  return filtered.sort((left, right) => {
    switch (filters.sort) {
      case "oldest":
        return +new Date(left.createdAt) - +new Date(right.createdAt);
      case "rating":
        return (right.rating ?? -1) - (left.rating ?? -1);
      case "popularity":
        return right.heatCount - left.heatCount;
      default:
        return +new Date(right.createdAt) - +new Date(left.createdAt);
    }
  });
}
