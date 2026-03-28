import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import bundledSeedData from "@/data/site-data.json";
import pendingPosterSlugs from "@/data/pending-poster-slugs.json";
import { Review, SiteData } from "@/lib/types";

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
  return JSON.parse(raw) as SiteData;
}

function getBundledSeedData() {
  return bundledSeedData as SiteData;
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
  return {
    ...review,
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
  const bundledBySlug = new Map(
    bundled.reviews.map((review) => [review.slug, enforceReviewPolicies(review)]),
  );

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

  const mergedReviews = existing.reviews.map((review) => {
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
      reviewerName: mergeStringField(
        existingReview.reviewerName,
        bundledReview.reviewerName,
      ),
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
    ...existing,
    reviews: [...mergedReviews, ...missingBundledReviews],
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
  const blobData = JSON.parse(raw) as SiteData;
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

  if (isVercelBlobEnabled) {
    await put(siteDataBlobPath, JSON.stringify(data, null, 2), {
      access: blobAccess,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }

  await ensureDataFile();
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
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
