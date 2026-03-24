export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function splitTags(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ratingLabel(rating: number | null) {
  if (rating === null || Number.isNaN(rating)) {
    return "Rating pending";
  }

  return `${rating.toFixed(1)}/5`;
}

export function verdictKey(value: string) {
  return value
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clampRating(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return null;
  }

  return Math.max(0, Math.min(5, value));
}
