import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import bundledSeedData from "@/data/site-data.json";
import pendingPosterSlugs from "@/data/pending-poster-slugs.json";
import {
  GiveawayWinner,
  NewsletterSubscriber,
  Review,
  SiteData,
  Verdict,
  verdictOptions,
} from "@/lib/types";

const dataFilePath = path.join(process.cwd(), "data", "site-data.json");
const siteDataBlobPath = "site-data.json";
const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
const posterUploadsDirectory = path.join(process.cwd(), "public", "posters", "manual");
const forcedDraftSlugs = new Set(pendingPosterSlugs as string[]);

const initialData: SiteData = {
  reviews: [],
  comments: [],
  likes: {},
  inquiries: [],
  newsletterSubscribers: [],
  giveawayWinners: [],
};

const isProduction = process.env.NODE_ENV === "production";
const isDeployedProduction =
  isProduction &&
  (process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV));
const isVercelBlobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const blobAccess =
  process.env.BLOB_ACCESS === "public" ? "public" : "private";
const isBuildPrerender =
  process.env.NEXT_PHASE === "phase-production-build";

async function streamToText(stream: ReadableStream<Uint8Array>) {
  return await new Response(stream).text();
}

async function ensureDataFile() {
  await mkdir(path.dirname(dataFilePath), { recursive: true });

  try {
    await readFile(dataFilePath, "utf8");
  } catch {
    await writeFile(dataFilePath, JSON.stringify(initialData, null, 2), "utf8");
  }
}

async function readLocalSeedData() {
  await ensureDataFile();
  const raw = await readFile(dataFilePath, "utf8");
  return normalizeSiteData(JSON.parse(raw));
}

function getBundledSeedData() {
  return normalizeSiteData(bundledSeedData);
}

function normalizeSiteData(data: unknown): SiteData {
  const candidate = (data ?? {}) as Partial<SiteData>;

  return {
    reviews: Array.isArray(candidate.reviews) ? candidate.reviews : [],
    comments: Array.isArray(candidate.comments) ? candidate.comments : [],
    likes:
      candidate.likes &&
      typeof candidate.likes === "object" &&
      !Array.isArray(candidate.likes)
        ? candidate.likes
        : {},
    inquiries: Array.isArray(candidate.inquiries) ? candidate.inquiries : [],
    newsletterSubscribers: Array.isArray(candidate.newsletterSubscribers)
      ? candidate.newsletterSubscribers
      : [],
    giveawayWinners: Array.isArray(candidate.giveawayWinners)
      ? candidate.giveawayWinners
      : [],
  };
}

function classifyPosterPath(posterPath: string) {
  const value = normalizePosterPath(posterPath);

  if (!value) {
    return "missing" as const;
  }

  if (value.startsWith("/posters/batch-17/")) {
    return "batch" as const;
  }

  if (value.startsWith("/posters/")) {
    return "managed" as const;
  }

  if (value.startsWith("/media/") || value.startsWith("/uploads/")) {
    return "uploaded" as const;
  }

  if (/^https?:\/\//.test(value)) {
    return "external" as const;
  }

  return "other" as const;
}

function normalizePosterPath(posterPath: string | null | undefined) {
  const value = (posterPath || "").trim();

  if (!value || value === "/posters/updating-placeholder.png") {
    return "";
  }

  if (
    value.startsWith("/media/") ||
    /^https?:\/\/[^/]*blob\.vercel-storage\.com\//i.test(value)
  ) {
    return "";
  }

  return value;
}

function getTimestamp(value: string | null | undefined) {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function enforceReviewPolicies(review: Review) {
  const verdict = verdictOptions.includes(review.verdict as Verdict)
    ? review.verdict
    : "🔥";

  return {
    ...review,
    verdict,
    posterImage: normalizePosterPath(review.posterImage),
    status: getResolvedReviewStatus(review),
  } satisfies Review;
}

export function isPosterBlockedReview(slug: string) {
  return forcedDraftSlugs.has(slug);
}

export function getResolvedReviewStatus(review: Pick<Review, "slug" | "status">) {
  return forcedDraftSlugs.has(review.slug) ? "draft" : review.status;
}

function mergeSiteData(existing: SiteData, bundled: SiteData) {
  const normalizedExisting = normalizeSiteData(existing);
  const normalizedBundled = normalizeSiteData(bundled);
  const bundledBySlug = new Map(
    normalizedBundled.reviews.map((review) => [
      review.slug,
      enforceReviewPolicies(review),
    ]),
  );
  const mergedCommentMap = new Map<string, SiteData["comments"][number]>();
  const mergedSubscriberMap = new Map<string, NewsletterSubscriber>();
  const mergedWinnerMap = new Map<string, GiveawayWinner>();

  function getCommentMergeKey(comment: SiteData["comments"][number]) {
    return [
      comment.id?.trim() || "",
      comment.reviewSlug?.trim() || "",
      comment.displayName?.trim() || "",
      comment.body?.trim() || "",
      comment.createdAt?.trim() || "",
    ].join("|");
  }

  function addMergedComment(comment: SiteData["comments"][number]) {
    mergedCommentMap.set(getCommentMergeKey(comment), comment);
  }

  normalizedExisting.comments.forEach(addMergedComment);
  normalizedBundled.comments.forEach(addMergedComment);

  function getNormalizedEmail(email: string | null | undefined) {
    return (email || "").trim().toLowerCase();
  }

  function addMergedSubscriber(subscriber: NewsletterSubscriber) {
    const key = getNormalizedEmail(subscriber.email);

    if (!key || mergedSubscriberMap.has(key)) {
      return;
    }

    mergedSubscriberMap.set(key, {
      ...subscriber,
      email: key,
    });
  }

  function addMergedWinner(winner: GiveawayWinner) {
    const key = winner.giveawayMonth?.trim() || winner.id;

    if (!key || mergedWinnerMap.has(key)) {
      return;
    }

    mergedWinnerMap.set(key, winner);
  }

  normalizedExisting.newsletterSubscribers.forEach(addMergedSubscriber);
  normalizedBundled.newsletterSubscribers.forEach(addMergedSubscriber);

  normalizedExisting.giveawayWinners.forEach(addMergedWinner);
  normalizedBundled.giveawayWinners.forEach(addMergedWinner);

  function shouldPreferBundledPoster(
    existingPoster: string,
    bundledPoster: string,
  ) {
    const existingKind = classifyPosterPath(existingPoster);
    const bundledKind = classifyPosterPath(bundledPoster);

    if (bundledKind === "missing") {
      return false;
    }

    if (existingKind === "missing") {
      return true;
    }

    // Repo-managed /posters assets are the source of truth unless the existing
    // record has an explicit admin-managed upload or external URL.
    if (
      bundledKind === "managed" &&
      existingKind !== "uploaded" &&
      existingKind !== "external" &&
      existingPoster.trim() !== bundledPoster.trim()
    ) {
      return true;
    }

    if (
      existingKind === "batch" &&
      bundledKind === "managed"
    ) {
      return true;
    }

    return false;
  }

  function shouldPreferBundledReviewerName(
    existingReviewerName: string,
    bundledReviewerName: string,
  ) {
    const existingValue = existingReviewerName.trim();
    const bundledValue = bundledReviewerName.trim();

    if (!bundledValue) {
      return false;
    }

    if (!existingValue) {
      return true;
    }

    const normalizedExisting = existingValue.toUpperCase();
    const normalizedBundled = bundledValue.toUpperCase();

    if (normalizedExisting === normalizedBundled) {
      return false;
    }

    // Reviewer attribution is editorial data owned by the bundled seed. If the
    // repo assignment changes (for example Ace -> Mindy / Leeanna), keep the
    // bundled reviewer name instead of preserving an older Blob value.
    return true;
  }

  const mergedReviews = normalizedExisting.reviews.map((review) => {
    const existingReview = enforceReviewPolicies(review);
    const bundledReview = bundledBySlug.get(existingReview.slug);

    if (!bundledReview) {
      return existingReview;
    }

    bundledBySlug.delete(existingReview.slug);

    const preferBundledReviewFields =
      getTimestamp(bundledReview.updatedAt) > getTimestamp(existingReview.updatedAt);

    const mergeStringField = (existingValue: string, bundledValue: string) => {
      if (preferBundledReviewFields && bundledValue.trim()) {
        return bundledValue;
      }

      return existingValue.trim() ? existingValue : bundledValue;
    };

    const mergeArrayField = (
      existingValue: string[],
      bundledValue: string[],
    ) => {
      if (preferBundledReviewFields && bundledValue.length > 0) {
        return bundledValue;
      }

      return existingValue.length > 0 ? existingValue : bundledValue;
    };

    const mergedReview = {
      ...(preferBundledReviewFields ? existingReview : bundledReview),
      ...(preferBundledReviewFields ? bundledReview : existingReview),
      posterImage: shouldPreferBundledPoster(
        normalizePosterPath(existingReview.posterImage),
        normalizePosterPath(bundledReview.posterImage),
      )
        ? normalizePosterPath(bundledReview.posterImage)
        : normalizePosterPath(existingReview.posterImage) ||
          normalizePosterPath(bundledReview.posterImage),
      backdropImage: mergeStringField(
        existingReview.backdropImage,
        bundledReview.backdropImage,
      ),
      releaseYear:
        preferBundledReviewFields && bundledReview.releaseYear !== null
          ? bundledReview.releaseYear
          : existingReview.releaseYear ?? bundledReview.releaseYear,
      verdict:
        preferBundledReviewFields && bundledReview.verdict
          ? bundledReview.verdict
          : existingReview.verdict,
      rating:
        preferBundledReviewFields && bundledReview.rating !== null
          ? bundledReview.rating
          : existingReview.rating ?? bundledReview.rating,
      reviewerName: shouldPreferBundledReviewerName(
        existingReview.reviewerName,
        bundledReview.reviewerName,
      )
        ? bundledReview.reviewerName
        : mergeStringField(existingReview.reviewerName, bundledReview.reviewerName),
      quickHit: mergeStringField(existingReview.quickHit, bundledReview.quickHit),
      fullTake: mergeStringField(existingReview.fullTake, bundledReview.fullTake),
      reviewVideoUrl: mergeStringField(
        existingReview.reviewVideoUrl,
        bundledReview.reviewVideoUrl,
      ),
      whereToWatchUrl: mergeStringField(
        existingReview.whereToWatchUrl,
        bundledReview.whereToWatchUrl,
      ),
      amazonAffiliateUrl: mergeStringField(
        existingReview.amazonAffiliateUrl ?? "",
        bundledReview.amazonAffiliateUrl ?? "",
      ),
      featured:
        preferBundledReviewFields && bundledReview.featured !== existingReview.featured
          ? bundledReview.featured
          : existingReview.featured,
      genreTags: mergeArrayField(existingReview.genreTags, bundledReview.genreTags),
      moodTags: mergeArrayField(existingReview.moodTags, bundledReview.moodTags),
      runtime: mergeStringField(existingReview.runtime, bundledReview.runtime),
      director: mergeStringField(existingReview.director, bundledReview.director),
      status:
        forcedDraftSlugs.has(existingReview.slug)
          ? "draft"
          : preferBundledReviewFields && bundledReview.status
          ? bundledReview.status
          : existingReview.status,
      updatedAt: preferBundledReviewFields
        ? bundledReview.updatedAt
        : existingReview.updatedAt,
    } satisfies Review;

    return enforceReviewPolicies(mergedReview);
  });

  const missingBundledReviews = [...bundledBySlug.values()].map(
    enforceReviewPolicies,
  );

  return {
    ...normalizedExisting,
    reviews: [...mergedReviews, ...missingBundledReviews],
    comments: [...mergedCommentMap.values()].sort(
      (left, right) =>
        +new Date(right.createdAt || 0) - +new Date(left.createdAt || 0),
    ),
    newsletterSubscribers: [...mergedSubscriberMap.values()].sort(
      (left, right) =>
        +new Date(right.createdAt || 0) - +new Date(left.createdAt || 0),
    ),
    giveawayWinners: [...mergedWinnerMap.values()].sort(
      (left, right) =>
        +new Date(right.drawnAt || 0) - +new Date(left.drawnAt || 0),
    ),
  } satisfies SiteData;
}

function requireBlobInProduction() {
  if (isDeployedProduction && !isVercelBlobEnabled) {
    throw new Error(
      "Production storage is not configured. Connect Vercel Blob and set BLOB_READ_WRITE_TOKEN.",
    );
  }
}

async function readBuildSafeSiteData() {
  if (isDeployedProduction) {
    return getBundledSeedData();
  }

  return await readLocalSeedData();
}

async function readSiteDataWithFallback(error: unknown) {
  if (
    error instanceof Error &&
    isDeployedProduction
  ) {
    console.warn(
      `Falling back to bundled site data after Blob read failed: ${error.message}`,
    );
  }

  return await readBuildSafeSiteData();
}

async function readBlobSiteData() {
  const result = await get(siteDataBlobPath, {
    access: blobAccess,
    useCache: false,
  });

  if (!result || !result.stream) {
    const seedData = isDeployedProduction
      ? getBundledSeedData()
      : await readLocalSeedData();
    await put(siteDataBlobPath, JSON.stringify(seedData, null, 2), {
      access: blobAccess,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return seedData;
  }

  const raw = await streamToText(result.stream);
  const blobData = normalizeSiteData(JSON.parse(raw));
  const bundledData = getBundledSeedData();
  const mergedData = mergeSiteData(blobData, bundledData);

  if (JSON.stringify(mergedData) !== JSON.stringify(blobData)) {
    await put(siteDataBlobPath, JSON.stringify(mergedData, null, 2), {
      access: blobAccess,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
  }

  return mergedData;
}

export async function readSiteData() {
  if (isBuildPrerender) {
    return await readBuildSafeSiteData();
  }

  requireBlobInProduction();

  if (isVercelBlobEnabled) {
    try {
      return await readBlobSiteData();
    } catch (error) {
      return await readSiteDataWithFallback(error);
    }
  }

  return await readLocalSeedData();
}

export async function writeSiteData(data: SiteData) {
  requireBlobInProduction();
  const normalizedData = normalizeSiteData(data);

  if (isVercelBlobEnabled) {
    await put(siteDataBlobPath, JSON.stringify(normalizedData, null, 2), {
      access: blobAccess,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }

  await ensureDataFile();
  await writeFile(dataFilePath, JSON.stringify(normalizedData, null, 2), "utf8");
}

export async function saveUpload(
  file: File,
  prefix: string,
  kind: "poster" | "backdrop" = "poster",
) {
  if (!file || file.size === 0) {
    return "";
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]+/g, "-").toLowerCase();
  const fileName = `${prefix}-${Date.now()}-${safeName}`;

  if (isDeployedProduction) {
    throw new Error(
      "File uploads are disabled in deployed production. Add poster files under /public/posters and save the /posters/... path instead.",
    );
  }

  const outputDirectory =
    kind === "poster" ? posterUploadsDirectory : uploadsDirectory;
  const publicBasePath = kind === "poster" ? "/posters/manual" : "/uploads";
  const outputPath = path.join(outputDirectory, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, bytes);
  return `${publicBasePath}/${fileName}`;
}

export function sortReviewsByNewest(reviews: Review[]) {
  return [...reviews].sort(
    (left, right) => +new Date(right.createdAt) - +new Date(left.createdAt),
  );
}
