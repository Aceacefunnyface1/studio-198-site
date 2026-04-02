import Image from "next/image";
import Link from "next/link";
import { ReviewWithStats } from "@/lib/types";
import { getRatingVisual } from "@/lib/utils";

const DEFAULT_AMAZON_AFFILIATE_URL = "https://amzn.to/3PtHOkZ";

type ReviewCardProps = {
  review: ReviewWithStats;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const ratingVisual = getRatingVisual(review.rating);
  const amazonHref = review.amazonAffiliateUrl?.trim() || DEFAULT_AMAZON_AFFILIATE_URL;
  const tagLine = review.genreTags.slice(0, 3).join(" / ");

  return (
    <article className="movie-review-card">
      <Link
        href={`/reviews/${review.slug}`}
        className="movie-review-card__poster-link"
        aria-label={`Read review for ${review.movieTitle}`}
      >
        <div className="movie-review-card__poster">
          {review.resolvedPosterImage ? (
            <Image
              src={review.resolvedPosterImage}
              alt={review.movieTitle}
              fill
              className="movie-review-card__poster-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="movie-review-card__poster-fallback">No Poster</div>
          )}
        </div>
      </Link>

      <div className="movie-review-card__body">
        <Link href={`/reviews/${review.slug}`} className="movie-review-card__content-link">
          <h3 className="movie-review-card__title">
            <span>{review.movieTitle}</span>
            {review.releaseYear ? (
              <span className="movie-review-card__year">({review.releaseYear})</span>
            ) : null}
          </h3>

          <p className="movie-review-card__director">
            {review.director ? `DIRECTED BY ${review.director}` : "DIRECTED BY UNKNOWN"}
          </p>

          <p className="movie-review-card__hook">
            {review.quickHit || "The rules have changed again."}
          </p>

          <p className="movie-review-card__tags">{tagLine || "MOVIE TAGS"}</p>
        </Link>

        <div className="movie-review-card__actions">
          <a
            href={amazonHref}
            target="_blank"
            rel="noreferrer"
            className="movie-review-card__amazon-button"
          >
            <span>Watch / Buy on Amazon</span>
          </a>
          <div className="movie-review-card__action-slot" aria-hidden="true" />
        </div>

        <div className="movie-review-card__counters">
          <div className="movie-review-card__counter movie-review-card__counter--heat">
            <span>HEAT</span>
            <strong>{review.heatCount}</strong>
          </div>
          <div className="movie-review-card__counter movie-review-card__counter--comments">
            <span>COMMENTS</span>
            <strong>{review.commentCount}</strong>
          </div>
        </div>

        <p className="movie-review-card__executioner">EXECUTIONER "ACE"</p>

        <div className="movie-review-card__footer">
          <div className="movie-review-card__rating-icon">
            {ratingVisual ? (
              <Image
                src={ratingVisual.iconSrc}
                alt={ratingVisual.iconAlt}
                fill
                className="movie-review-card__rating-icon-image"
                sizes="40px"
              />
            ) : null}
          </div>

          <div className="movie-review-card__rating-copy">
            <span>{ratingVisual?.label.toUpperCase() ?? "PENDING"}</span>
            <strong>
              {typeof review.rating === "number" ? review.rating.toFixed(1) : "\u2014"}
            </strong>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ReviewCard;
