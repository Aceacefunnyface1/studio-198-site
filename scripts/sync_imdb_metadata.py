from __future__ import annotations

import csv
import json
import re
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET


DOCX_PATH = Path("/Users/bradbehnke/Desktop/8 suggestions available.docx")
SITE_DATA_PATH = Path("/Users/bradbehnke/studio-198-site/data/site-data.json")
EXPORT_JSON_PATH = Path("/Users/bradbehnke/studio-198-site/data/imdb-top-250.json")
EXPORT_CSV_PATH = Path("/Users/bradbehnke/studio-198-site/data/imdb-top-250.csv")
REPORT_PATH = Path("/Users/bradbehnke/studio-198-site/reports/imdb-top-250-audit.md")
POSTER_OVERRIDE_PATH = Path("/Users/bradbehnke/studio-198-site/data/poster-overrides.json")

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def normalize_title(value: str) -> str:
    value = (
        value.lower()
        .replace("’", "'")
        .replace("é", "e")
        .replace("·", "")
        .replace("–", "-")
        .replace("—", "-")
        .replace(".", "")
    )
    return re.sub(r"[^a-z0-9]+", "", value)


def parse_docx_entries() -> list[dict[str, int | str | None]]:
    with zipfile.ZipFile(DOCX_PATH) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))

    paragraphs = []
    for paragraph in root.findall(".//w:p", NS):
        text = "".join(t.text or "" for t in paragraph.findall(".//w:t", NS)).strip()
        if text:
            paragraphs.append(text)

    entries: list[dict[str, int | str | None]] = []
    index = 0
    while index < len(paragraphs):
        if re.fullmatch(r"#\d+", paragraphs[index]):
            rank = int(paragraphs[index][1:])
            title = paragraphs[index + 1] if index + 1 < len(paragraphs) else ""
            year = None
            if index + 2 < len(paragraphs):
                match = re.match(r"^(\d{4})", paragraphs[index + 2])
                if match:
                    year = int(match.group(1))

            entries.append(
                {
                    "rank": rank,
                    "title": title,
                    "normalizedTitle": normalize_title(title),
                    "year": year,
                }
            )
            index += 4
        else:
            index += 1

    return entries


def main() -> None:
    entries = parse_docx_entries()
    site_data = json.loads(SITE_DATA_PATH.read_text())
    poster_overrides = json.loads(POSTER_OVERRIDE_PATH.read_text())

    reviews = site_data["reviews"]
    reviews_by_norm = {normalize_title(review["movieTitle"]): review for review in reviews}

    already_on_site = []
    missing_from_site = []
    low_quality_on_site = []

    for entry in entries:
        review = reviews_by_norm.get(entry["normalizedTitle"])
        if not review:
            missing_from_site.append(entry)
            continue

        original_title = review["movieTitle"]
        if original_title != entry["title"]:
            review["movieTitle"] = entry["title"]

        review["imdbTop250Rank"] = entry["rank"]
        review["releaseYear"] = entry["year"]

        already_on_site.append(
            {
                "rank": entry["rank"],
                "title": entry["title"],
                "slug": review["slug"],
                "year": entry["year"],
                "posterImage": review.get("posterImage", ""),
                "titleNormalized": original_title != entry["title"],
            }
        )

        if review.get("posterImage", "").startswith("/posters/batch-17/"):
            low_quality_on_site.append(
                {
                    "rank": entry["rank"],
                    "title": entry["title"],
                    "slug": review["slug"],
                    "year": entry["year"],
                    "posterImage": review.get("posterImage", ""),
                }
            )
            if review["slug"] in poster_overrides:
                poster_overrides[review["slug"]]["status"] = "needs-replacement"

    SITE_DATA_PATH.write_text(json.dumps(site_data, indent=2, ensure_ascii=False) + "\n")
    POSTER_OVERRIDE_PATH.write_text(
        json.dumps(poster_overrides, indent=2, ensure_ascii=False) + "\n"
    )

    EXPORT_JSON_PATH.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n")
    with EXPORT_CSV_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["rank", "title", "year", "normalizedTitle"])
        writer.writeheader()
        writer.writerows(entries)

    lines = [
        "# IMDb Top 250 Metadata Audit",
        "",
        f"- Already on site: {len(already_on_site)}",
        f"- Missing from site: {len(missing_from_site)}",
        f"- On site but using low-quality batch-17 posters: {len(low_quality_on_site)}",
        "",
        "## Already On Site",
        "",
    ]

    for item in sorted(already_on_site, key=lambda row: row["rank"]):
        suffix = " (title normalized)" if item["titleNormalized"] else ""
        lines.append(
            f"- #{item['rank']} {item['title']} ({item['year']}) — slug `{item['slug']}` — `{item['posterImage'] or '(missing)'}`{suffix}"
        )

    lines.extend(["", "## Missing From Site", ""])
    for item in sorted(missing_from_site, key=lambda row: row["rank"]):
        lines.append(f"- #{item['rank']} {item['title']} ({item['year']})")

    lines.extend(["", "## On Site But Using Low-Quality Batch-17 Posters", ""])
    for item in sorted(low_quality_on_site, key=lambda row: row["rank"]):
        lines.append(
            f"- #{item['rank']} {item['title']} ({item['year']}) — slug `{item['slug']}` — `{item['posterImage']}`"
        )

    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(
        f"Updated {len(already_on_site)} existing reviews, found {len(missing_from_site)} missing titles, and flagged {len(low_quality_on_site)} low-quality poster entries."
    )


if __name__ == "__main__":
    main()
