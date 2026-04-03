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
              sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
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

        <div className="movie-review-card__control-panel">
          <div className="movie-review-card__action-grid">
            <div className="movie-review-card__action-tile movie-review-card__action-tile--heat">
              <span className="movie-review-card__action-eyebrow">Signal</span>
              <div className="movie-review-card__action-main">
                <strong>HEAT</strong>
                <em>{review.heatCount}</em>
              </div>
            </div>

            <div className="movie-review-card__action-tile movie-review-card__action-tile--comments">
              <span className="movie-review-card__action-eyebrow">Thread</span>
              <div className="movie-review-card__action-main">
                <strong>COMMENTS</strong>
                <em>{commentCount}</em>
              </div>
            </div>

            <a
              href={amazonHref}
              target="_blank"
              rel="noreferrer"
              className="movie-review-card__action-tile movie-review-card__action-tile--amazon"
              aria-label={`Watch or buy ${review.movieTitle} on Amazon`}
            >
              <span className="movie-review-card__action-eyebrow">Stream</span>
              <div className="movie-review-card__action-main movie-review-card__action-main--stacked">
                <strong>WATCH ON</strong>
                <em>AMAZON</em>
              </div>
            </a>

            <Link
              href={`/reviews/${review.slug}`}
              className="movie-review-card__action-tile movie-review-card__action-tile--review"
            >
              <span className="movie-review-card__action-eyebrow">Full Take</span>
              <div className="movie-review-card__action-main movie-review-card__action-main--stacked">
                <strong>READ</strong>
                <em>REVIEW</em>
              </div>
            </Link>
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
