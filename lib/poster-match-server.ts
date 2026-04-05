import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import { ReviewWithStats } from "@/lib/types";
import {
  hasValidPosterMatchPosters,
  POSTER_MATCH_TOTAL_PAIRS,
  type PosterMatchPoster,
} from "@/lib/poster-match";

function isUsableLocalPoster(image: string) {
  if (!image.startsWith("/")) {
    return false;
  }

  const filePath = path.join(process.cwd(), "public", image.replace(/^\/+/, ""));
  return existsSync(filePath);
}

export function getPosterMatchPosters(reviews: ReviewWithStats[]) {
  const seenImages = new Set<string>();
  const posters: PosterMatchPoster[] = [];

  for (const review of reviews) {
    if (
      review.posterStatus !== "approved" ||
      !review.resolvedPosterImage ||
      seenImages.has(review.resolvedPosterImage) ||
      !isUsableLocalPoster(review.resolvedPosterImage)
    ) {
      continue;
    }

    posters.push({
      id: review.id,
      slug: review.slug,
      title: review.movieTitle,
      image: review.resolvedPosterImage,
      amazonAffiliateUrl: review.amazonAffiliateUrl,
    });
    seenImages.add(review.resolvedPosterImage);

    if (posters.length === POSTER_MATCH_TOTAL_PAIRS) {
      break;
    }
  }

  return hasValidPosterMatchPosters(posters) ? posters : [];
}
