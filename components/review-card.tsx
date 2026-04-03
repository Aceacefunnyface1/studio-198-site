import Link from "next/link";
import Image from "next/image";
import { ReviewCardControls } from "@/components/review-card-controls";
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

        <ReviewCardControls
          reviewId={review.id}
          reviewSlug={review.slug}
          reviewTitle={review.movieTitle}
          amazonHref={amazonHref}
          heatCount={review.heatCount}
          commentCount={commentCount}
        />

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
