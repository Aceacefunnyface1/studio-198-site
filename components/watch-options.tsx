import { getAmazonCtaLabel, getSafeAmazonLink } from "@/lib/amazon-links";
import { Review } from "@/lib/types";

type WatchOptionsProps = {
  review: Review;
  className?: string;
};

const PROVIDER_NAME_MAP: Record<string, string> = {
  "amazon prime video": "Prime Video",
  "prime video": "Prime Video",
  "apple tv": "Apple TV",
  "apple tv+": "Apple TV+",
};

function normalizeProviderName(name: string) {
  const trimmed = name.trim();

  if (!trimmed) {
    return "";
  }

  return PROVIDER_NAME_MAP[trimmed.toLowerCase()] ?? trimmed;
}

function isSafeHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function WatchOptions({
  review,
  className = "",
}: WatchOptionsProps) {
  const safeAmazonLink = getSafeAmazonLink({
    movieTitle: review.movieTitle,
    releaseYear: review.releaseYear,
    director: review.director,
    amazonAffiliateUrl: review.amazonAffiliateUrl,
    amazonUrl: review.amazonUrl,
    amazonAsin: review.amazonAsin,
    amazonLinkType: review.amazonLinkType,
  });
  const amazonHref = safeAmazonLink.url.trim();
  const hasAmazonCta = amazonHref.length > 0 && isSafeHttpUrl(amazonHref);
  const providerNames = (review.watchProviders ?? [])
    .map((provider) => normalizeProviderName(provider.name))
    .filter(Boolean);

  if (!hasAmazonCta && providerNames.length === 0) {
    return null;
  }

  return (
    <section className={`watch-options ${className}`.trim()}>
      <p className="watch-options__eyebrow">Where To Watch</p>

      {hasAmazonCta ? (
        <a
          href={amazonHref}
          target="_blank"
          rel="noreferrer"
          className="button-primary watch-options__button"
        >
          {getAmazonCtaLabel(safeAmazonLink.type)}
        </a>
      ) : null}

      {providerNames.length ? (
        <p className="watch-options__providers">
          <span>Also streaming on:</span>
          {" "}
          {providerNames.join(" · ")}
        </p>
      ) : null}

      {hasAmazonCta ? (
        <p className="watch-options__disclosure">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      ) : null}
    </section>
  );
}
