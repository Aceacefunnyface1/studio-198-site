import Link from "next/link";
import { BrowseExplorer } from "@/components/browse-explorer";
import { ReviewCard } from "@/components/review-card";
import {
  getDailyFeaturedReview,
  getPublishedReviewsWithStats,
} from "@/lib/review-queries";

export default async function HomePage() {
  const reviews = await getPublishedReviewsWithStats();
  const heroReview = getDailyFeaturedReview(reviews);
  const latest = [...reviews]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Studio 198 presents</p>
          <h1>Snap Critique</h1>
          <p className="hero-slogan">Not Meant to Feel Safe.</p>
          <p className="hero-body">
            Short-form movie reviews with hard edges, fast verdicts, and a
            premium midnight-editorial look built for the web first and ready
            for the feed later.
          </p>
          <div className="hero-actions">
            <Link href="/reviews" className="button-primary">
              Browse Reviews
            </Link>
            <Link href="/admin" className="button-secondary">
              Manage Reviews
            </Link>
          </div>
        </div>

        {heroReview ? (
          <div className="hero-feature">
            <div className="hero-feature-media">
              <img
                src={heroReview.resolvedPosterImage}
                alt={`${heroReview.movieTitle} poster`}
              />
            </div>
            <div className="hero-feature-content">
              <span className={`verdict-badge verdict-${heroReview.verdictKey}`}>
                {heroReview.verdict}
              </span>
              <h2>{heroReview.movieTitle}</h2>
              <p>{heroReview.quickHit || "Review copy pending Studio 198."}</p>
              <div className="meta-row">
                <span>{heroReview.releaseYear ?? "Release year pending"}</span>
                <span>{heroReview.ratingLabel}</span>
                <span>{heroReview.genreTags.join(" / ")}</span>
              </div>
              <Link
                href={`/reviews/${heroReview.slug}`}
                className="button-primary"
              >
                Read Featured Review
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Verdicts</p>
            <h2>Poster-first spotlight</h2>
          </div>
          <Link href="/reviews" className="text-link">
            See archive
          </Link>
        </div>
        <div className="card-grid card-grid-featured">
          {(heroReview ? [heroReview, ...latest.filter((review) => review.id !== heroReview.id)] : latest)
            .slice(0, 3)
            .map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse the Feed</p>
            <h2>Search, filter, sort</h2>
          </div>
        </div>
        <BrowseExplorer
          reviews={reviews}
          emptyMessage="No reviews match the current filters."
        />
      </section>

      <section className="content-section two-column-callout">
        <div className="callout-block">
          <p className="eyebrow">Latest Reviews</p>
          <h2>Fresh from Studio 198</h2>
          <div className="stack-list">
            {latest.map((review) => (
              <Link key={review.id} href={`/reviews/${review.slug}`} className="list-link">
                <span>{review.movieTitle}</span>
                <span>{review.ratingLabel}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="callout-block">
          <p className="eyebrow">Built To Scale</p>
          <h2>Website first. App-ready later.</h2>
          <p>
            Reviews, comments, likes, and content management run through a
            structured data model today so the same content can move into an API
            and mobile surface later without reformatting everything by hand.
          </p>
        </div>
      </section>
    </div>
  );
}
