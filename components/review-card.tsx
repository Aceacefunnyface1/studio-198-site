import Link from "next/link";
import { ReviewWithStats } from "@/lib/types";
import { PosterFrame } from "@/components/poster-frame";

type ReviewCardProps = {
  review: ReviewWithStats;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="review-card">
      <PosterFrame
        posterImage={review.resolvedPosterImage}
        title={review.movieTitle}
        className="review-card-poster"
      />

      <div className="review-copy">
        <span className={`verdict-badge verdict-${review.verdictKey}`}>
          {review.verdict}
        </span>
        <div className="review-heading">
          <h3>
            {review.movieTitle}
            {review.releaseYear ? ` (${review.releaseYear})` : ""}
          </h3>
          {review.director ? (
            <p className="review-subline">Directed by {review.director}</p>
          ) : null}
        </div>
        <p>{review.quickHit || "Review copy pending publication."}</p>
        <div className="review-meta">
          <span>{review.ratingLabel}</span>
          <span>{review.likeCount} likes</span>
          <span>{review.commentCount} comments</span>
        </div>
        <div className="button-row">
          <Link href={`/reviews/${review.slug}`} className="button-primary">
            Read Review
          </Link>
          {review.reviewVideoUrl ? (
            <a
              href={review.reviewVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              Watch Video
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
