/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ReviewWithStats } from "@/lib/types";

type PosterShelfRowProps = {
  ariaLabel: string;
  reviews: ReviewWithStats[];
};

export function PosterShelfRow({ ariaLabel, reviews }: PosterShelfRowProps) {
  return (
    <div className="home-shelf-row" aria-label={ariaLabel}>
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/reviews/${review.slug}`}
          className="home-shelf-item"
        >
          <div className="home-shelf-item__poster">
            <img
              src={review.resolvedPosterImage}
              alt={`${review.movieTitle} poster`}
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
  );
}

export default PosterShelfRow;
