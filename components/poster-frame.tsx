import Image from "next/image";

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
        <Image
          src={posterImage}
          alt={`${title} poster`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
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
