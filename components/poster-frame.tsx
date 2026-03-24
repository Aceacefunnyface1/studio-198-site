type PosterFrameProps = {
  posterImage: string;
  title: string;
  className?: string;
};

export function PosterFrame({
  posterImage,
  title,
  className,
}: PosterFrameProps) {
  return (
    <div className={`poster-frame ${className ?? ""}`.trim()}>
      {posterImage ? (
        <img src={posterImage} alt={`${title} poster`} loading="lazy" />
      ) : (
        <div className="poster-frame-fallback">
          <div>
            <strong>{title}</strong>
            <span>Poster pending upload</span>
          </div>
        </div>
      )}
    </div>
  );
}
