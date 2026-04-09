#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const AMAZON_AFFILIATE_TAG = "moviesbybrad2-20";
const AMAZON_HOST = "www.amazon.com";
const AMAZON_ASIN_PATTERN = /^[A-Z0-9]{10}$/i;
const AMAZON_ASIN_PATH_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/gp\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/gp\/aw\/d\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/gp\/video\/detail\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})(?:[/?]|$)/i,
  /\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
];

const INPUT_PATH = path.resolve(process.cwd(), process.argv[2] || "data/site-data.json");
const OUTPUT_PATH = path.resolve(
  process.cwd(),
  process.argv[3] || "data/site-data.amazon-fixed.json",
);
const FIXED_AT = new Date().toISOString();

function normalizeAsin(candidate) {
  const value = String(candidate || "").trim().toUpperCase();
  return AMAZON_ASIN_PATTERN.test(value) ? value : "";
}

function extractAsin(value) {
  const direct = normalizeAsin(value);

  if (direct) {
    return direct;
  }

  const input = String(value || "").trim();

  if (!input) {
    return "";
  }

  for (const pattern of AMAZON_ASIN_PATH_PATTERNS) {
    const match = input.match(pattern);

    if (match && match[1]) {
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
      const fromParams = [parsed.searchParams.get("asin"), parsed.searchParams.get("ASIN")];

      for (const candidate of fromParams) {
        const asin = normalizeAsin(candidate);

        if (asin) {
          return asin;
        }
      }

      const pathname = decodeURIComponent(parsed.pathname);

      for (const pattern of AMAZON_ASIN_PATH_PATTERNS) {
        const match = pathname.match(pattern);

        if (match && match[1]) {
          const asin = normalizeAsin(match[1]);

          if (asin) {
            return asin;
          }
        }
      }
    }
  } catch {
    // Ignore malformed URLs.
  }

  return "";
}

function buildAmazonDpLink(asin, tag = AMAZON_AFFILIATE_TAG) {
  const normalizedAsin = normalizeAsin(asin);

  if (!normalizedAsin) {
    return "";
  }

  return `https://${AMAZON_HOST}/dp/${normalizedAsin}/?tag=${encodeURIComponent(tag)}`;
}

function buildAmazonSearchLink(movieTitle, releaseYear, tag = AMAZON_AFFILIATE_TAG) {
  const title = String(movieTitle || "").trim();

  if (!title) {
    return "";
  }

  const query =
    typeof releaseYear === "number" && Number.isFinite(releaseYear)
      ? `${title} ${releaseYear}`
      : title;
  const params = new URLSearchParams({
    k: query,
    tag,
  });

  return `https://${AMAZON_HOST}/s?${params.toString()}`;
}

function getCandidateValues(item) {
  return [
    item.amazonAsin,
    item.asin,
    item.amazonAffiliateUrl,
    item.amazonUrl,
    item.amazon_url,
    item.watchUrl,
    item.watch_url,
    item.buyUrl,
    item.buy_url,
  ];
}

function getMovieTitle(item) {
  return item.movieTitle || item.title || item.name || "";
}

function getReleaseYear(item) {
  const raw = item.releaseYear ?? item.year;

  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }

  if (typeof raw === "string" && raw.trim()) {
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function getSafeAmazonLink(item) {
  for (const candidate of getCandidateValues(item)) {
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
    url: buildAmazonSearchLink(getMovieTitle(item), getReleaseYear(item)),
    type: "search",
    asin: "",
  };
}

function resolveCollection(root) {
  if (Array.isArray(root)) {
    return { parent: null, key: null, items: root };
  }

  if (root && typeof root === "object") {
    for (const key of ["reviews", "movies", "items"]) {
      if (Array.isArray(root[key])) {
        return { parent: root, key, items: root[key] };
      }
    }

    if (root.data && typeof root.data === "object") {
      for (const key of ["reviews", "movies", "items"]) {
        if (Array.isArray(root.data[key])) {
          return { parent: root.data, key, items: root.data[key] };
        }
      }
    }
  }

  throw new Error("Could not find a supported review/movie/items array in the input JSON.");
}

function main() {
  const raw = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));
  const collection = resolveCollection(raw);
  let dpCount = 0;
  let searchCount = 0;

  const fixedItems = collection.items.map((item) => {
    const safeLink = getSafeAmazonLink(item);

    if (safeLink.type === "dp") {
      dpCount += 1;
    } else {
      searchCount += 1;
    }

    return {
      ...item,
      amazonAffiliateUrl: safeLink.url,
      amazonLinkType: safeLink.type,
      affiliateTag: AMAZON_AFFILIATE_TAG,
      amazonLinkFixedAt: FIXED_AT,
      ...(safeLink.asin ? { amazonAsin: safeLink.asin } : {}),
    };
  });

  let output;

  if (collection.parent && collection.key) {
    output = structuredClone(raw);

    if (collection.parent === raw) {
      output[collection.key] = fixedItems;
    } else {
      output.data[collection.key] = fixedItems;
    }
  } else {
    output = fixedItems;
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Input: ${INPUT_PATH}`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Processed: ${fixedItems.length}`);
  console.log(`DP links: ${dpCount}`);
  console.log(`Search fallback links: ${searchCount}`);
}

main();
