import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import bundledSeedData from "@/data/site-data.json";
import { Review, SiteData } from "@/lib/types";

const dataFilePath = path.join(process.cwd(), "data", "site-data.json");
const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
const siteDataBlobPath = "site-data.json";

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
  const value = posterPath.trim();

  if (!value) {
    return "missing" as const;
  }

  if (value === "/posters/updating-placeholder.png") {
    return "placeholder" as const;
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

function getTimestamp(value: string | null | undefined) {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function mergeSiteData(existing: SiteData, bundled: SiteData) {
  const bundledBySlug = new Map(
    bundled.reviews.map((review) => [review.slug, review]),
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
      (bundledKind === "placeholder" || bundledKind === "managed")
    ) {
      return true;
    }

    return false;
  }

  const mergedReviews = existing.reviews.map((review) => {
    const bundledReview = bundledBySlug.get(review.slug);

    if (!bundledReview) {
      return review;
    }

    bundledBySlug.delete(review.slug);

    const preferBundledReviewFields =
      getTimestamp(bundledReview.updatedAt) > getTimestamp(review.updatedAt);

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

    return {
      ...(preferBundledReviewFields ? review : bundledReview),
      ...(preferBundledReviewFields ? bundledReview : review),
      posterImage: shouldPreferBundledPoster(
        review.posterImage || "",
        bundledReview.posterImage || "",
      )
        ? bundledReview.posterImage
        : review.posterImage && review.posterImage.trim()
          ? review.posterImage
          : bundledReview.posterImage,
      backdropImage: mergeStringField(
        review.backdropImage,
        bundledReview.backdropImage,
      ),
      releaseYear:
        preferBundledReviewFields && bundledReview.releaseYear !== null
          ? bundledReview.releaseYear
          : review.releaseYear ?? bundledReview.releaseYear,
      verdict:
        preferBundledReviewFields && bundledReview.verdict
          ? bundledReview.verdict
          : review.verdict,
      rating:
        preferBundledReviewFields && bundledReview.rating !== null
          ? bundledReview.rating
          : review.rating ?? bundledReview.rating,
      reviewerName: mergeStringField(
        review.reviewerName,
        bundledReview.reviewerName,
      ),
      quickHit: mergeStringField(review.quickHit, bundledReview.quickHit),
      fullTake: mergeStringField(review.fullTake, bundledReview.fullTake),
      reviewVideoUrl: mergeStringField(
        review.reviewVideoUrl,
        bundledReview.reviewVideoUrl,
      ),
      whereToWatchUrl: mergeStringField(
        review.whereToWatchUrl,
        bundledReview.whereToWatchUrl,
      ),
      featured:
        preferBundledReviewFields && bundledReview.featured !== review.featured
          ? bundledReview.featured
          : review.featured,
      genreTags: mergeArrayField(review.genreTags, bundledReview.genreTags),
      moodTags: mergeArrayField(review.moodTags, bundledReview.moodTags),
      runtime: mergeStringField(review.runtime, bundledReview.runtime),
      director: mergeStringField(review.director, bundledReview.director),
      status:
        preferBundledReviewFields && bundledReview.status
          ? bundledReview.status
          : review.status,
      updatedAt: preferBundledReviewFields
        ? bundledReview.updatedAt
        : review.updatedAt,
    };
  });

  const missingBundledReviews = [...bundledBySlug.values()];

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
  requireBlobInProduction();

  if (isVercelBlobEnabled) {
    return await readBlobSiteData();
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

export async function saveUpload(file: File, prefix: string) {
  if (!file || file.size === 0) {
    return "";
  }

  requireBlobInProduction();

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]+/g, "-").toLowerCase();
  const fileName = `${prefix}-${Date.now()}-${safeName}`;

  if (isVercelBlobEnabled) {
    const result = await put(`uploads/${fileName}`, file, {
      access: blobAccess,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: file.type || undefined,
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    });

    return blobAccess === "private"
      ? `/media/${result.pathname}`
      : result.url;
  }

  const outputPath = path.join(uploadsDirectory, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadsDirectory, { recursive: true });
  await writeFile(outputPath, bytes);
  return `/uploads/${fileName}`;
}

export function sortReviewsByNewest(reviews: Review[]) {
  return [...reviews].sort(
    (left, right) => +new Date(right.createdAt) - +new Date(left.createdAt),
  );
}
