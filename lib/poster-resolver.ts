import posterOverrides from "@/data/poster-overrides.json";
import { Review } from "@/lib/types";

type PosterOverride = {
  movieTitle: string;
  currentPath: string;
  replacementPath: string;
  status: string;
  source: string;
};

const overrides = posterOverrides as Record<string, PosterOverride>;

export function resolvePoster(review: Review) {
  const override = overrides[review.slug];
  const rawPoster = (review.posterImage || "").trim();
  const replacementPath = override?.replacementPath?.trim();
  const isBlobPoster =
    rawPoster.startsWith("/media/") ||
    /^https?:\/\/[^/]*blob\.vercel-storage\.com\//i.test(rawPoster);

  if (replacementPath) {
    return {
      resolvedPosterImage: replacementPath,
      posterStatus: "approved" as const,
      posterSource: "custom" as const,
    };
  }

  if (rawPoster.startsWith("/posters/batch-17/")) {
    return {
      resolvedPosterImage: rawPoster,
      posterStatus: "needs-replacement" as const,
      posterSource: "batch-17" as const,
    };
  }

  if (rawPoster.startsWith("/posters/")) {
    return {
      resolvedPosterImage: rawPoster,
      posterStatus: "approved" as const,
      posterSource: "custom" as const,
    };
  }

  if (isBlobPoster) {
    return {
      resolvedPosterImage: "",
      posterStatus: "missing" as const,
      posterSource: "missing" as const,
    };
  }

  if (/^https?:\/\//.test(rawPoster)) {
    return {
      resolvedPosterImage: rawPoster,
      posterStatus: "approved" as const,
      posterSource: "external" as const,
    };
  }

  return {
    resolvedPosterImage: "",
    posterStatus: "missing" as const,
    posterSource: "missing" as const,
  };
}
