import {
  GiveawayWinner,
  NewsletterSubscriber,
  SiteData,
} from "@/lib/types";

export const GIVEAWAY_PRIZE = "$50 AMC Gift Card";

export function normalizeSubscriberEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidSubscriberEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getGiveawayMonthKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";

  return `${year}-${month}`;
}

export function formatGiveawayMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map((value) => Number.parseInt(value, 10));

  if (!year || !month) {
    return monthKey;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Chicago",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function dedupeEligibleSubscribers(subscribers: NewsletterSubscriber[]) {
  const deduped = new Map<string, NewsletterSubscriber>();

  for (const subscriber of subscribers) {
    if (subscriber.status !== "active") {
      continue;
    }

    const email = normalizeSubscriberEmail(subscriber.email);

    if (!email) {
      continue;
    }

    if (!deduped.has(email)) {
      deduped.set(email, {
        ...subscriber,
        email,
      });
    }
  }

  return [...deduped.values()];
}

type GiveawayDrawResult =
  | { status: "exists"; winner: GiveawayWinner }
  | { status: "no-eligible" }
  | { status: "created"; winner: GiveawayWinner };

export function runMonthlyGiveawayDraw(
  data: SiteData,
  now = new Date(),
): GiveawayDrawResult {
  const giveawayMonth = getGiveawayMonthKey(now);
  const existingWinner = data.giveawayWinners.find(
    (winner) => winner.giveawayMonth === giveawayMonth,
  );

  if (existingWinner) {
    return {
      status: "exists",
      winner: existingWinner,
    };
  }

  const drawTime = now.getTime();
  const eligibleSubscribers = dedupeEligibleSubscribers(
    data.newsletterSubscribers,
  ).filter((subscriber) => {
    const createdAt = Date.parse(subscriber.createdAt);

    return Number.isFinite(createdAt) && createdAt <= drawTime;
  });

  if (!eligibleSubscribers.length) {
    return {
      status: "no-eligible",
    };
  }

  const selectedSubscriber =
    eligibleSubscribers[Math.floor(Math.random() * eligibleSubscribers.length)];
  const winner: GiveawayWinner = {
    id: `winner-${crypto.randomUUID()}`,
    email: selectedSubscriber.email,
    drawnAt: now.toISOString(),
    giveawayMonth,
    prize: GIVEAWAY_PRIZE,
    status: "selected",
  };

  data.giveawayWinners = [winner, ...data.giveawayWinners].sort(
    (left, right) =>
      +new Date(right.drawnAt || 0) - +new Date(left.drawnAt || 0),
  );

  return {
    status: "created",
    winner,
  };
}
