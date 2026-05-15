import fs from "node:fs";
import path from "node:path";

export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryCategory = {
  slug: string;
  name: string;
  totalCount: number;
  images: GalleryImage[];
  cover: GalleryImage;
};

const galleryRoot = path.join(process.cwd(), "public", "posters");
const validExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const maxImagesPerCategory = 18;

const categoryCopy: Record<string, string> = {
  "80s-option-b": "Flash archive",
  "batch-17": "Statement pieces",
  "early-horror": "Blackwork references",
  imported: "Custom concepts",
  "imported-horror": "Dark detail work",
  "newlist-import": "Recent additions",
  "reviiews-import": "Client favorites",
};

function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bReviiews\b/g, "Reviews");
}

function toPublicPath(dirName: string, fileName: string) {
  return path.posix.join("/posters", dirName, fileName);
}

function readCategory(dirName: string): GalleryCategory | null {
  const categoryPath = path.join(galleryRoot, dirName);
  const entries = fs
    .readdirSync(categoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && validExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (entries.length === 0) {
    return null;
  }

  const name = categoryCopy[dirName] ?? toTitleCase(dirName);
  const images = entries.slice(0, maxImagesPerCategory).map((fileName, index) => ({
    src: toPublicPath(dirName, fileName),
    alt: `${name} gallery image ${index + 1}`,
  }));

  return {
    slug: dirName,
    name,
    totalCount: entries.length,
    images,
    cover: images[0],
  };
}

function buildGalleryCategories() {
  if (!fs.existsSync(galleryRoot)) {
    return [] as GalleryCategory[];
  }

  return fs
    .readdirSync(galleryRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readCategory(entry.name))
    .filter((category): category is GalleryCategory => Boolean(category))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export const galleryCategories = buildGalleryCategories();

export const featuredGalleryImages = galleryCategories
  .slice(0, 6)
  .map((category) => ({
    ...category.cover,
    category: category.name,
  }));

export const galleryTotals = {
  categories: galleryCategories.length,
  images: galleryCategories.reduce((total, category) => total + category.totalCount, 0),
};
