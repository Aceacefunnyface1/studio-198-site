"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReviewCard } from "@/components/review-card";
import {
  EarlyHorrorDecadeKey,
  getEarlyHorrorDecadeLabel,
  getEarlyHorrorDecadeKey,
} from "@/lib/early-horror";
import type {
  EarlyHorrorArchiveBundle,
  EarlyHorrorDecadeStat,
} from "@/lib/review-queries";

type EarlyHorrorBrowserProps = {
  reviews: EarlyHorrorArchiveBundle["reviews"];
  decades: EarlyHorrorDecadeStat[];
};

const DEFAULT_DECADE: EarlyHorrorDecadeKey = "1960s";

export function EarlyHorrorBrowser({
  reviews,
  decades,
}: EarlyHorrorBrowserProps) {
  const router = useRouter();
  const gridAnchorRef = useRef<HTMLDivElement | null>(null);
  const [selectedDecade, setSelectedDecade] =
    useState<EarlyHorrorDecadeKey>(DEFAULT_DECADE);

  const filteredReviews =
    selectedDecade === "all"
      ? reviews
      : reviews.filter(
          (review) => getEarlyHorrorDecadeKey(review.releaseYear) === selectedDecade,
        );

  const selectedStat =
    decades.find((entry) => entry.key === selectedDecade) ?? decades[0];

  function handleDecadeChange(nextDecade: EarlyHorrorDecadeKey) {
    if (nextDecade === selectedDecade) {
      return;
    }

    setSelectedDecade(nextDecade);
    requestAnimationFrame(() => {
      gridAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function handleRandomPick() {
    if (!filteredReviews.length) {
      return;
    }

    const nextReview =
      filteredReviews[Math.floor(Math.random() * filteredReviews.length)];
    router.push(`/reviews/${nextReview.slug}`);
  }

  return (
    <div className="early-horror-browser">
      <div className="early-horror-nav" role="tablist" aria-label="Browse by decade">
        {decades.map((decade) => (
          <button
            key={decade.key}
            type="button"
            role="tab"
            aria-selected={selectedDecade === decade.key}
            className={`early-horror-nav__button${
              selectedDecade === decade.key ? " is-active" : ""
            }`}
            onClick={() => handleDecadeChange(decade.key)}
          >
            <strong>{decade.label}</strong>
            {decade.key === "all" ? (
              <span>{decade.filmCount} films</span>
            ) : (
              <span>
                {decade.filmCount} |{" "}
                {typeof decade.averageRating === "number"
                  ? decade.averageRating.toFixed(1)
                  : "--"}
              </span>
            )}
          </button>
        ))}
      </div>

      <div ref={gridAnchorRef} className="early-horror-filter-bar">
        <p className="early-horror-filter-bar__note">
          Showing {filteredReviews.length} live film
          {filteredReviews.length === 1 ? "" : "s"} from{" "}
          {getEarlyHorrorDecadeLabel(selectedDecade)}
        </p>

        <div className="early-horror-filter-bar__actions">
          <button
            type="button"
            className="early-horror-random-button"
            onClick={handleRandomPick}
            disabled={!filteredReviews.length}
          >
            Random from this era
          </button>
          <Link href="/reviews" className="early-horror-archive-link">
            Full Reviews Archive
          </Link>
        </div>
      </div>

      {filteredReviews.length ? (
        <div className="card-grid early-horror-grid">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No poster-backed reviews are live in this decade yet.
        </div>
      )}
    </div>
  );
}

export default EarlyHorrorBrowser;
