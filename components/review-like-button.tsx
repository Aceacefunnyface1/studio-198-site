"use client";

import { useState } from "react";

type ReviewLikeButtonProps = {
  reviewId: string;
};

function getStorageKey(reviewId: string) {
  return `snap-critique-liked:${reviewId}`;
}

export function ReviewLikeButton({ reviewId }: ReviewLikeButtonProps) {
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return window.localStorage.getItem(getStorageKey(reviewId)) === "1";
    } catch {
      return false;
    }
  });

  function handleLike() {
    if (typeof window === "undefined" || liked) {
      return;
    }

    try {
      window.localStorage.setItem(getStorageKey(reviewId), "1");
      setLiked(true);
    } catch {
      setLiked(true);
    }
  }

  return (
    <div className="review-like-shell">
      <button
        type="button"
        className="button-primary"
        onClick={handleLike}
        disabled={liked}
        aria-pressed={liked}
      >
        {liked ? "Heat Logged On This Device" : "Add Heat To This Verdict"}
      </button>
      <p className="review-like-note">
        {liked
          ? "Saved locally so the heat sticks without the app blinking."
          : "Local for now, but it still lets the verdict carry some heat."}
      </p>
    </div>
  );
}
