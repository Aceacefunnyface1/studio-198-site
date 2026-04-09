import { getAmazonCtaLabel, getSafeAmazonLink } from "@/lib/amazon-links";

type WatchThisMovieProps = {
  url?: string | null;
  movieTitle?: string | null;
  releaseYear?: number | null;
  director?: string | null;
  className?: string;
  compact?: boolean;
};

export function WatchThisMovie({
  url,
  movieTitle,
  releaseYear,
  director,
  className = "",
  compact = false,
}: WatchThisMovieProps) {
  const safeAmazonLink = getSafeAmazonLink(url, {
    movieTitle,
    releaseYear,
    director,
  });
  const href = safeAmazonLink.url.trim();

  try {
    const parsedUrl = new URL(href);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }
  } catch {
    return null;
  }

  return (
    <section className={`watch-this-movie ${className}`.trim()}>
      {!compact ? <p className="watch-this-movie-label">WATCH THIS MOVIE</p> : null}
      {!compact ? (
        <p className="watch-this-movie-note">
          👉 Streaming now — check availability before it rotates out
        </p>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="button-primary watch-this-movie-button"
      >
        {getAmazonCtaLabel(safeAmazonLink.type)}
      </a>
    </section>
  );
}
