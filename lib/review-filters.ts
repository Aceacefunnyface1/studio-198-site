import { ReviewWithStats } from "@/lib/types";

export type ReviewFilters = {
  search: string;
  verdict: string;
  genre: string;
  rating: string;
  sort: string;
  featuredOnly: boolean;
};

export const defaultFilters: ReviewFilters = {
  search: "",
  verdict: "all",
  genre: "all",
  rating: "all",
  sort: "newest",
  featuredOnly: false,
};

export function collectGenres(reviews: ReviewWithStats[]) {
  return [...new Set(reviews.flatMap((review) => review.genreTags))].sort();
}

export function applyReviewFilters(
  reviews: ReviewWithStats[],
  filters: ReviewFilters,
) {
  const searchQuery = filters.search.trim().toLowerCase();

  const filtered = reviews.filter((review) => {
    const haystack = [
      review.movieTitle,
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
        return right.likeCount - left.likeCount;
      default:
        return +new Date(right.createdAt) - +new Date(left.createdAt);
    }
  });
}
