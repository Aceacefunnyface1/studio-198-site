import { Verdict, VerdictTone } from "@/lib/types";

type RatingVisual = {
  iconSrc: string;
  iconAlt: string;
  label: string;
};

type ReviewerPresentation = {
  label: string;
  tone: "ace" | "mandy" | "leeanna";
};

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

export function getRatingVisual(rating: number | null): RatingVisual | null {
  if (rating === null || Number.isNaN(rating)) {
    return null;
  }

  if (rating >= 4.0) {
    return {
      iconSrc: "/rating-icons/fire-eye.png",
      iconAlt: "Fire eye rating icon",
      label: "elite",
    };
  }

  if (rating >= 3.0) {
    return {
      iconSrc: "/rating-icons/skull.png",
      iconAlt: "Skull rating icon",
      label: "solid",
    };
  }

  if (rating >= 1.1) {
    return {
      iconSrc: "/rating-icons/block.png",
      iconAlt: "No symbol rating icon",
      label: "bad",
    };
  }

  return {
    iconSrc: "/rating-icons/poop.png",
    iconAlt: "Poop rating icon",
    label: "trash",
  };
}

export function getReviewerPresentation(
  reviewerName: string | null | undefined,
): ReviewerPresentation {
  const normalized = (reviewerName || "").trim().toUpperCase();

  if (normalized.includes("MANDY")) {
    return {
      label: 'INSTINCT "MANDY"',
      tone: "mandy",
    };
  }

  if (normalized.includes("LEEANNA")) {
    return {
      label: 'ARCHITECT "LEEANNA"',
      tone: "leeanna",
    };
  }

  return {
    label: 'EXECUTIONER "ACE"',
    tone: "ace",
  };
}

export function verdictTone(verdict: Verdict): VerdictTone {
  switch (verdict) {
    case "🔥":
      return "fire";
    case "👀":
      return "mixed";
    case "❌":
      return "nope";
    case "💩":
      return "trash";
  }
}

export function clampRating(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return null;
  }

  return Math.max(0, Math.min(5, value));
}
