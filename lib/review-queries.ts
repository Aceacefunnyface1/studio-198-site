import "server-only";

import {
  EARLY_HORROR_COLLECTION,
  EARLY_HORROR_END_YEAR,
  EARLY_HORROR_START_YEAR,
  EarlyHorrorDecadeKey,
  earlyHorrorDecades,
  getEarlyHorrorDecadeKey,
} from "@/lib/early-horror";
import { getHeatCount } from "@/lib/heat";
import { resolvePoster } from "@/lib/poster-resolver";
import { readSiteData, sortReviewsByNewest } from "@/lib/site-data";
import { Comment, Review, ReviewWithStats } from "@/lib/types";
import { ratingLabel, verdictTone } from "@/lib/utils";

const HOME_WEEKLY_PICK_CONFIG = [
  {
    reviewerName: "Ace",
    slug: "final-destination-bloodlines-2025",
    hook: "Ace says this week needs a clean hit of chaos, payoff, and crowd-pleasing damage.",
  },
  {
    reviewerName: "Mindy",
    slug: "rosemary-s-baby-1968",
    hook: "Mindy is pointing straight at dread this week: elegant, intimate, and still deeply upsetting.",
  },
  {
    reviewerName: "Leeanna",
    slug: "the-wailing-2016",
    hook: "Leeanna's pick this week is all control and escalation, the kind that keeps getting meaner the longer it sits.",
  },
] as const;

const ROB_ZOMBIE_COLLECTION_ORDER = [
  "house-of-1000-corpses-2003",
  "the-devils-rejects-2005",
  "halloween-2007",
  "halloween-ii-2009",
  "the-lords-of-salem-2012",
  "31-2016",
  "3-from-hell-2019",
  "the-munsters-2022",
  "the-haunted-world-of-el-superbeasto-2009",
  "werewolf-women-of-the-ss-2007",
] as const;

const QUENTIN_TARANTINO_COLLECTION_ORDER = [
  "pulp-fiction-1994",
  "reservoir-dogs",
  "inglourious-basterds",
  "jackie-brown-1997",
  "django-unchained",
  "once-upon-a-time-in-hollywood-2019",
  "kill-bill-vol-1-2003",
  "kill-bill-vol-2-2004",
  "the-hateful-eight-2015",
  "death-proof-2007",
] as const;

function hasResolvedPoster(review: Review) {
  return resolvePoster(review).posterStatus !== "missing";
}

function hasAmazonAffiliateUrl(review: Review) {
  return Boolean(review.amazonAffiliateUrl?.trim());
}

function hasUsableSlug(review: Review) {
  return Boolean(review.slug?.trim());
}

function isStandardArchiveReview(review: Review) {
  return review.collection !== EARLY_HORROR_COLLECTION;
}

function isChronologicallyEarlier(left: Review, right: Review) {
  return (left.releaseYear ?? 9999) - (right.releaseYear ?? 9999);
}

function sortReviewsChronologically<T extends Review>(reviews: T[]) {
  return [...reviews].sort((left, right) => {
    const yearDelta = isChronologicallyEarlier(left, right);

    if (yearDelta !== 0) {
      return yearDelta;
    }

    return left.movieTitle.localeCompare(right.movieTitle);
  });
}

function matchesReviewComment(comment: Comment, review: Review) {
  return (
    comment.status === "visible" &&
    (comment.reviewId === review.id || comment.reviewSlug === review.slug)
  );
}

function withStats(review: Review, likes: Record<string, number>, comments: Comment[]) {
  const visibleComments = comments.filter(
    (comment) => matchesReviewComment(comment, review),
  );
  const likeCount = likes[review.id] ?? 0;

  return {
    ...review,
    ...resolvePoster(review),
    likeCount,
    heatCount: getHeatCount({
      ...review,
      likeCount,
    }),
    commentCount: visibleComments.length,
    ratingLabel: ratingLabel(review.rating),
    verdictTone: verdictTone(review.verdict),
  } satisfies ReviewWithStats;
}

export async function getPublishedReviewsWithStats() {
  const data = await readSiteData();
  const publishedReviews = data.reviews.filter(
    (review) =>
      review.status === "published" &&
      hasResolvedPoster(review) &&
      isStandardArchiveReview(review),
  );

  return sortReviewsByNewest(publishedReviews).map((review) =>
    withStats(review, data.likes, data.comments),
  );
}

export type HomepageWeeklyPick = {
  reviewerName: "Ace" | "Mindy" | "Leeanna";
  review: ReviewWithStats;
  reason: string;
};

export type HomepageShelfSection = {
  title: string;
  viewAllHref: string;
  reviews: ReviewWithStats[];
};

export type HomepageShelfBundle = {
  quentinTarantinoCollection: HomepageShelfSection | null;
  robZombieCollection: HomepageShelfSection | null;
  weeklyPicks: HomepageWeeklyPick[];
  shelves: HomepageShelfSection[];
};

function getFirstQuickHitSentence(review: Pick<Review, "quickHit">) {
  return review.quickHit
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .find(Boolean) ?? "Read the full review.";
}

function getHomepageShelfSection(
  reviews: ReviewWithStats[],
  title: string,
  viewAllHref: string,
  predicate: (review: ReviewWithStats) => boolean,
  limit = 18,
) {
  const sectionReviews = reviews.filter(predicate).slice(0, limit);

  if (!sectionReviews.length) {
    return null;
  }

  return {
    title,
    viewAllHref,
    reviews: sectionReviews,
  } satisfies HomepageShelfSection;
}

function getOrderedHomepageShelfSection(
  reviews: ReviewWithStats[],
  title: string,
  viewAllHref: string,
  slugs: readonly string[],
) {
  const reviewsBySlug = new Map(reviews.map((review) => [review.slug, review]));
  const sectionReviews = slugs
    .map((slug) => reviewsBySlug.get(slug))
    .filter((review): review is ReviewWithStats => Boolean(review));

  if (!sectionReviews.length) {
    return null;
  }

  return {
    title,
    viewAllHref,
    reviews: sectionReviews,
  } satisfies HomepageShelfSection;
}

function getLatestReviewByReviewer(
  reviews: ReviewWithStats[],
  reviewerName: string,
) {
  return [...reviews]
    .filter((review) => review.reviewerName === reviewerName)
    .sort((left, right) => +new Date(right.createdAt) - +new Date(left.createdAt))[0];
}

export async function getHomepageShelfBundle(): Promise<HomepageShelfBundle> {
  const reviews = (await getAllReviewsWithStats()).filter(
    (review) => review.status === "published" && review.posterStatus === "approved",
  );
  const quentinTarantinoCollection = getOrderedHomepageShelfSection(
    reviews,
    "Quentin Tarantino Collection",
    "/reviews?search=Quentin%20Tarantino#browse-all",
    QUENTIN_TARANTINO_COLLECTION_ORDER,
  );
  const robZombieCollection = getOrderedHomepageShelfSection(
    reviews,
    "Rob Zombie Collection",
    "/reviews?search=Rob%20Zombie#browse-all",
    ROB_ZOMBIE_COLLECTION_ORDER,
  );
  const weeklyPicks = HOME_WEEKLY_PICK_CONFIG.map(({ reviewerName, slug, hook }) => {
    const configuredReview = reviews.find((review) => review.slug === slug);
    const review = configuredReview ?? getLatestReviewByReviewer(reviews, reviewerName);

    if (!review) {
      return null;
    }

    return {
      reviewerName,
      review,
      reason: hook || getFirstQuickHitSentence(review),
    } satisfies HomepageWeeklyPick;
  }).filter(Boolean) as HomepageWeeklyPick[];

  const anchoredShelves = [
    getHomepageShelfSection(
      reviews,
      "The Bloody Birth of Horror",
      "/early-horror",
      (review) =>
        review.collection === EARLY_HORROR_COLLECTION &&
        typeof review.releaseYear === "number" &&
        review.releaseYear >= EARLY_HORROR_START_YEAR &&
        review.releaseYear <= EARLY_HORROR_END_YEAR,
    ),
    getHomepageShelfSection(
      reviews,
      "1970s",
      "/reviews?decade=1970s#browse-all",
      (review) =>
        typeof review.releaseYear === "number" &&
        review.releaseYear >= 1970 &&
        review.releaseYear <= 1979,
    ),
    getHomepageShelfSection(
      reviews,
      "1980s",
      "/reviews?decade=1980s#browse-all",
      (review) =>
        typeof review.releaseYear === "number" &&
        review.releaseYear >= 1980 &&
        review.releaseYear <= 1989,
    ),
    getHomepageShelfSection(
      reviews,
      "2020s",
      "/reviews?decade=2020s#browse-all",
      (review) =>
        typeof review.releaseYear === "number" &&
        review.releaseYear >= 2020 &&
        review.releaseYear <= 2029,
    ),
    getHomepageShelfSection(
      reviews,
      "2010s",
      "/reviews?decade=2010s#browse-all",
      (review) =>
        typeof review.releaseYear === "number" &&
        review.releaseYear >= 2010 &&
        review.releaseYear <= 2019,
    ),
  ].filter((section): section is HomepageShelfSection => Boolean(section));

  return {
    quentinTarantinoCollection,
    robZombieCollection,
    weeklyPicks,
    shelves: anchoredShelves,
  };
}

export async function getAllReviewsWithStats() {
  const data = await readSiteData();

  return sortReviewsByNewest(data.reviews).map((review) =>
    withStats(review, data.likes, data.comments),
  );
}

export type EarlyHorrorDecadeStat = {
  key: EarlyHorrorDecadeKey;
  label: string;
  filmCount: number;
  averageRating: number | null;
  liveFilmCount: number;
};

export type EarlyHorrorArchiveBundle = {
  summary: {
    filmCount: number;
    averageRating: number | null;
    earliestYear: number | null;
    latestYear: number | null;
    importedCount: number;
    liveVisibleCount: number;
    hiddenPendingPosterCount: number;
  };
  decades: EarlyHorrorDecadeStat[];
  reviews: ReviewWithStats[];
};

export function isLiveEarlyHorrorReview(review: Review) {
  return (
    review.collection === EARLY_HORROR_COLLECTION &&
    typeof review.releaseYear === "number" &&
    review.releaseYear >= EARLY_HORROR_START_YEAR &&
    review.releaseYear <= EARLY_HORROR_END_YEAR &&
    review.status === "published" &&
    hasResolvedPoster(review) &&
    hasUsableSlug(review)
  );
}

export async function getEarlyHorrorArchiveBundle(): Promise<EarlyHorrorArchiveBundle> {
  const data = await readSiteData();
  const collectionReviews = data.reviews.filter(
    (review) => review.collection === EARLY_HORROR_COLLECTION,
  );
  const liveReviews = sortReviewsChronologically(
    collectionReviews.filter(isLiveEarlyHorrorReview),
  ).map((review) => withStats(review, data.likes, data.comments));
  const ratings = collectionReviews
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const years = collectionReviews
    .map((review) => review.releaseYear)
    .filter((year): year is number => typeof year === "number");

  const decades = earlyHorrorDecades.map((decade) => {
    if (decade.key === "all") {
      return {
        key: decade.key,
        label: decade.label,
        filmCount: collectionReviews.length,
        averageRating: ratings.length
          ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
          : null,
        liveFilmCount: liveReviews.length,
      } satisfies EarlyHorrorDecadeStat;
    }

    const decadeReviews = collectionReviews.filter(
      (review) =>
        typeof review.releaseYear === "number" &&
        review.releaseYear >= decade.startYear &&
        review.releaseYear <= decade.endYear,
    );
    const decadeRatings = decadeReviews
      .map((review) => review.rating)
      .filter((rating): rating is number => typeof rating === "number");

    return {
      key: decade.key,
      label: decade.label,
      filmCount: decadeReviews.length,
      averageRating: decadeRatings.length
        ? Number(
            (
              decadeRatings.reduce((sum, value) => sum + value, 0) /
              decadeRatings.length
            ).toFixed(1),
          )
        : null,
      liveFilmCount: liveReviews.filter(
        (review) => getEarlyHorrorDecadeKey(review.releaseYear) === decade.key,
      ).length,
    } satisfies EarlyHorrorDecadeStat;
  });

  return {
    summary: {
      filmCount: collectionReviews.length,
      averageRating: ratings.length
        ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
        : null,
      earliestYear: years.length ? Math.min(...years) : null,
      latestYear: years.length ? Math.max(...years) : null,
      importedCount: collectionReviews.length,
      liveVisibleCount: liveReviews.length,
      hiddenPendingPosterCount: collectionReviews.filter(
        (review) => review.pendingPoster || !hasResolvedPoster(review) || review.status !== "published",
      ).length,
    },
    decades,
    reviews: liveReviews,
  };
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
    .filter((comment) => matchesReviewComment(comment, review))
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
