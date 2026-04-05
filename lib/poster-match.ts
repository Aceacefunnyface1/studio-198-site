export const POSTER_MATCH_ROUTE = "/poster-match";
export const POSTER_MATCH_TOTAL_PAIRS = 20;
export const POSTER_MATCH_TOTAL_CARDS = POSTER_MATCH_TOTAL_PAIRS * 2;
export const POSTER_MATCH_POINTS_PER_PAIR = 2;
export const POSTER_MATCH_STORAGE_KEY = "studio198.poster-match.v1";

export type PosterMatchReward = 0 | 1 | 2 | 3;

export type PosterMatchPoster = {
  id: string;
  slug: string;
  title: string;
  image: string;
  amazonAffiliateUrl?: string;
};

export function getPosterMatchReward(matchesFound: number): PosterMatchReward {
  if (matchesFound >= 20) {
    return 3;
  }

  if (matchesFound >= 15) {
    return 2;
  }

  if (matchesFound >= 10) {
    return 1;
  }

  return 0;
}

export function getChicagoDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
