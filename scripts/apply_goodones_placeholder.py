from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET


GOODONES_DOCX = Path("/Users/bradbehnke/Desktop/goodones.docx")
SITE_DATA = Path("/Users/bradbehnke/studio-198-site/data/site-data.json")
POSTER_OVERRIDES = Path("/Users/bradbehnke/studio-198-site/data/poster-overrides.json")
REPORT_PATH = Path("/Users/bradbehnke/studio-198-site/reports/poster-placeholder-report.md")
PLACEHOLDER_PATH = "/posters/updating-placeholder.png"

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


def extract_good_titles() -> list[str]:
    with zipfile.ZipFile(GOODONES_DOCX) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))

    paragraphs = []
    for paragraph in root.findall(".//w:p", NS):
        text = "".join(t.text or "" for t in paragraph.findall(".//w:t", NS)).strip()
        if text:
            paragraphs.append(text)

    verdicts = {
        "WATCH",
        "ONLY IF YOU'RE INTO IT",
        "DON'T BOTHER",
        "STRAIGHT TRASH 💩",
    }
    control_strings = {
        "Read Review",
        "Read ReviewWatch Video",
        "Read ReviewWatch VideoWhere To Watch",
    }

    titles: list[str] = []
    for idx, text in enumerate(paragraphs):
        if text not in verdicts:
            continue

        if idx + 1 >= len(paragraphs):
            continue

        candidate = paragraphs[idx + 1].strip()
        if candidate and candidate not in control_strings:
            titles.append(candidate)

    return titles


def main() -> None:
    good_titles = extract_good_titles()
    good_norms = {normalize_title(title) for title in good_titles}

    site_data = json.loads(SITE_DATA.read_text())
    overrides = json.loads(POSTER_OVERRIDES.read_text())

    kept = []
    replaced = []

    for review in site_data["reviews"]:
        poster_path = review.get("posterImage", "")
        if not poster_path.startswith("/posters/batch-17/"):
            continue

        normalized = normalize_title(review["movieTitle"])
        override = overrides.get(review["slug"])

        if normalized in good_norms:
            kept.append(
                {
                    "movieTitle": review["movieTitle"],
                    "slug": review["slug"],
                    "posterPath": poster_path,
                }
            )
            if override:
                override["replacementPath"] = ""
                override["status"] = "approved"
                override["source"] = "goodones-whitelist"
            continue

        review["posterImage"] = PLACEHOLDER_PATH
        replaced.append(
            {
                "movieTitle": review["movieTitle"],
                "slug": review["slug"],
                "oldPosterPath": poster_path,
                "newPosterPath": PLACEHOLDER_PATH,
            }
        )
        if override:
            override["replacementPath"] = PLACEHOLDER_PATH
            override["status"] = "placeholder-active"
            override["source"] = "placeholder-until-replacement"

    SITE_DATA.write_text(json.dumps(site_data, indent=2, ensure_ascii=False) + "\n")
    POSTER_OVERRIDES.write_text(json.dumps(overrides, indent=2, ensure_ascii=False) + "\n")

    lines = [
        "# Poster Placeholder Report",
        "",
        f"- GOOD posters kept: {len(kept)}",
        f"- BAD posters replaced with placeholder: {len(replaced)}",
        f"- Placeholder path: `{PLACEHOLDER_PATH}`",
        "",
        "## GOOD Posters Kept",
        "",
    ]

    for item in sorted(kept, key=lambda row: row["movieTitle"].lower()):
        lines.append(
            f"- {item['movieTitle']} — slug `{item['slug']}` — `{item['posterPath']}`"
        )

    lines.extend(["", "## BAD Posters Replaced With Placeholder", ""])
    for item in sorted(replaced, key=lambda row: row["movieTitle"].lower()):
        lines.append(
            f"- {item['movieTitle']} — slug `{item['slug']}` — `{item['oldPosterPath']}` -> `{item['newPosterPath']}`"
        )

    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(
        f"Kept {len(kept)} whitelisted posters and replaced {len(replaced)} low-quality batch-17 posters with the placeholder."
    )


if __name__ == "__main__":
    main()
