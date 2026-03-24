import type { Metadata } from "next";
import { BrowseExplorer } from "@/components/browse-explorer";
import { getPublishedReviewsWithStats } from "@/lib/review-queries";

export const metadata: Metadata = {
  title: "Reviews Archive",
  description:
    "Browse every published Snap Critique review by verdict, genre, rating, or popularity.",
};

export default async function ReviewsPage() {
  const reviews = await getPublishedReviewsWithStats();

  return (
    <div className="page-stack">
      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviews Archive</p>
            <h2>Every published verdict in one place</h2>
          </div>
        </div>
        <BrowseExplorer
          reviews={reviews}
          emptyMessage="No reviews matched the archive filters."
        />
      </section>
    </div>
  );
}
