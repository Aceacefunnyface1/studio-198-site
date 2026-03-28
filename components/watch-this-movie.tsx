const DEFAULT_AMAZON_WATCH_URL = "https://amzn.to/4sA3DxD";

type WatchThisMovieProps = {
  url?: string | null;
  className?: string;
};

export function WatchThisMovie({
  url,
  className = "",
}: WatchThisMovieProps) {
  const href = url?.trim() || DEFAULT_AMAZON_WATCH_URL;

  return (
    <section className={`watch-this-movie ${className}`.trim()}>
      <p className="watch-this-movie-label">WATCH THIS MOVIE</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="button-primary watch-this-movie-button"
      >
        Watch on Amazon
      </a>
    </section>
  );
}
