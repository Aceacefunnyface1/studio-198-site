export const verdictOptions = [
  "WATCH",
  "ONLY IF YOU'RE INTO IT",
  "DON'T BOTHER",
  "STRAIGHT TRASH 💩",
] as const;

export const statusOptions = ["published", "draft"] as const;

export type Verdict = (typeof verdictOptions)[number];
export type ReviewStatus = (typeof statusOptions)[number];

export type Review = {
  id: string;
  movieTitle: string;
  slug: string;
  imdbTop250Rank?: number | null;
  releaseYear: number | null;
  posterImage: string;
  backdropImage: string;
  verdict: Verdict;
  rating: number | null;
  reviewerName: string;
  quickHit: string;
  fullTake: string;
  reviewVideoUrl: string;
  whereToWatchUrl: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  genreTags: string[];
  moodTags: string[];
  runtime: string;
  director: string;
  status: ReviewStatus;
};

export type Comment = {
  id: string;
  reviewId: string;
  reviewSlug: string;
  displayName: string;
  body: string;
  createdAt: string;
  status: "visible" | "hidden";
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type SiteData = {
  reviews: Review[];
  comments: Comment[];
  likes: Record<string, number>;
  inquiries: Inquiry[];
};

export type ReviewWithStats = Review & {
  likeCount: number;
  commentCount: number;
  ratingLabel: string;
  verdictKey: string;
  resolvedPosterImage: string;
  posterStatus: "approved" | "needs-replacement" | "missing";
  posterSource: "custom" | "batch-17" | "external" | "missing";
};
