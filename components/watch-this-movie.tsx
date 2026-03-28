type WatchThisMovieProps = {
  url?: string | null;
  className?: string;
};

export function WatchThisMovie({
  url,
  className = "",
}: WatchThisMovieProps) {
  const href = url?.trim();

  if (!href) {
    return null;
  }

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
