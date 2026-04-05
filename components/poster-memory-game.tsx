"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getChicagoDateKey,
  getPosterMatchReward,
  POSTER_MATCH_POINTS_PER_PAIR,
  POSTER_MATCH_STORAGE_KEY,
  POSTER_MATCH_TOTAL_PAIRS,
  type PosterMatchPoster,
} from "@/lib/poster-match";

type PosterMemoryGameProps = {
  posters: PosterMatchPoster[];
  reviewHref: string;
  reviewTitle: string;
  watchHref?: string;
};

type GameStatus = "idle" | "in_progress" | "completed";

type GameCard = {
  id: string;
  pairId: string;
  slug: string;
  title: string;
  image: string;
  matched: boolean;
  revealed: boolean;
};

type SavedPosterMatchState = {
  version: 1;
  dateKey: string;
  status: GameStatus;
  cards: GameCard[];
  matchesFound: number;
  points: number;
  rewardEntries: number;
  completedAt: string | null;
  identity: {
    email: string | null;
  };
};

type PosterMatchState = Omit<SavedPosterMatchState, "version" | "dateKey">;

const EMPTY_STATE: PosterMatchState = {
  status: "idle",
  cards: [],
  matchesFound: 0,
  points: 0,
  rewardEntries: 0,
  completedAt: null,
  identity: {
    email: null,
  },
};

function shuffleCards(cards: GameCard[]) {
  const nextCards = [...cards];

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextCards[index], nextCards[swapIndex]] = [nextCards[swapIndex], nextCards[index]];
  }

  return nextCards;
}

function createDeck(posters: PosterMatchPoster[]) {
  return shuffleCards(
    posters.flatMap((poster) => [
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
    ]),
  );
}

function readSavedState() {
  try {
    const rawValue = window.localStorage.getItem(POSTER_MATCH_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as SavedPosterMatchState;
    const todayKey = getChicagoDateKey();

    if (
      parsed.version !== 1 ||
      parsed.dateKey !== todayKey ||
      !Array.isArray(parsed.cards)
    ) {
      window.localStorage.removeItem(POSTER_MATCH_STORAGE_KEY);
      return null;
    }

    if (parsed.status === "in_progress") {
      return {
        ...parsed,
        cards: parsed.cards.map((card) =>
          card.matched
            ? card
            : {
                ...card,
                revealed: false,
              },
        ),
      };
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveState(state: PosterMatchState) {
  const payload: SavedPosterMatchState = {
    version: 1,
    dateKey: getChicagoDateKey(),
    ...state,
  };

  window.localStorage.setItem(POSTER_MATCH_STORAGE_KEY, JSON.stringify(payload));
}

export function PosterMemoryGame({
  posters,
  reviewHref,
  reviewTitle,
  watchHref,
}: PosterMemoryGameProps) {
  const [isReady, setIsReady] = useState(false);
  const [game, setGame] = useState<PosterMatchState>(EMPTY_STATE);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [turnLocked, setTurnLocked] = useState(false);
  const settleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const savedState = readSavedState();

    if (savedState) {
      setGame({
        status: savedState.status,
        cards: savedState.cards,
        matchesFound: savedState.matchesFound,
        points: savedState.points,
        rewardEntries: savedState.rewardEntries,
        completedAt: savedState.completedAt,
        identity: savedState.identity ?? {
          email: null,
        },
      });
      setSelectedCardIds([]);
    }

    setIsReady(true);

    return () => {
      if (settleTimeoutRef.current !== null) {
        window.clearTimeout(settleTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady || game.status === "idle") {
      return;
    }

    saveState(game);
  }, [game, isReady]);

  const startGame = () => {
    if (game.status === "completed" || posters.length !== POSTER_MATCH_TOTAL_PAIRS) {
      return;
    }

    setSelectedCardIds([]);
    setTurnLocked(false);
    setGame({
      status: "in_progress",
      cards: createDeck(posters),
      matchesFound: 0,
      points: 0,
      rewardEntries: 0,
      completedAt: null,
      identity: {
        email: null,
      },
    });
  };

  const handleCardTap = (cardId: string) => {
    if (game.status !== "in_progress" || turnLocked) {
      return;
    }

    const tappedCard = game.cards.find((card) => card.id === cardId);

    if (!tappedCard || tappedCard.matched || tappedCard.revealed) {
      return;
    }

    const nextCards = game.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            revealed: true,
          }
        : card,
    );

    if (!selectedCardIds.length) {
      setGame((current) => ({
        ...current,
        cards: nextCards,
      }));
      setSelectedCardIds([cardId]);
      return;
    }

    const firstCardId = selectedCardIds[0];
    const firstCard = nextCards.find((card) => card.id === firstCardId);
    const secondCard = nextCards.find((card) => card.id === cardId);

    if (!firstCard || !secondCard) {
      return;
    }

    const isMatch = firstCard.pairId === secondCard.pairId;

    setTurnLocked(true);
    setGame((current) => ({
      ...current,
      cards: nextCards,
    }));
    setSelectedCardIds([firstCardId, cardId]);

    settleTimeoutRef.current = window.setTimeout(() => {
      setGame((current) => {
        const matchesFound = current.matchesFound + (isMatch ? 1 : 0);
        const points = current.points + (isMatch ? POSTER_MATCH_POINTS_PER_PAIR : 0);
        const rewardEntries = getPosterMatchReward(matchesFound);
        const cards = current.cards.map((card) => {
          if (card.id !== firstCardId && card.id !== cardId) {
            return card;
          }

          if (isMatch) {
            return {
              ...card,
              matched: true,
              revealed: true,
            };
          }

          return {
            ...card,
            revealed: false,
          };
        });
        const completed = matchesFound === POSTER_MATCH_TOTAL_PAIRS;

        return {
          ...current,
          status: completed ? "completed" : "in_progress",
          cards,
          matchesFound,
          points,
          rewardEntries,
          completedAt: completed ? new Date().toISOString() : current.completedAt,
        };
      });
      setSelectedCardIds([]);
      setTurnLocked(false);
    }, 520);
  };

  const rewardLabel =
    game.rewardEntries > 0
      ? `+${game.rewardEntries} extra entr${game.rewardEntries === 1 ? "y" : "ies"}`
      : "No bonus entry yet";
  const completionLabel =
    game.status === "completed"
      ? "Today’s play is locked in."
      : "1 play per day on this device.";

  if (!isReady) {
    return (
      <section className="poster-match-shell">
        <div className="poster-match-status">
          <p className="eyebrow">Poster Match</p>
          <h1>LOADING THE POSTERS</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="poster-match-shell">
      <div className="poster-match-status">
        <div className="poster-match-status__copy">
          <p className="eyebrow">Giveaway Bonus</p>
          <h1>MATCH THE POSTERS. BANK THE ENTRIES.</h1>
          <p className="poster-match-note">
            10 pairs = +1 entry. 15 pairs = +2. Clear all 20 pairs = +3.
          </p>
        </div>

        <div className="poster-match-metrics" aria-label="Game status">
          <div>
            <strong>{game.matchesFound}</strong>
            <span>Pairs</span>
          </div>
          <div>
            <strong>{game.points}</strong>
            <span>Points</span>
          </div>
          <div>
            <strong>{rewardLabel}</strong>
            <span>Reward</span>
          </div>
        </div>
      </div>

      {game.status === "idle" ? (
        <div className="poster-match-launch">
          <p>{completionLabel}</p>
          <button type="button" className="button-primary" onClick={startGame}>
            Play Poster Match
          </button>
        </div>
      ) : null}

      {game.status !== "idle" ? (
        <div className="poster-match-board" role="grid" aria-label="Movie poster matching game">
          {game.cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={`poster-match-card${card.revealed ? " is-revealed" : ""}${card.matched ? " is-matched" : ""}`}
              onClick={() => handleCardTap(card.id)}
              disabled={turnLocked || card.matched}
              aria-label={
                card.revealed
                  ? `${card.title}${card.matched ? ", matched" : ", revealed"}`
                  : "Reveal poster card"
              }
            >
              <span className="poster-match-card__face poster-match-card__face--back">
                <span>Studio 198</span>
              </span>
              <span className="poster-match-card__face poster-match-card__face--front">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={card.title} loading="lazy" />
                <span className="poster-match-card__label">{card.title}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="poster-match-summary">
        <p>{completionLabel}</p>
        {game.status === "completed" ? (
          <div className="poster-match-complete">
            <div className="poster-match-complete__copy">
              <p className="eyebrow">Game Finished</p>
              <h2>REWARD LOCKED</h2>
              <p>
                You cleared {game.matchesFound} of {POSTER_MATCH_TOTAL_PAIRS} pairs for{" "}
                {game.points} points.
              </p>
              <p>{rewardLabel}</p>
            </div>

            <div className="poster-match-complete__actions">
              <Link href={reviewHref} className="button-primary">
                Read {reviewTitle}
              </Link>
              {watchHref ? (
                <a
                  href={watchHref}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                >
                  Watch / Buy on Amazon
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
