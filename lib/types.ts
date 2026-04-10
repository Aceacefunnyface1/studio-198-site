export const verdictOptions = [
  "🔥",
  "👀",
  "❌",
  "💩",
] as const;

export const statusOptions = ["published", "draft"] as const;

export type Verdict = (typeof verdictOptions)[number];
export type VerdictTone = "fire" | "mixed" | "nope" | "trash";
export type ReviewStatus = (typeof statusOptions)[number];
export type AmazonLinkType = "dp" | "search";
export type WatchProviderType =
  | "subscription"
  | "rent_buy"
  | "free"
  | "ads"
  | "channel"
  | "other";

export type WatchProvider = {
  name: string;
  type: WatchProviderType;
};

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
  amazonAffiliateUrl?: string;
  amazonUrl?: string;
  amazonAsin?: string;
  amazonLinkType?: AmazonLinkType;
  watchProviders?: WatchProvider[];
  watchDataSource?: string;
  watchLastCheckedAt?: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  genreTags: string[];
  moodTags: string[];
  runtime: string;
  director: string;
  status: ReviewStatus;
  collection?: string;
  pendingPoster?: boolean;
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

export type NewsletterSubscriberStatus = "active" | "inactive";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  createdAt: string;
  status: NewsletterSubscriberStatus;
};

export type GiveawayWinnerStatus = "selected";

export type GiveawayWinner = {
  id: string;
  email: string;
  drawnAt: string;
  giveawayMonth: string;
  prize: string;
  status: GiveawayWinnerStatus;
};

export type SiteData = {
  reviews: Review[];
  comments: Comment[];
  likes: Record<string, number>;
  inquiries: Inquiry[];
  newsletterSubscribers: NewsletterSubscriber[];
  giveawayWinners: GiveawayWinner[];
};

export type ReviewWithStats = Review & {
  likeCount: number;
  heatCount: number;
  commentCount: number;
  ratingLabel: string;
  verdictTone: VerdictTone;
  resolvedPosterImage: string;
  posterStatus: "approved" | "needs-replacement" | "missing";
  posterSource: "custom" | "batch-17" | "external" | "missing";
};
