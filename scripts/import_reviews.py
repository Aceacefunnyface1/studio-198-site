from __future__ import annotations

import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path
import xml.etree.ElementTree as ET


WORKBOOK_PATHS = [
    Path("/Users/bradbehnke/Downloads/ACE_FULL_movie_reviews.xlsx"),
    Path("/Users/bradbehnke/Downloads/ACE_remaining_only_87_250.xlsx"),
]
DATA_PATH = Path("/Users/bradbehnke/studio-198-site/data/site-data.json")
NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def slugify(value: str) -> str:
    return re.sub(r"(^-+|-+$)", "", re.sub(r"[^a-z0-9]+", "-", value.lower())).strip("-")


def normalize_verdict(value: str) -> str:
    normalized = value.replace("’", "'").strip()
    mapping = {
        "WATCH": "WATCH",
        "ONLY IF YOU'RE INTO IT": "ONLY IF YOU'RE INTO IT",
        "DON'T BOTHER": "DON'T BOTHER",
        "STRAIGHT TRASH 💩": "STRAIGHT TRASH 💩",
    }
    if normalized not in mapping:
        raise ValueError(f"Unsupported verdict: {value}")
    return mapping[normalized]


def read_workbook_rows(workbook_path: Path) -> list[dict[str, str]]:
    with zipfile.ZipFile(workbook_path) as zf:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in zf.namelist():
            root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for si in root.findall("a:si", NS):
                shared_strings.append("".join(t.text or "" for t in si.iterfind(".//a:t", NS)))

        workbook = ET.fromstring(zf.read("xl/workbook.xml"))
        rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
        first_sheet = workbook.find("a:sheets", NS)[0]
        rel_id = first_sheet.attrib[
            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
        ]
        target = rel_map[rel_id].lstrip("/")
        if not target.startswith("xl/"):
            target = f"xl/{target}"

        sheet = ET.fromstring(zf.read(target))
        rows: list[list[str]] = []
        for row in sheet.findall(".//a:sheetData/a:row", NS):
            values: list[str] = []
            for cell in row.findall("a:c", NS):
                cell_type = cell.attrib.get("t")
                raw_value = cell.find("a:v", NS)
                if cell_type == "s" and raw_value is not None:
                    value = shared_strings[int(raw_value.text)]
                elif cell_type == "inlineStr":
                    value = "".join(t.text or "" for t in cell.iterfind(".//a:t", NS))
                elif raw_value is not None:
                    value = raw_value.text or ""
                else:
                    value = ""
                values.append(value.strip())
            rows.append(values)

    # Some sheets have a title row before the actual header.
    header_index = 0
    for index, row in enumerate(rows):
      if "Movie Title" in row:
        header_index = index
        break

    header = rows[header_index]
    return [dict(zip(header, row)) for row in rows[header_index + 1 :] if any(row)]


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    rows = []
    for workbook_path in WORKBOOK_PATHS:
        rows.extend(read_workbook_rows(workbook_path))
    now = datetime.now(timezone.utc).isoformat()

    reviews_by_slug = {review["slug"]: review for review in data["reviews"]}

    for index, row in enumerate(rows):
        title = row["Movie Title"].strip()
        slug = slugify(title)
        existing = reviews_by_slug.get(slug)

        base = existing or {
            "id": f"imported-{slug}",
            "movieTitle": title,
            "slug": slug,
            "releaseYear": None,
            "posterImage": "",
            "backdropImage": "",
            "verdict": "WATCH",
            "rating": None,
            "reviewerName": "Ace Verdict",
            "quickHit": "",
            "fullTake": "",
            "reviewVideoUrl": "",
            "whereToWatchUrl": "",
            "createdAt": now,
            "updatedAt": now,
            "featured": index < 6,
            "genreTags": ["Imported"],
            "moodTags": [],
            "runtime": "",
            "director": "",
            "status": "published",
        }

        merged = {
            **base,
            "movieTitle": title,
            "slug": slug,
            "releaseYear": (
                int(row["Year"])
                if row.get("Year", "").strip().isdigit()
                else base.get("releaseYear")
            ),
            "verdict": normalize_verdict(row["ACE Verdict"]),
            "quickHit": row["Quick Hit"].strip(),
            "fullTake": row["Full Take"].strip(),
            "updatedAt": now,
            "status": "published",
        }

        reviews_by_slug[slug] = merged

    preserved = [
        review
        for review in data["reviews"]
        if review["slug"] not in reviews_by_slug or review["slug"] == "next-review-slot"
    ]
    imported_reviews = list(reviews_by_slug.values())

    data["reviews"] = [
        *[review for review in imported_reviews if review["slug"] != "next-review-slot"],
        *[review for review in preserved if review["slug"] == "next-review-slot"],
    ]

    DATA_PATH.write_text(json.dumps(data, indent=2) + "\n")
    print(f"Imported {len(rows)} spreadsheet reviews. Total reviews: {len(data['reviews'])}")


if __name__ == "__main__":
    main()
