import "server-only";

import { resolvePoster } from "@/lib/poster-resolver";
import { readSiteData, sortReviewsByNewest } from "@/lib/site-data";
import { Comment, Review, ReviewWithStats } from "@/lib/types";
import { ratingLabel, verdictKey } from "@/lib/utils";

function hasResolvedPoster(review: Review) {
  return resolvePoster(review).posterStatus !== "missing";
}

function hasAmazonAffiliateUrl(review: Review) {
  return Boolean(review.amazonAffiliateUrl?.trim());
}

function withStats(review: Review, likes: Record<string, number>, comments: Comment[]) {
  const visibleComments = comments.filter(
    (comment) => comment.reviewId === review.id && comment.status === "visible",
  );

  return {
    ...review,
    ...resolvePoster(review),
    likeCount: likes[review.id] ?? 0,
    commentCount: visibleComments.length,
    ratingLabel: ratingLabel(review.rating),
    verdictKey: verdictKey(review.verdict),
  } satisfies ReviewWithStats;
}

export async function getPublishedReviewsWithStats() {
  const data = await readSiteData();
  const publishedReviews = data.reviews.filter(
    (review) => review.status === "published" && hasResolvedPoster(review),
  );

  return sortReviewsByNewest(publishedReviews).map((review) =>
    withStats(review, data.likes, data.comments),
  );
}

export async function getAllReviewsWithStats() {
  const data = await readSiteData();

  return sortReviewsByNewest(data.reviews).map((review) =>
    withStats(review, data.likes, data.comments),
  );
}

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getDailyFeaturedReview(
  reviews: ReviewWithStats[],
  now = new Date(),
) {
  const eligibleReviews = [...reviews]
    .filter(
      (review) =>
        review.status === "published" &&
        review.posterStatus === "approved" &&
        hasAmazonAffiliateUrl(review),
    )
    .sort((left, right) => left.slug.localeCompare(right.slug));

  if (!eligibleReviews.length) {
    return null;
  }

  const dayOfYear = getDayOfYear(now);
  return eligibleReviews[dayOfYear % eligibleReviews.length];
}

export async function getReviewBundle(slug: string) {
  const data = await readSiteData();
  const review = data.reviews.find((entry) => entry.slug === slug);

  if (!review || !hasResolvedPoster(review)) {
    return null;
  }

  const reviewWithStats = withStats(review, data.likes, data.comments);
  const comments = data.comments
    .filter(
      (comment) => comment.reviewId === review.id && comment.status === "visible",
    )
    .sort((left, right) => +new Date(right.createdAt) - +new Date(left.createdAt));
  const related = sortReviewsByNewest(
    data.reviews.filter(
      (entry) =>
        entry.status === "published" &&
        hasResolvedPoster(entry) &&
        entry.id !== review.id &&
        entry.genreTags.some((tag) => review.genreTags.includes(tag)),
    ),
  )
    .slice(0, 3)
    .map((entry) => withStats(entry, data.likes, data.comments));

  return {
    review: reviewWithStats,
    comments,
    related,
  };
}
