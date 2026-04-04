export const EARLY_HORROR_COLLECTION = "early-horror";
export const EARLY_HORROR_TITLE = "The Bloody Birth of Horror";
export const EARLY_HORROR_SUBTITLE = "1896–1969";
export const EARLY_HORROR_SUPPORT_LINE =
  "761 films. The entire foundation of horror.";
export const EARLY_HORROR_START_YEAR = 1896;
export const EARLY_HORROR_END_YEAR = 1969;

export const earlyHorrorDecades = [
  {
    key: "all",
    label: "All Decades",
    shortLabel: "All Decades",
    startYear: EARLY_HORROR_START_YEAR,
    endYear: EARLY_HORROR_END_YEAR,
  },
  { key: "1890s", label: "1890s", shortLabel: "1890s", startYear: 1890, endYear: 1899 },
  { key: "1900s", label: "1900s", shortLabel: "1900s", startYear: 1900, endYear: 1909 },
  { key: "1910s", label: "1910s", shortLabel: "1910s", startYear: 1910, endYear: 1919 },
  { key: "1920s", label: "1920s", shortLabel: "1920s", startYear: 1920, endYear: 1929 },
  { key: "1930s", label: "1930s", shortLabel: "1930s", startYear: 1930, endYear: 1939 },
  { key: "1940s", label: "1940s", shortLabel: "1940s", startYear: 1940, endYear: 1949 },
  { key: "1950s", label: "1950s", shortLabel: "1950s", startYear: 1950, endYear: 1959 },
  { key: "1960s", label: "1960s", shortLabel: "1960s", startYear: 1960, endYear: 1969 },
] as const;

export type EarlyHorrorDecadeKey = (typeof earlyHorrorDecades)[number]["key"];

export function isEarlyHorrorYear(year: number | null | undefined) {
  if (typeof year !== "number") {
    return false;
  }

  return year >= EARLY_HORROR_START_YEAR && year <= EARLY_HORROR_END_YEAR;
}

export function getEarlyHorrorDecadeKey(
  year: number | null | undefined,
): Exclude<EarlyHorrorDecadeKey, "all"> | null {
  if (!isEarlyHorrorYear(year)) {
    return null;
  }

  const decade = Math.floor((year as number) / 10) * 10;
  return `${decade}s` as Exclude<EarlyHorrorDecadeKey, "all">;
}

export function getEarlyHorrorDecadeLabel(key: EarlyHorrorDecadeKey) {
  return earlyHorrorDecades.find((entry) => entry.key === key)?.label ?? "All Decades";
}
