"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pendingPosterSlugs from "@/data/pending-poster-slugs.json";
import { normalizeAmazonAffiliateUrl } from "@/lib/amazon-links";
import {
  clearAdminSession,
  createAdminSession,
  getExpectedAdminPassword,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import {
  formatGiveawayMonth,
  GIVEAWAY_PRIZE,
  getGiveawayMonthKey,
  isValidSubscriberEmail,
  normalizeSubscriberEmail,
  runMonthlyGiveawayDraw,
} from "@/lib/giveaway";
import { readSiteData, saveUpload, writeSiteData } from "@/lib/site-data";
import { Review, Verdict, verdictOptions } from "@/lib/types";
import { clampRating, slugify, splitTags } from "@/lib/utils";

const likedCookieName = "snap-critique-likes";
const forcedDraftSlugs = new Set(pendingPosterSlugs as string[]);

function requireText(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export type NewsletterActionState = {
  status: "idle" | "success" | "exists" | "invalid" | "error";
  message: string;
};

export type HeatVoteActionState = {
  status: "idle" | "success" | "duplicate" | "error";
  message: string;
  heatCount: number;
};

export async function loginAction(formData: FormData) {
  const submittedPassword = requireText(formData.get("password"));

  if (submittedPassword !== getExpectedAdminPassword()) {
    redirect("/admin?error=Invalid%20password");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function saveReviewAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20log%20in%20first");
  }

  const movieTitle = requireText(formData.get("movieTitle"));
  const slug = slugify(requireText(formData.get("slug")) || movieTitle);

  if (!movieTitle || !slug) {
    redirect("/admin?error=Movie%20title%20and%20slug%20are%20required");
  }

  try {
    const data = await readSiteData();
    const id = requireText(formData.get("id")) || `review-${crypto.randomUUID()}`;

    const existing = data.reviews.find((review) => review.id === id);
    const posterFile = formData.get("posterFile");
    const backdropFile = formData.get("backdropFile");

    const posterImage =
      posterFile instanceof File && posterFile.size > 0
        ? await saveUpload(posterFile, slug, "poster")
        : requireText(formData.get("posterImage")) || existing?.posterImage || "";

    const backdropImage =
      backdropFile instanceof File && backdropFile.size > 0
        ? await saveUpload(backdropFile, `${slug}-backdrop`, "backdrop")
        : requireText(formData.get("backdropImage")) ||
          existing?.backdropImage ||
          "";

    const verdictInput = requireText(formData.get("verdict"));
    const verdict: Verdict = verdictOptions.includes(
      verdictInput as (typeof verdictOptions)[number],
    )
      ? (verdictInput as Verdict)
      : "🔥";

    const ratingRaw = requireText(formData.get("rating"));
    const parsedRating = ratingRaw ? Number.parseFloat(ratingRaw) : null;

    const review: Review = {
      id,
      movieTitle,
      slug,
      releaseYear: requireText(formData.get("releaseYear"))
        ? Number.parseInt(requireText(formData.get("releaseYear")), 10)
        : null,
      posterImage,
      backdropImage,
      verdict,
      rating: clampRating(parsedRating),
      reviewerName: requireText(formData.get("reviewerName")) || "Ace Verdict",
      quickHit: requireText(formData.get("quickHit")),
      fullTake: requireText(formData.get("fullTake")),
      reviewVideoUrl: requireText(formData.get("reviewVideoUrl")),
      whereToWatchUrl: requireText(formData.get("whereToWatchUrl")),
      amazonAffiliateUrl: normalizeAmazonAffiliateUrl(
        requireText(formData.get("amazonAffiliateUrl")),
        {
          movieTitle,
          releaseYear: requireText(formData.get("releaseYear"))
            ? Number.parseInt(requireText(formData.get("releaseYear")), 10)
            : null,
          director: requireText(formData.get("director")),
        },
      ),
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured: formData.get("featured") === "on",
      genreTags: splitTags(requireText(formData.get("genreTags"))),
      moodTags: splitTags(requireText(formData.get("moodTags"))),
      runtime: requireText(formData.get("runtime")),
      director: requireText(formData.get("director")),
      status:
        forcedDraftSlugs.has(slug) || formData.get("status") === "draft"
          ? "draft"
          : "published",
    };

    const remaining = data.reviews.filter((entry) => entry.id !== id);
    data.reviews = [...remaining, review];
    await writeSiteData(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Review save failed";
    redirect(`/admin?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${slug}`);
  revalidatePath("/admin");
  redirect("/admin?success=Review%20saved");
}

export async function deleteReviewAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20log%20in%20first");
  }

  const id = requireText(formData.get("id"));
  const slug = requireText(formData.get("slug"));

  try {
    const data = await readSiteData();
    data.reviews = data.reviews.filter((review) => review.id !== id);
    data.comments = data.comments.filter((comment) => comment.reviewId !== id);
    delete data.likes[id];

    await writeSiteData(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Review delete failed";
    redirect(`/admin?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${slug}`);
  revalidatePath("/admin");
  redirect("/admin?success=Review%20deleted");
}

export async function addCommentAction(formData: FormData) {
  const displayName = requireText(formData.get("displayName")) || "Guest";
  const body = requireText(formData.get("body"));
  const reviewId = requireText(formData.get("reviewId"));
  const reviewSlug = requireText(formData.get("reviewSlug"));
  const safeReviewPath = reviewSlug ? `/reviews/${reviewSlug}` : "/reviews";

  if (!body || !reviewId || !reviewSlug) {
    redirect(`${safeReviewPath}?error=Comment%20could%20not%20be%20saved`);
  }

  try {
    const data = await readSiteData();
    const review = data.reviews.find(
      (entry) => entry.id === reviewId && entry.slug === reviewSlug,
    );

    if (!review) {
      throw new Error("Review not found");
    }

    data.comments.unshift({
      id: `comment-${crypto.randomUUID()}`,
      reviewId,
      reviewSlug,
      displayName,
      body,
      createdAt: new Date().toISOString(),
      status: "visible",
    });

    await writeSiteData(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Comment save failed";
    redirect(
      `${safeReviewPath}?error=${encodeURIComponent(
        message || "Comment%20save%20failed",
      )}`,
    );
  }

  revalidatePath(`/reviews/${reviewSlug}`);
  revalidatePath("/reviews");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/reviews/${reviewSlug}#comments`);
}

export async function submitHeatVoteAction(
  _previousState: HeatVoteActionState,
  formData: FormData,
): Promise<HeatVoteActionState> {
  const reviewId = requireText(formData.get("reviewId"));
  const reviewSlug = requireText(formData.get("reviewSlug"));
  const currentHeatCount = Number.parseInt(requireText(formData.get("heatCount")), 10) || 0;
  const cookieStore = await cookies();
  const existingLikes = new Set(
    (cookieStore.get(likedCookieName)?.value || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );

  if (!reviewId || !reviewSlug) {
    return {
      status: "error",
      message: "Heat could not be logged.",
      heatCount: currentHeatCount,
    };
  }

  if (existingLikes.has(reviewId)) {
    return {
      status: "duplicate",
      message: "This browser already used its HEAT vote.",
      heatCount: currentHeatCount,
    };
  }

  const data = await readSiteData();
  data.likes[reviewId] = (data.likes[reviewId] ?? 0) + 1;
  await writeSiteData(data);

  existingLikes.add(reviewId);
  cookieStore.set(likedCookieName, [...existingLikes].join(","), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${reviewSlug}`);

  return {
    status: "success",
    message: "HEAT vote logged.",
    heatCount: currentHeatCount + 1,
  };
}

export async function likeReviewAction(formData: FormData) {
  const reviewId = requireText(formData.get("reviewId"));
  const reviewSlug = requireText(formData.get("reviewSlug"));
  const cookieStore = await cookies();
  const existingLikes = new Set(
    (cookieStore.get(likedCookieName)?.value || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );

  if (!reviewId || !reviewSlug || existingLikes.has(reviewId)) {
    redirect(`/reviews/${reviewSlug}`);
  }

  const data = await readSiteData();
  data.likes[reviewId] = (data.likes[reviewId] ?? 0) + 1;
  await writeSiteData(data);

  existingLikes.add(reviewId);
  cookieStore.set(likedCookieName, [...existingLikes].join(","), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${reviewSlug}`);
  redirect(`/reviews/${reviewSlug}`);
}

export async function toggleCommentVisibilityAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20log%20in%20first");
  }

  const commentId = requireText(formData.get("commentId"));
  const nextStatus = requireText(formData.get("nextStatus")) === "hidden"
    ? "hidden"
    : "visible";
  const data = await readSiteData();

  data.comments = data.comments.map((comment) =>
    comment.id === commentId ? { ...comment, status: nextStatus } : comment,
  );

  await writeSiteData(data);
  revalidatePath("/admin");
  redirect("/admin?success=Comment%20updated");
}

export async function deleteCommentAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20log%20in%20first");
  }

  const commentId = requireText(formData.get("commentId"));
  const data = await readSiteData();
  data.comments = data.comments.filter((comment) => comment.id !== commentId);

  await writeSiteData(data);
  revalidatePath("/admin");
  redirect("/admin?success=Comment%20deleted");
}

export async function submitInquiryAction(formData: FormData) {
  const name = requireText(formData.get("name"));
  const email = requireText(formData.get("email"));
  const subject = requireText(formData.get("subject"));
  const message = requireText(formData.get("message"));

  if (!name || !email || !message) {
    redirect("/contact?error=Please%20fill%20out%20the%20required%20fields");
  }

  const data = await readSiteData();
  data.inquiries.unshift({
    id: `inquiry-${crypto.randomUUID()}`,
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
  });

  await writeSiteData(data);
  revalidatePath("/contact");
  revalidatePath("/admin");
  redirect("/contact?success=Message%20received");
}

export async function subscribeNewsletterAction(
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const normalizedEmail = normalizeSubscriberEmail(requireText(formData.get("email")));

  if (!normalizedEmail || !isValidSubscriberEmail(normalizedEmail)) {
    return {
      status: "invalid",
      message: "Enter a valid email address to join the giveaway.",
    };
  }

  try {
    const data = await readSiteData();
    const existingSubscriber = data.newsletterSubscribers.find(
      (subscriber) => normalizeSubscriberEmail(subscriber.email) === normalizedEmail,
    );

    if (existingSubscriber?.status === "active") {
      return {
        status: "exists",
        message:
          "That email is already subscribed and still entered in the giveaway.",
      };
    }

    const nextSubscriber = existingSubscriber
      ? {
          ...existingSubscriber,
          email: normalizedEmail,
          status: "active" as const,
        }
      : {
          id: `subscriber-${crypto.randomUUID()}`,
          email: normalizedEmail,
          createdAt: new Date().toISOString(),
          status: "active" as const,
        };

    data.newsletterSubscribers = [
      nextSubscriber,
      ...data.newsletterSubscribers.filter(
        (subscriber) => subscriber.id !== nextSubscriber.id,
      ),
    ].sort(
      (left, right) =>
        +new Date(right.createdAt || 0) - +new Date(left.createdAt || 0),
    );

    await writeSiteData(data);
    revalidatePath("/");
    revalidatePath("/admin");

    return {
      status: "success",
      message:
        "You’re in. Your email is saved and entered for the next monthly draw.",
    };
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return {
      status: "error",
      message:
        "We couldn’t save your entry right now. Please try again in a moment.",
    };
  }
}

export async function drawGiveawayWinnerAction() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=Please%20log%20in%20first");
  }

  const data = await readSiteData();
  const result = runMonthlyGiveawayDraw(data, new Date());
  const currentMonthLabel = formatGiveawayMonth(getGiveawayMonthKey(new Date()));

  if (result.status === "no-eligible") {
    redirect("/admin?error=No%20eligible%20newsletter%20subscribers%20found");
  }

  if (result.status === "created") {
    await writeSiteData(data);
    revalidatePath("/admin");
    revalidatePath("/");
    redirect(
      `/admin?success=${encodeURIComponent(
        `Winner selected for ${formatGiveawayMonth(result.winner.giveawayMonth)}`,
      )}`,
    );
  }

  redirect(
    `/admin?success=${encodeURIComponent(
      `Winner already exists for ${currentMonthLabel}`,
    )}`,
  );
}
