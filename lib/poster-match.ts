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

export type PosterMatchCard = {
  id: string;
  pairId: string;
  slug: string;
  title: string;
  image: string;
  matched: boolean;
  revealed: boolean;
};

function shuffleCards(cards: PosterMatchCard[]) {
  const nextCards = [...cards];

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextCards[index], nextCards[swapIndex]] = [nextCards[swapIndex], nextCards[index]];
  }

  return nextCards;
}

export function hasValidPosterMatchPosters(posters: PosterMatchPoster[]) {
  if (posters.length !== POSTER_MATCH_TOTAL_PAIRS) {
    return false;
  }

  const ids = new Set<string>();
  const pairKeys = new Set<string>();
  const images = new Set<string>();

  for (const poster of posters) {
    if (!poster.id || !poster.slug || !poster.title || !poster.image) {
      return false;
    }

    if (ids.has(poster.id) || pairKeys.has(poster.slug) || images.has(poster.image)) {
      return false;
    }

    ids.add(poster.id);
    pairKeys.add(poster.slug);
    images.add(poster.image);
  }

  return true;
}

export function createPosterMatchDeck(posters: PosterMatchPoster[]) {
  if (!hasValidPosterMatchPosters(posters)) {
    return null;
  }

  const cards = posters.flatMap((poster) => [
    {
      id: `${poster.id}-a`,
      pairId: poster.id,
      slug: poster.slug,
      title: poster.title,
      image: poster.image,
      matched: false,
      revealed: false,
    },
    {
      id: `${poster.id}-b`,
      pairId: poster.id,
      slug: poster.slug,
      title: poster.title,
      image: poster.image,
      matched: false,
      revealed: false,
    },
  ] satisfies PosterMatchCard[]);

  return shuffleCards(cards);
}

export function hasValidPosterMatchDeck(
  cards: PosterMatchCard[],
  posters?: PosterMatchPoster[],
) {
  if (cards.length !== POSTER_MATCH_TOTAL_CARDS) {
    return false;
  }

  const cardIds = new Set<string>();
  const pairCounts = new Map<string, number>();
  const imageCounts = new Map<string, number>();
  const pairImages = new Map<string, string>();

  for (const card of cards) {
    if (!card.id || !card.pairId || !card.slug || !card.title || !card.image) {
      return false;
    }

    if (cardIds.has(card.id)) {
      return false;
    }

    cardIds.add(card.id);
    pairCounts.set(card.pairId, (pairCounts.get(card.pairId) ?? 0) + 1);
    imageCounts.set(card.image, (imageCounts.get(card.image) ?? 0) + 1);

    const existingPairImage = pairImages.get(card.pairId);

    if (existingPairImage && existingPairImage !== card.image) {
      return false;
    }

    pairImages.set(card.pairId, card.image);
  }

  if (pairCounts.size !== POSTER_MATCH_TOTAL_PAIRS || imageCounts.size !== POSTER_MATCH_TOTAL_PAIRS) {
    return false;
  }

  if ([...pairCounts.values()].some((count) => count !== 2)) {
    return false;
  }

  if ([...imageCounts.values()].some((count) => count !== 2)) {
    return false;
  }

  if (posters) {
    if (!hasValidPosterMatchPosters(posters)) {
      return false;
    }

    const allowedPairs = new Map(posters.map((poster) => [poster.id, poster.image]));

    for (const [pairId, image] of pairImages) {
      if (allowedPairs.get(pairId) !== image) {
        return false;
      }
    }
  }

  return true;
}

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
