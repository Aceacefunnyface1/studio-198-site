const DEFAULT_AMAZON_AFFILIATE_URL = "https://amzn.to/3PtHOkZ";

type WatchThisMovieProps = {
  url?: string | null;
  className?: string;
  compact?: boolean;
};

export function WatchThisMovie({
  url,
  className = "",
  compact = false,
}: WatchThisMovieProps) {
  const href = url?.trim() || DEFAULT_AMAZON_AFFILIATE_URL;

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
        Watch / Buy on Amazon
      </a>
    </section>
  );
}
