"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pendingPosterSlugs from "@/data/pending-poster-slugs.json";
import {
  clearAdminSession,
  createAdminSession,
  getExpectedAdminPassword,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import { readSiteData, saveUpload, writeSiteData } from "@/lib/site-data";
import { Review, Verdict, verdictOptions } from "@/lib/types";
import { clampRating, slugify, splitTags } from "@/lib/utils";

const likedCookieName = "snap-critique-likes";
const forcedDraftSlugs = new Set(pendingPosterSlugs as string[]);

function requireText(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

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
      : "WATCH";

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

  if (!body || !reviewId || !reviewSlug) {
    redirect(`/reviews/${reviewSlug}?error=Comment%20could%20not%20be%20saved`);
  }

  const data = await readSiteData();
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
  revalidatePath(`/reviews/${reviewSlug}`);
  revalidatePath("/admin");
  redirect(`/reviews/${reviewSlug}#comments`);
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
