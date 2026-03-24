import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Review, SiteData } from "@/lib/types";

const dataFilePath = path.join(process.cwd(), "data", "site-data.json");
const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

const initialData: SiteData = {
  reviews: [],
  comments: [],
  likes: {},
  inquiries: [],
};

async function ensureDataFile() {
  await mkdir(path.dirname(dataFilePath), { recursive: true });

  try {
    await readFile(dataFilePath, "utf8");
  } catch {
    await writeFile(dataFilePath, JSON.stringify(initialData, null, 2), "utf8");
  }
}

export async function readSiteData() {
  await ensureDataFile();
  const raw = await readFile(dataFilePath, "utf8");
  return JSON.parse(raw) as SiteData;
}

export async function writeSiteData(data: SiteData) {
  await ensureDataFile();
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function saveUpload(file: File, prefix: string) {
  if (!file || file.size === 0) {
    return "";
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]+/g, "-").toLowerCase();
  const fileName = `${prefix}-${Date.now()}-${safeName}`;
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
