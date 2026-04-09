export const AMAZON_AFFILIATE_TAG = "moviesbybrad2-20";
const AMAZON_HOST = "www.amazon.com";
const AMAZON_ASIN_PATTERN = /^[A-Z0-9]{10}$/i;

export type AmazonLinkType = "dp" | "search";

export type AmazonReviewContext = {
  movieTitle?: string | null;
  releaseYear?: number | null;
  director?: string | null;
  amazonAsin?: string | null;
  asin?: string | null;
  amazonAffiliateUrl?: string | null;
  amazonUrl?: string | null;
  amazon_url?: string | null;
  watchUrl?: string | null;
  watch_url?: string | null;
  buyUrl?: string | null;
  buy_url?: string | null;
};

export type SafeAmazonLink = {
  url: string;
  type: AmazonLinkType;
  asin: string | null;
};

const AMAZON_ASIN_PATH_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/gp\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/gp\/aw\/d\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/gp\/video\/detail\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
];

function normalizeAsin(candidate: string | null | undefined) {
  const value = (candidate || "").trim().toUpperCase();
  return AMAZON_ASIN_PATTERN.test(value) ? value : "";
}

function getCandidateValues(context: AmazonReviewContext) {
  return [
    context.amazonAsin,
    context.asin,
    context.amazonAffiliateUrl,
    context.amazonUrl,
    context.amazon_url,
    context.watchUrl,
    context.watch_url,
    context.buyUrl,
    context.buy_url,
  ];
}

export function extractAsin(value: string | null | undefined) {
  const direct = normalizeAsin(value);

  if (direct) {
    return direct;
  }

  const input = (value || "").trim();

  if (!input) {
    return "";
  }

  for (const pattern of AMAZON_ASIN_PATH_PATTERNS) {
    const match = input.match(pattern);

    if (match?.[1]) {
      const asin = normalizeAsin(match[1]);

      if (asin) {
        return asin;
      }
    }
  }

  try {
    const parsed = new URL(input);
    const hostname = parsed.hostname.toLowerCase();

    if (
      hostname === AMAZON_HOST ||
      hostname.endsWith(".amazon.com") ||
      hostname.endsWith(".amazon.co.uk") ||
      hostname.endsWith(".amazon.ca")
    ) {
      const asinParams = [
        parsed.searchParams.get("asin"),
        parsed.searchParams.get("ASIN"),
      ];

      for (const candidate of asinParams) {
        const asin = normalizeAsin(candidate);

        if (asin) {
          return asin;
        }
      }

      const pathname = decodeURIComponent(parsed.pathname);

      for (const pattern of AMAZON_ASIN_PATH_PATTERNS) {
        const match = pathname.match(pattern);

        if (match?.[1]) {
          const asin = normalizeAsin(match[1]);

          if (asin) {
            return asin;
          }
        }
      }
    }
  } catch {
    // Ignore malformed values and fall through to empty.
  }

  return "";
}

export function buildAmazonDpLink(
  asin: string | null | undefined,
  tag = AMAZON_AFFILIATE_TAG,
) {
  const normalizedAsin = normalizeAsin(asin);

  if (!normalizedAsin) {
    return "";
  }

  return `https://${AMAZON_HOST}/dp/${normalizedAsin}/?tag=${encodeURIComponent(tag)}`;
}

export function buildAmazonSearchLink(
  movieTitle: string | null | undefined,
  releaseYear?: number | null,
  tag = AMAZON_AFFILIATE_TAG,
) {
  const title = (movieTitle || "").trim();

  if (!title) {
    return "";
  }

  const query = typeof releaseYear === "number" ? `${title} ${releaseYear}` : title;
  const params = new URLSearchParams({
    k: query,
    tag,
  });

  return `https://${AMAZON_HOST}/s?${params.toString()}`;
}

function getSafeAmazonLinkFromContext(context: AmazonReviewContext): SafeAmazonLink {
  for (const candidate of getCandidateValues(context)) {
    const asin = extractAsin(candidate);

    if (asin) {
      return {
        url: buildAmazonDpLink(asin),
        type: "dp",
        asin,
      };
    }
  }

  return {
    url: buildAmazonSearchLink(context.movieTitle, context.releaseYear),
    type: "search",
    asin: null,
  };
}

export function getSafeAmazonLink(
  valueOrContext: string | AmazonReviewContext | null | undefined,
  fallbackContext: AmazonReviewContext = {},
): SafeAmazonLink {
  if (typeof valueOrContext === "string" || valueOrContext == null) {
    return getSafeAmazonLinkFromContext({
      ...fallbackContext,
      amazonAffiliateUrl: valueOrContext || "",
    });
  }

  return getSafeAmazonLinkFromContext(valueOrContext);
}

export function normalizeAmazonAffiliateUrl(
  url: string | null | undefined,
  context: AmazonReviewContext,
) {
  return getSafeAmazonLink(url, context).url;
}

export function getAmazonCtaLabel(type: AmazonLinkType) {
  return type === "dp" ? "WATCH NOW ON AMAZON →" : "FIND IT ON AMAZON →";
}
