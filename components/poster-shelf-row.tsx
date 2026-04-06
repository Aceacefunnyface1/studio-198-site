"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ReviewWithStats } from "@/lib/types";

type PosterShelfRowProps = {
  ariaLabel: string;
  reviews: ReviewWithStats[];
};

export function PosterShelfRow({ ariaLabel, reviews }: PosterShelfRowProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(reviews.length > 0);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      setCanScrollLeft(rail.scrollLeft > 8);
      setCanScrollRight(maxScrollLeft - rail.scrollLeft > 8);
    };

    updateScrollState();
    rail.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      rail.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [reviews.length]);

  const scrollRail = (direction: "left" | "right") => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const distance = Math.max(rail.clientWidth * 0.72, 240);
    rail.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="home-shelf-rail"
      data-can-scroll-left={canScrollLeft}
      data-can-scroll-right={canScrollRight}
    >
      <button
        type="button"
        className="home-shelf-rail__arrow home-shelf-rail__arrow--left"
        aria-label={`Scroll ${ariaLabel} left`}
        disabled={!canScrollLeft}
        onClick={() => scrollRail("left")}
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div ref={railRef} className="home-shelf-row" aria-label={ariaLabel}>
        {reviews.map((review) => (
          <Link
            key={review.id}
            href={`/reviews/${review.slug}`}
            className="home-shelf-item"
          >
            <div className="home-shelf-item__poster">
              <Image
                src={review.resolvedPosterImage}
                alt={`${review.movieTitle} poster`}
                fill
                sizes="(max-width: 699px) 95px, 120px"
              />
            </div>
            <div className="home-shelf-item__meta">
              <span className="home-shelf-item__title">{review.movieTitle}</span>
              {typeof review.releaseYear === "number" ? (
                <span className="home-shelf-item__year">{review.releaseYear}</span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="home-shelf-rail__arrow home-shelf-rail__arrow--right"
        aria-label={`Scroll ${ariaLabel} right`}
        disabled={!canScrollRight}
        onClick={() => scrollRail("right")}
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}

export default PosterShelfRow;
