from __future__ import annotations

import json
from pathlib import Path


DEFAULT_RATING = 3.7
SITE_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "site-data.json"


def is_missing_or_invalid_rating(value: object) -> bool:
    if value is None:
        return True

    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return True
        try:
            return float(stripped) == 0
        except ValueError:
            return True

    if isinstance(value, (int, float)):
        return float(value) == 0

    return True


def main() -> None:
    site_data = json.loads(SITE_DATA_PATH.read_text())
    reviews = site_data.get("reviews", [])

    updated = 0
    already_had_ratings = 0

    for review in reviews:
        rating = review.get("rating")
        if is_missing_or_invalid_rating(rating):
            review["rating"] = DEFAULT_RATING
            updated += 1
        else:
            already_had_ratings += 1

    SITE_DATA_PATH.write_text(json.dumps(site_data, indent=2, ensure_ascii=True) + "\n")

    print(f"total reviews updated: {updated}")
    print(f"total reviews already had ratings: {already_had_ratings}")


if __name__ == "__main__":
    main()
