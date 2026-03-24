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
        posterImage={review.posterImage}
        title={review.movieTitle}
        className="review-card-poster"
      />

      <div className="review-copy">
        <span className={`verdict-badge verdict-${review.verdictKey}`}>
          {review.verdict}
        </span>
        <h3>{review.movieTitle}</h3>
        <p>{review.quickHit || "Review copy pending publication."}</p>
        <div className="review-meta">
          <span>{review.releaseYear ?? "TBA"}</span>
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
