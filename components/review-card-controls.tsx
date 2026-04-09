"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitHeatVoteAction, type HeatVoteActionState } from "@/app/actions";
import { getAmazonCtaLabel, type AmazonLinkType } from "@/lib/amazon-links";

type ReviewCardControlsProps = {
  reviewId: string;
  reviewSlug: string;
  reviewTitle: string;
  amazonHref: string;
  amazonLinkType: AmazonLinkType;
  heatCount: number;
  commentCount: number;
};

const initialHeatVoteState = (
  heatCount: number,
): HeatVoteActionState => ({
  status: "idle",
  message: "",
  heatCount,
});

export function ReviewCardControls({
  reviewId,
  reviewSlug,
  reviewTitle,
  amazonHref,
  amazonLinkType,
  heatCount,
  commentCount,
}: ReviewCardControlsProps) {
  const [heatState, heatAction, heatPending] = useActionState(
    submitHeatVoteAction,
    initialHeatVoteState(heatCount),
  );

  const isHeatLocked =
    heatPending ||
    heatState.status === "success" ||
    heatState.status === "duplicate";
  const heatEyebrow =
    heatState.status === "success"
      ? "Heat Logged"
      : heatState.status === "duplicate"
        ? "Vote Already Used"
        : "Signal";

  return (
    <div className="movie-review-card__control-panel">
      <div className="movie-review-card__action-grid">
        <form action={heatAction} className="movie-review-card__action-form">
          <input type="hidden" name="reviewId" value={reviewId} />
          <input type="hidden" name="reviewSlug" value={reviewSlug} />
          <input type="hidden" name="heatCount" value={String(heatCount)} />
          <button
            type="submit"
            className="movie-review-card__action-tile movie-review-card__action-tile--heat"
            disabled={isHeatLocked}
            aria-disabled={isHeatLocked}
            aria-label={`Add heat to ${reviewTitle}`}
          >
            <span className="movie-review-card__action-eyebrow">{heatEyebrow}</span>
            <div className="movie-review-card__action-main">
              <strong>HEAT</strong>
              <em>{heatState.heatCount}</em>
            </div>
          </button>
        </form>

        <Link
          href={`/reviews/${reviewSlug}#comments`}
          className="movie-review-card__action-tile movie-review-card__action-tile--comments"
          aria-label={`Open comments for ${reviewTitle}`}
        >
          <span className="movie-review-card__action-eyebrow">Thread</span>
          <div className="movie-review-card__action-main">
            <strong>COMMENTS</strong>
            <em>{commentCount}</em>
          </div>
        </Link>

        <a
          href={amazonHref}
          target="_blank"
          rel="noreferrer"
          className="movie-review-card__action-tile movie-review-card__action-tile--amazon"
          aria-label={`Watch or buy ${reviewTitle} on Amazon`}
        >
          <span className="movie-review-card__action-eyebrow">Stream</span>
          <div className="movie-review-card__action-main movie-review-card__action-main--stacked">
            <strong>{getAmazonCtaLabel(amazonLinkType)}</strong>
          </div>
        </a>

        <Link
          href={`/reviews/${reviewSlug}`}
          className="movie-review-card__action-tile movie-review-card__action-tile--review"
        >
          <span className="movie-review-card__action-eyebrow">Full Take</span>
          <div className="movie-review-card__action-main movie-review-card__action-main--stacked">
            <strong>READ</strong>
            <em>REVIEW</em>
          </div>
        </Link>
      </div>

      <p className="movie-review-card__control-feedback" aria-live="polite">
        {heatState.message}
      </p>
    </div>
  );
}

export default ReviewCardControls;
