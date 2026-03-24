import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addCommentAction,
  likeReviewAction,
} from "@/app/actions";
import { PosterFrame } from "@/components/poster-frame";
import { ReviewCard } from "@/components/review-card";
import { ShareActions } from "@/components/share-actions";
import { getReviewBundle } from "@/lib/review-queries";
import { formatDate } from "@/lib/utils";

type ReviewDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ReviewDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getReviewBundle(slug);

  if (!bundle) {
    return {
      title: "Review Not Found",
    };
  }

  return {
    title: bundle.review.movieTitle,
    description:
      bundle.review.quickHit ||
      `Read ${bundle.review.movieTitle} on Snap Critique by Studio 198.`,
  };
}

export default async function ReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
  const { slug } = await params;
  const bundle = await getReviewBundle(slug);

  if (!bundle || bundle.review.status !== "published") {
    notFound();
  }

  const { review, comments, related } = bundle;

  return (
    <div className="page-stack">
      <section className="detail-shell">
        <div className="detail-side">
          <PosterFrame
            posterImage={review.resolvedPosterImage}
            title={review.movieTitle}
            className="detail-poster"
          />
        </div>

        <div className="detail-main">
          <div className="detail-copy">
            <span className={`verdict-badge verdict-${review.verdictKey}`}>
              {review.verdict}
            </span>
            <div className="detail-heading">
              <h1>
                {review.movieTitle}
                {review.releaseYear ? ` (${review.releaseYear})` : ""}
              </h1>
              {review.director ? (
                <p className="detail-subline">Directed by {review.director}</p>
              ) : null}
            </div>
            <div className="detail-meta">
              <span>{review.ratingLabel}</span>
              <span>{review.reviewerName}</span>
              {review.runtime ? <span>{review.runtime}</span> : null}
            </div>

            <div className="prose-block">
              <h2>Quick Hit</h2>
              <p>{review.quickHit || "Quick-hit review text pending publication."}</p>
            </div>

            <div className="prose-block">
              <h2>Full Take</h2>
              <p>
                {review.fullTake ||
                  "The full written review has not been published yet."}
              </p>
            </div>

            <div className="button-row">
              {review.reviewVideoUrl ? (
                <a
                  href={review.reviewVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary"
                >
                  Watch Review Video
                </a>
              ) : null}
              {review.whereToWatchUrl ? (
                <a
                  href={review.whereToWatchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                >
                  Where To Watch
                </a>
              ) : null}
              <Link href="/reviews" className="button-link">
                Back To Archive
              </Link>
            </div>

            <div className="stats-strip">
              <div>
                <strong>{review.likeCount}</strong>
                <span>Likes</span>
              </div>
              <div>
                <strong>{review.commentCount}</strong>
                <span>Comments</span>
              </div>
              <div>
                <strong>{formatDate(review.updatedAt)}</strong>
                <span>Last updated</span>
              </div>
            </div>

            <form action={likeReviewAction}>
              <input type="hidden" name="reviewId" value={review.id} />
              <input type="hidden" name="reviewSlug" value={review.slug} />
              <button type="submit" className="button-primary">
                Like This Review
              </button>
            </form>

            <ShareActions title={review.movieTitle} path={`/reviews/${review.slug}`} />
          </div>
        </div>
      </section>

      <section className="comment-shell" id="comments">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Comments</p>
            <h2>Talk back to the verdict</h2>
          </div>
        </div>

        <form action={addCommentAction} className="contact-form">
          <input type="hidden" name="reviewId" value={review.id} />
          <input type="hidden" name="reviewSlug" value={review.slug} />
          <div className="field">
            <label htmlFor="displayName">Display name</label>
            <input id="displayName" name="displayName" placeholder="Guest critic" />
          </div>
          <div className="field-full">
            <label htmlFor="body">Comment</label>
            <textarea
              id="body"
              name="body"
              required
              placeholder="Keep it sharp. Keep it readable."
            />
          </div>
          <div className="field-full">
            <button type="submit" className="button-primary">
              Add Comment
            </button>
          </div>
        </form>

        {comments.length ? (
          <div className="comment-list">
            {comments.map((comment) => (
              <article key={comment.id} className="comment-card">
                <div className="comment-meta">
                  <strong>{comment.displayName}</strong>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p>{comment.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">No comments yet. Start the thread.</p>
        )}
      </section>

      {related.length ? (
        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Related Reviews</p>
              <h2>More titles in the same orbit</h2>
            </div>
          </div>
          <div className="related-grid">
            {related.map((relatedReview) => (
              <ReviewCard key={relatedReview.id} review={relatedReview} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
