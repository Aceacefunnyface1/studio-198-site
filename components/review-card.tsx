import Image from "next/image";
import Link from "next/link";
import { ReviewWithStats } from "@/lib/types";
import { getRatingVisual, getReviewerPresentation } from "@/lib/utils";

const DEFAULT_AMAZON_AFFILIATE_URL = "https://amzn.to/3PtHOkZ";

type ReviewCardProps = {
  review: ReviewWithStats;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const ratingVisual = getRatingVisual(review.rating);
  const amazonHref = review.amazonAffiliateUrl?.trim() || DEFAULT_AMAZON_AFFILIATE_URL;
  const tagLine = review.genreTags.slice(0, 3).join(" / ");
  const directorName = review.director?.trim() || "Unknown";
  const directorPrefix = directorName.length > 16 ? "BY" : "DIRECTED BY";
  const commentCount = typeof review.commentCount === "number" ? review.commentCount : 0;
  const reviewer = getReviewerPresentation(review.reviewerName);

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
            {`${directorPrefix} ${directorName}`}
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
            aria-label={`Watch or buy ${review.movieTitle} on Amazon`}
          >
            <Image
              src="/card-assets/amazon-button-reference.png"
              alt="Available at Amazon"
              fill
              className="movie-review-card__amazon-button-image"
              sizes="160px"
            />
          </a>
          <Link
            href={`/reviews/${review.slug}`}
            className="movie-review-card__action-slot movie-review-card__action-slot--link"
          >
            Read Review
          </Link>
        </div>

        <div className="movie-review-card__counters">
          <div className="movie-review-card__counter movie-review-card__counter--heat">
            <span>HEAT</span>
            <strong>{review.heatCount}</strong>
          </div>
          <div
            className={`movie-review-card__counter movie-review-card__counter--comments${
              commentCount < 1 ? " movie-review-card__counter--empty" : ""
            }`}
          >
            <span>COMMENTS</span>
            {commentCount > 0 ? <strong>{commentCount}</strong> : null}
          </div>
        </div>

        <p
          className={`movie-review-card__executioner movie-review-card__executioner--${reviewer.tone}`}
        >
          {reviewer.label}
        </p>

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
