import { cookies } from "next/headers";
import { likeReviewAction } from "@/app/actions";

type ReviewLikeButtonProps = {
  reviewId: string;
  reviewSlug: string;
};

const likedCookieName = "snap-critique-likes";

export async function ReviewLikeButton({
  reviewId,
  reviewSlug,
}: ReviewLikeButtonProps) {
  const cookieStore = await cookies();
  const likedReviews = new Set(
    (cookieStore.get(likedCookieName)?.value || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  const alreadyLiked = likedReviews.has(reviewId);

  return (
    <form action={likeReviewAction} className="review-like-shell">
      <input type="hidden" name="reviewId" value={reviewId} />
      <input type="hidden" name="reviewSlug" value={reviewSlug} />
      <button
        type="submit"
        className="button-primary"
        disabled={alreadyLiked}
        aria-pressed={alreadyLiked}
      >
        {alreadyLiked ? "HEAT Already Logged" : "Add Heat To This Verdict"}
      </button>
      <p className="review-like-note">
        {alreadyLiked
          ? "Duplicate protection is active: this browser already logged one HEAT vote."
          : "One HEAT vote per browser. A valid vote adds exactly 1 and persists after refresh."}
      </p>
    </form>
  );
}
