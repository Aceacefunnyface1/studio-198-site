const AMAZON_TAG = "moviesbybrad2-20";
const AMAZON_HOST = "www.amazon.com";
const AMAZON_ASIN_PATTERN = /^[A-Z0-9]{10}$/i;

type AmazonReviewContext = {
  movieTitle?: string | null;
  releaseYear?: number | null;
  director?: string | null;
};

function normalizeAsin(candidate: string | null | undefined) {
  const value = (candidate || "").trim().toUpperCase();
  return AMAZON_ASIN_PATTERN.test(value) ? value : "";
}

function extractAsinFromPath(pathname: string) {
  const directMatch = pathname.match(/\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i);

  if (directMatch) {
    return {
      asin: normalizeAsin(directMatch[1]),
      kind: "dp" as const,
    };
  }

  const videoMatch = pathname.match(
    /\/gp\/video\/detail\/([A-Z0-9]{10})(?:[/?]|$)/i,
  );

  if (videoMatch) {
    return {
      asin: normalizeAsin(videoMatch[1]),
      kind: "video" as const,
    };
  }

  return null;
}

export function buildAmazonSearchUrl(
  movieTitle: string | null | undefined,
  releaseYear?: number | null,
) {
  const title = (movieTitle || "").trim();

  if (!title) {
    return "";
  }

  const query = typeof releaseYear === "number" ? `${title} ${releaseYear}` : title;
  const params = new URLSearchParams({
    k: query,
    tag: AMAZON_TAG,
  });

  return `https://${AMAZON_HOST}/s?${params.toString()}`;
}

export function normalizeAmazonAffiliateUrl(
  url: string | null | undefined,
  context: AmazonReviewContext,
) {
  const value = (url || "").trim();

  if (!value) {
    return buildAmazonSearchUrl(context.movieTitle, context.releaseYear);
  }

  try {
    const parsed = new URL(value);
    const isAmazonHost =
      parsed.hostname === AMAZON_HOST || parsed.hostname.endsWith(".amazon.com");

    if (isAmazonHost) {
      const match = extractAsinFromPath(parsed.pathname);

      if (match?.asin) {
        const basePath =
          match.kind === "video"
            ? `/gp/video/detail/${match.asin}/`
            : `/dp/${match.asin}/`;
        return `https://${AMAZON_HOST}${basePath}?tag=${AMAZON_TAG}`;
      }
    }
  } catch {
    // Fall back to a safe search URL below.
  }

  return buildAmazonSearchUrl(context.movieTitle, context.releaseYear);
}

