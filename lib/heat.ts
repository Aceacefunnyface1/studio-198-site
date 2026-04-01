import { Review } from "@/lib/types";

type HeatSource = Pick<
  Review,
  "slug" | "movieTitle" | "verdict" | "rating" | "featured"
> & {
  likeCount?: number | null;
};

const LOW_RANGE = [40, 120] as const;
const MEDIUM_RANGE = [121, 300] as const;
const HIGH_RANGE = [301, 900] as const;

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getRange(review: HeatSource) {
  const rating = review.rating ?? 0;
  const likeCount = review.likeCount ?? 0;

  if (
    review.featured ||
    likeCount >= 12 ||
    rating >= 4.4 ||
    (review.verdict === "WATCH" && rating >= 4)
  ) {
    return HIGH_RANGE;
  }

  if (review.verdict === "WATCH" || likeCount >= 4 || rating >= 3) {
    return MEDIUM_RANGE;
  }

  return LOW_RANGE;
}

export function getHeatCount(review: HeatSource) {
  const hash = hashString(
    [
      review.slug,
      review.movieTitle,
      review.verdict,
      review.rating ?? "pending",
      review.featured ? "featured" : "standard",
    ].join("|"),
  );
  const [min, max] = getRange(review);
  const spread = max - min;
  const likeCount = review.likeCount ?? 0;

  if (likeCount > 0) {
    return Math.min(max, min + likeCount * 23 + (hash % 67));
  }

  return min + (hash % (spread + 1));
}

