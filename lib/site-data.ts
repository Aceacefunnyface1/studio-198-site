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
  return JSON.parse(raw) as SiteData;
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
