import Image from "next/image";
import Link from "next/link";
import { ReviewWithStats } from "@/lib/types";
import { getRatingVisual } from "@/lib/utils";

type ReviewCardProps = {
  review: ReviewWithStats;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const ratingVisual = getRatingVisual(review.rating);

  return (
    <Link href={`/reviews/${review.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
          {review.resolvedPosterImage ? (
            <Image
              src={review.resolvedPosterImage}
              alt={review.movieTitle}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
              No Poster
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="min-h-[3.5rem]">
            <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">
              {review.movieTitle}
              {review.releaseYear ? (
                <span className="ml-2 text-white/50">({review.releaseYear})</span>
              ) : null}
            </h3>
          </div>

          <div className="mt-2 min-h-[1.5rem]">
            {review.director ? (
              <p className="line-clamp-1 text-sm text-white/60">
                Directed by {review.director}
              </p>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-3 min-h-[4.5rem]">
            {review.quickHit ? (
              <p className="line-clamp-3 text-sm leading-6 text-white/80">
                {review.quickHit}
              </p>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {review.verdict ? (
                <p className="text-xs uppercase tracking-[0.18em] text-red-400">
                  {review.verdict}
                </p>
              ) : null}
            </div>

            <div className="flex items-end gap-3 text-right">
              {ratingVisual ? (
                <div className="relative h-10 w-10 overflow-hidden">
                  <Image
                    src={ratingVisual.iconSrc}
                    alt={ratingVisual.iconAlt}
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
              ) : null}
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                  {ratingVisual?.label ?? "rating"}
                </p>
                <p className="text-lg font-bold text-white">
                  {typeof review.rating === "number"
                    ? review.rating.toFixed(1)
                    : "\u2014"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ReviewCard;
