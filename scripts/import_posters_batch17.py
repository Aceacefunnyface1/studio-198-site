from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET


WORKBOOK_PATH = Path("/Users/bradbehnke/Downloads/ACE_batch_17.xlsx")
DATA_PATH = Path("/Users/bradbehnke/studio-198-site/data/site-data.json")
OUTPUT_DIR = Path("/Users/bradbehnke/studio-198-site/public/posters/batch-17")

NS = {
    "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def slugify(value: str) -> str:
    return re.sub(r"(^-+|-+$)", "", re.sub(r"[^a-z0-9]+", "-", value.lower())).strip("-")


def is_title_candidate(value: str) -> bool:
    if not value:
        return False
    if value.startswith("#") or value.startswith("Sort by"):
        return False
    if re.match(r"^\d{4}.*\d", value):
        return False
    if re.match(r"^\d+(\.\d+)?\s*\(", value) or "\xa0(" in value:
        return False
    return bool(re.search(r"[A-Za-z]", value))


def load_sheet_rows(archive: zipfile.ZipFile) -> dict[int, dict[str, str]]:
    shared_strings: list[str] = []
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    for si in root.findall("main:si", NS):
        shared_strings.append("".join(t.text or "" for t in si.iterfind(".//main:t", NS)))

    sheet = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
    rows: dict[int, dict[str, str]] = {}
    for row in sheet.findall(".//main:sheetData/main:row", NS):
        idx = int(row.attrib["r"])
        row_values: dict[str, str] = {}
        for cell in row.findall("main:c", NS):
            ref = cell.attrib["r"]
            cell_type = cell.attrib.get("t")
            raw_value = cell.find("main:v", NS)
            if cell_type == "s" and raw_value is not None:
                value = shared_strings[int(raw_value.text)]
            elif cell_type == "inlineStr":
                value = "".join(t.text or "" for t in cell.iterfind(".//main:t", NS))
            elif raw_value is not None:
                value = raw_value.text or ""
            else:
                value = ""
            row_values[ref] = value.strip()
        rows[idx] = row_values
    return rows


def extract_poster_map() -> dict[str, bytes]:
    poster_bytes_by_slug: dict[str, bytes] = {}
    with zipfile.ZipFile(WORKBOOK_PATH) as archive:
        rows = load_sheet_rows(archive)
        drawing = ET.fromstring(archive.read("xl/drawings/drawing1.xml"))
        rels = ET.fromstring(archive.read("xl/drawings/_rels/drawing1.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}

        anchors = drawing.findall("xdr:twoCellAnchor", NS) + drawing.findall(
            "xdr:oneCellAnchor", NS
        )
        for anchor in anchors:
            frm = anchor.find("xdr:from", NS)
            pic = anchor.find("xdr:pic", NS)
            if frm is None or pic is None:
                continue

            start_row = int(frm.find("xdr:row", NS).text) + 1
            title = ""
            for row_number in range(start_row, start_row + 7):
                value = rows.get(row_number, {}).get(f"A{row_number}", "").strip()
                if is_title_candidate(value):
                    title = value
                    break

            if not title:
                continue

            embed_id = pic.find(".//a:blip", NS).attrib[
                "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"
            ]
            media_target = rel_map[embed_id].replace("../", "xl/")
            poster_bytes_by_slug[slugify(title)] = archive.read(media_target)

    return poster_bytes_by_slug


def main() -> None:
    data = json.loads(DATA_PATH.read_text())
    posters = extract_poster_map()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    updated = 0
    for review in data["reviews"]:
        slug = slugify(review["movieTitle"])
        if slug not in posters:
            continue

        output_path = OUTPUT_DIR / f"{slug}.jpeg"
        output_path.write_bytes(posters[slug])
        review["posterImage"] = f"/posters/batch-17/{slug}.jpeg"
        updated += 1

    DATA_PATH.write_text(json.dumps(data, indent=2) + "\n")
    print(f"Updated {updated} reviews with poster images.")


if __name__ == "__main__":
    main()
