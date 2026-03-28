import Link from "next/link";
import { ReviewWithStats } from "@/lib/types";
import { PosterFrame } from "@/components/poster-frame";
import { WatchThisMovie } from "@/components/watch-this-movie";

type ReviewCardProps = {
  review: ReviewWithStats;
};

function getRatingVisual(rating: number | null) {
  if (rating !== null && rating >= 4) {
    return {
      accentClass: "review-card-elite",
      label: "elite",
      iconSrc: "/rating-icons/fire-eye.png",
      iconAlt: "Fire eye rating icon",
    };
  }

  if (rating !== null && rating >= 3) {
    return {
      accentClass: "review-card-solid",
      label: "solid",
      iconSrc: "/rating-icons/skull.png",
      iconAlt: "Skull rating icon",
    };
  }

  if (rating !== null && rating >= 1.1) {
    return {
      accentClass: "review-card-bad",
      label: "bad",
      iconSrc: "/rating-icons/block.png",
      iconAlt: "Block rating icon",
    };
  }

  return {
    accentClass: "review-card-trash",
    label: "trash",
    iconSrc: "/rating-icons/poop.png",
    iconAlt: "Trash rating icon",
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const ratingVisual = getRatingVisual(review.rating);
  const likeCount = review.likeCount ?? 0;
  const commentCount = review.commentCount ?? 0;

  return (
    <article className={`review-card ${ratingVisual.accentClass}`}>
      <PosterFrame
        posterImage={review.resolvedPosterImage}
        title={review.movieTitle}
        className="review-card-poster"
      />

      <div className="review-card-body">
        <div className="review-card-heading">
          <h3 className="review-card-title">
            <span>{review.movieTitle}</span>
            {review.releaseYear ? (
              <span className="review-card-year">({review.releaseYear})</span>
            ) : null}
          </h3>
          {review.director ? (
            <p className="review-card-director">Directed by {review.director}</p>
          ) : null}
        </div>

        <p className="review-card-hook">
          {review.quickHit || "Studio 198 verdict locked. Read the full take."}
        </p>

        <WatchThisMovie
          url={review.whereToWatchUrl}
          className="review-card-watch"
        />

        <div className="review-card-bottom">
          <div className="review-card-stats" aria-label="Review engagement">
            <span>{commentCount} comments</span>
            <span>{likeCount} likes</span>
          </div>

          <div className="review-card-footer">
            <Link href={`/reviews/${review.slug}`} className="button-primary review-card-button">
              Read Review
            </Link>

            <div className="review-card-rating" aria-label={`${ratingVisual.label} rating ${review.rating ?? 0}`}>
              <span className="review-card-rating-label">{ratingVisual.label}</span>
              <div className="review-card-rating-main">
                <img
                  src={ratingVisual.iconSrc}
                  alt={ratingVisual.iconAlt}
                  className="review-card-rating-icon"
                  loading="lazy"
                />
                <span className="review-card-rating-value">
                  {review.rating !== null ? review.rating.toFixed(1) : "0.0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
