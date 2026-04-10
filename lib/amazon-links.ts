export const AMAZON_AFFILIATE_TAG = "moviesbybrad2-20";
const AMAZON_HOST = "www.amazon.com";
const AMAZON_ASIN_PATTERN = /^[A-Z0-9]{10}$/i;

export type AmazonLinkType = "dp" | "search";

export type AmazonReviewContext = {
  movieTitle?: string | null;
  releaseYear?: number | null;
  director?: string | null;
  amazonLinkType?: AmazonLinkType | null;
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
  /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/[^/]+\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i,
];
const AMAZON_BLOCKED_PATH_PATTERNS = [/\/gp\/video\/detail\//i];
const AMAZON_ALLOWED_HOSTS = new Set([
  AMAZON_HOST,
  "amazon.com",
  "smile.amazon.com",
  "www.amazon.co.uk",
  "amazon.co.uk",
  "www.amazon.ca",
  "amazon.ca",
]);

function normalizeAsin(candidate: string | null | undefined) {
  const value = (candidate || "").trim().toUpperCase();
  return AMAZON_ASIN_PATTERN.test(value) ? value : "";
}

function getCandidateValues(context: AmazonReviewContext) {
  return [
    context.amazonUrl,
    context.amazon_url,
    context.amazonAsin,
    context.asin,
    context.amazonAffiliateUrl,
    context.watchUrl,
    context.watch_url,
    context.buyUrl,
    context.buy_url,
  ];
}

function isAllowedAmazonHostname(hostname: string) {
  return (
    AMAZON_ALLOWED_HOSTS.has(hostname) ||
    hostname.endsWith(".amazon.com") ||
    hostname.endsWith(".amazon.co.uk") ||
    hostname.endsWith(".amazon.ca")
  );
}

function getNormalizedAmazonDirectUrl(
  value: string | null | undefined,
  tag = AMAZON_AFFILIATE_TAG,
) {
  const input = (value || "").trim();

  if (!input) {
    return "";
  }

  try {
    const parsed = new URL(input);
    const hostname = parsed.hostname.toLowerCase();

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "";
    }

    if (hostname === "amzn.to") {
      return parsed.toString();
    }

    if (!isAllowedAmazonHostname(hostname)) {
      return "";
    }

    if (AMAZON_BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(parsed.pathname))) {
      return "";
    }

    const asin = extractAsin(parsed.toString());

    if (asin) {
      return buildAmazonDpLink(asin, tag);
    }

    if (parsed.pathname === "/s" || parsed.pathname === "/s/") {
      const query = parsed.searchParams.get("k")?.trim();

      if (!query) {
        return "";
      }

      return `https://${AMAZON_HOST}/s?${new URLSearchParams({
        k: query,
        tag,
      }).toString()}`;
    }
  } catch {
    // Ignore malformed values and fall through to empty.
  }

  return "";
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

    if (isAllowedAmazonHostname(hostname)) {
      if (AMAZON_BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(parsed.pathname))) {
        return "";
      }

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
  const explicitLinkType = context.amazonLinkType === "dp" || context.amazonLinkType === "search"
    ? context.amazonLinkType
    : null;

  for (const candidate of getCandidateValues(context)) {
    const directUrl = getNormalizedAmazonDirectUrl(candidate);

    if (directUrl) {
      const asin = extractAsin(directUrl) || null;

      return {
        url: directUrl,
        type: explicitLinkType ?? (asin ? "dp" : "search"),
        asin,
      };
    }

    const asin = extractAsin(candidate);

    if (asin) {
      return {
        url: buildAmazonDpLink(asin),
        type: "dp",
        asin,
      };
    }
  }

  const explicitAsin = normalizeAsin(context.amazonAsin ?? context.asin);

  if (explicitAsin) {
    return {
      url: buildAmazonDpLink(explicitAsin),
      type: "dp",
      asin: explicitAsin,
    };
  }

  const fallbackSearch = buildAmazonSearchLink(context.movieTitle, context.releaseYear);

  if (fallbackSearch) {
    return {
      url: fallbackSearch,
      type: "search",
      asin: null,
    };
  }

  return {
    url: "",
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
