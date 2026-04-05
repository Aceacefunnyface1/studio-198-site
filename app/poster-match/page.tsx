import type { Metadata } from "next";
import Link from "next/link";
import { PosterMemoryGame } from "@/components/poster-memory-game";
import { getPosterMatchPosters } from "@/lib/poster-match-server";
import { getDailyFeaturedReview, getPublishedReviewsWithStats } from "@/lib/review-queries";
import {
  POSTER_MATCH_TOTAL_PAIRS,
} from "@/lib/poster-match";

export const metadata: Metadata = {
  title: "Poster Match Giveaway Game",
  description:
    "Match 20 movie-poster pairs on Snap Critique and unlock bonus giveaway entries.",
};

export default async function PosterMatchPage() {
  const reviews = await getPublishedReviewsWithStats();
  const posterCandidates = getPosterMatchPosters(reviews);
  const featuredReview =
    getDailyFeaturedReview(reviews) ??
    reviews.find((review) => review.id === posterCandidates[0]?.id) ??
    null;

  if (posterCandidates.length !== POSTER_MATCH_TOTAL_PAIRS || !featuredReview) {
    return (
      <div className="page-stack">
        <section className="cinema-panel cinema-panel--wall">
          <div className="cinema-panel__heading cinema-panel__heading--stacked">
            <p className="eyebrow">Poster Match</p>
            <h1>POSTER MATCH ISN&apos;T LIVE YET.</h1>
            <p>We need a full 20-poster set before the game can open.</p>
          </div>
          <Link href="/reviews" className="button-primary">
            Browse Reviews
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack poster-match-page">
      <section className="cinema-panel cinema-panel--poster-match">
        <PosterMemoryGame
          posters={posterCandidates}
          reviewHref={`/reviews/${featuredReview.slug}`}
          reviewTitle={featuredReview.movieTitle}
          watchHref={featuredReview.amazonAffiliateUrl || undefined}
        />
      </section>

      <section className="cinema-panel cinema-panel--wall">
        <div className="cinema-panel__heading">
          <h2>NEED A MOVIE AFTER THE MATCH?</h2>
          <Link href="/reviews">SEE ALL REVIEWS</Link>
        </div>
        <div className="poster-match-promo-grid">
          {reviews
            .filter((review) =>
              posterCandidates.some((poster) => poster.id === review.id),
            )
            .slice(0, 4)
            .map((review) => (
            <Link
              key={review.id}
              href={`/reviews/${review.slug}`}
              className="cinema-poster-wall__support"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={review.resolvedPosterImage} alt={`${review.movieTitle} poster`} />
              <div className="cinema-poster-wall__overlay">
                <h3>{review.movieTitle}</h3>
                <p>{review.quickHit?.split(".")[0] ?? "Read the verdict."}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
