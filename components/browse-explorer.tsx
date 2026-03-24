"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/review-card";
import {
  applyReviewFilters,
  collectGenres,
  defaultFilters,
} from "@/lib/review-filters";
import { verdictOptions, ReviewWithStats } from "@/lib/types";

type BrowseExplorerProps = {
  reviews: ReviewWithStats[];
  emptyMessage: string;
};

export function BrowseExplorer({
  reviews,
  emptyMessage,
}: BrowseExplorerProps) {
  const [filters, setFilters] = useState(defaultFilters);
  const genres = collectGenres(reviews);
  const filteredReviews = applyReviewFilters(reviews, filters);

  return (
    <div className="browse-shell">
      <div className="filter-grid">
        <div className="field-full">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            name="search"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder="Search title, verdict, quick hit, full take, tags"
          />
        </div>

        <div className="field">
          <label htmlFor="verdict">Verdict</label>
          <select
            id="verdict"
            value={filters.verdict}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                verdict: event.target.value,
              }))
            }
          >
            <option value="all">All verdicts</option>
            {verdictOptions.map((verdict) => (
              <option key={verdict} value={verdict}>
                {verdict}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            value={filters.genre}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                genre: event.target.value,
              }))
            }
          >
            <option value="all">All genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={filters.rating}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                rating: event.target.value,
              }))
            }
          >
            <option value="all">Any rating</option>
            <option value="3">3.0 and up</option>
            <option value="4">4.0 and up</option>
            <option value="4.5">4.5 and up</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="sort">Sort</label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                sort: event.target.value,
              }))
            }
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Rating</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="featuredOnly">Featured</label>
          <select
            id="featuredOnly"
            value={filters.featuredOnly ? "yes" : "no"}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                featuredOnly: event.target.value === "yes",
              }))
            }
          >
            <option value="no">All reviews</option>
            <option value="yes">Featured only</option>
          </select>
        </div>
      </div>

      <p className="muted-note">
        {filteredReviews.length} review{filteredReviews.length === 1 ? "" : "s"}{" "}
        found
      </p>

      {filteredReviews.length ? (
        <div className="card-grid related-grid">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="empty-state">{emptyMessage}</div>
      )}
    </div>
  );
}
