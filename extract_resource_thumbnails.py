from __future__ import annotations

import re
from pathlib import Path

import fitz
import pandas as pd


PDFS = {
    "No Deposit Kings PDF": Path(
        "/Users/bradbehnke/Documents/The-Payout-list/RESOURCE/LATEST USA No Deposit Casino Bonus Codes May 2026.pdf"
    ),
    "SweepsKings Casino List PDF": Path(
        "/Users/bradbehnke/Documents/The-Payout-list/RESOURCE/Best Sweepstakes Casinos 2026 _ List of 305+ Sweeps Casinos.pdf"
    ),
    "SweepsKings Partners PDF": Path(
        "/Users/bradbehnke/Documents/The-Payout-list/RESOURCE/Our Partners _ SweepsKings _ Approved Casinos.pdf"
    ),
    "CryptoSlate Crypto Casino PDF": Path(
        "/Users/bradbehnke/Documents/The-Payout-list/RESOURCE/Best Crypto Casinos 2026 — Trusted Crypto Gambling Sites.pdf"
    ),
}

OUTPUT_DIR = Path("/Users/bradbehnke/Documents/New project/resource-thumbnails")
REPORT_PATH = Path("/Users/bradbehnke/Documents/New project/casino_resource_thumbnail_report.xlsx")

TARGETS = [
    "Jackbit",
    "Thrill",
    "Bets.io",
    "Dexsport",
    "Stake.us",
    "WOW Vegas",
    "Vavada",
    "Crypto-Games.io",
    "BC.Game",
    "Pulsz",
    "McLuck",
    "Fortune Coins",
    "Zula Casino",
    "Chanced",
    "RichSweeps",
    "DimeSweeps",
    "Spree",
    "SpeedSweeps",
    "High 5 Casino",
    "FreeSpin",
    "KingPrize",
    "LoneStar",
    "Captain Jack Casino",
    "Slots of Vegas",
    "Prism Casino",
    "BetFoxx",
    "Coinbet24",
    "Brango Casino",
    "Casino Extreme",
    "Yabby Casino",
]


def slugify(value: str) -> str:
    return re.sub(r"(^-+|-+$)", "", re.sub(r"[^a-z0-9]+", "-", value.lower())).strip("-")


def rect_from_rel(page: fitz.Page, x0: float, y0: float, x1: float, y1: float) -> fitz.Rect:
    width = page.rect.width
    height = page.rect.height
    return fitz.Rect(width * x0, height * y0, width * x1, height * y1)


def clamp_rect(rect: fitz.Rect, page: fitz.Page, padding: float = 0) -> fitz.Rect:
    page_rect = page.rect
    return fitz.Rect(
        max(page_rect.x0 + padding, rect.x0),
        max(page_rect.y0 + padding, rect.y0),
        min(page_rect.x1 - padding, rect.x1),
        min(page_rect.y1 - padding, rect.y1),
    )


def first_search_rect(page: fitz.Page, terms: list[str]) -> fitz.Rect | None:
    for term in terms:
        rects = page.search_for(term)
        if rects:
            return rects[0]
    return None


def crop_nodeposit(page: fitz.Page, terms: list[str]) -> fitz.Rect | None:
    rect = first_search_rect(page, terms)
    if rect is None:
        return None
    crop = fitz.Rect(40, rect.y0 - 45, page.rect.width - 35, rect.y1 + 55)
    return clamp_rect(crop, page, padding=6)


def crop_sweeps_list_feature(page: fitz.Page, terms: list[str]) -> fitz.Rect | None:
    rect = first_search_rect(page, terms)
    if rect is None:
        return None
    crop = fitz.Rect(25, rect.y0 - 95, page.rect.width - 25, rect.y1 + 70)
    return clamp_rect(crop, page, padding=6)


def crop_sweeps_grid(page: fitz.Page, terms: list[str]) -> fitz.Rect | None:
    rect = first_search_rect(page, terms)
    if rect is None:
        return None
    crop = fitz.Rect(rect.x0 - 42, rect.y0 - 55, rect.x1 + 48, rect.y1 + 105)
    return clamp_rect(crop, page, padding=6)


def crop_crypto_list_card(page: fitz.Page, terms: list[str]) -> fitz.Rect | None:
    rect = first_search_rect(page, terms)
    if rect is None:
        return None
    crop = fitz.Rect(85, rect.y0 - 26, page.rect.width - 45, rect.y1 + 36)
    return clamp_rect(crop, page, padding=6)


def crop_crypto_review(page: fitz.Page, terms: list[str]) -> fitz.Rect | None:
    rect = first_search_rect(page, terms)
    if rect is None:
        return None
    crop = fitz.Rect(85, rect.y0 - 30, page.rect.width - 45, rect.y1 + 250)
    return clamp_rect(crop, page, padding=6)


def crop_partner_banner(page: fitz.Page) -> fitz.Rect:
    return clamp_rect(rect_from_rel(page, 0.04, 0.30, 0.95, 0.56), page, padding=6)


EXTRACTIONS = {
    "Jackbit": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 12,
        "terms": ["Jackbit"],
        "cropper": crop_crypto_review,
        "notes": "Restricted-operator review card visible.",
    },
    "Thrill": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 15,
        "terms": ["Thrill"],
        "cropper": crop_crypto_review,
        "notes": "Restricted-operator review card visible.",
    },
    "Bets.io": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 20,
        "terms": ["Bets.io"],
        "cropper": crop_crypto_review,
        "notes": "Restricted-operator review card visible.",
    },
    "Dexsport": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 22,
        "terms": ["Dexsport"],
        "cropper": crop_crypto_review,
        "notes": "Restricted-operator review card visible.",
    },
    "Stake.us": {
        "source_pdf": "SweepsKings Partners PDF",
        "page_number": 12,
        "terms": ["Stake.us"],
        "cropper": crop_partner_banner,
        "notes": "Banner card with logo visible above the next partner section.",
    },
    "WOW Vegas": {
        "source_pdf": "SweepsKings Partners PDF",
        "page_number": 5,
        "terms": ["WOW Vegas"],
        "cropper": crop_partner_banner,
        "notes": "Banner card with logo visible.",
    },
    "Vavada": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 34,
        "terms": ["Vavada"],
        "cropper": crop_crypto_review,
        "notes": "Restricted-operator review card visible.",
    },
    "Crypto-Games.io": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 37,
        "terms": ["Crypto-Games.io"],
        "cropper": crop_crypto_review,
        "notes": "Restricted-operator review card visible.",
    },
    "BC.Game": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 60,
        "terms": ["BC.GAME", "BC.Game"],
        "cropper": crop_crypto_review,
        "notes": "Detailed review card visible.",
    },
    "Pulsz": {
        "source_pdf": "SweepsKings Casino List PDF",
        "page_number": 61,
        "terms": ["Pulsz Casino", "Pulsz"],
        "cropper": crop_sweeps_grid,
        "notes": "Browse-grid card visible; logo area is blank in the PDF capture.",
    },
    "McLuck": {
        "source_pdf": "SweepsKings Partners PDF",
        "page_number": 7,
        "terms": ["McLuck"],
        "cropper": crop_partner_banner,
        "notes": "Banner card with logo visible.",
    },
    "Fortune Coins": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 4,
        "terms": ["Fortune Coins Casino", "Fortune Coins"],
        "cropper": crop_crypto_list_card,
        "notes": "Comparison card visible.",
    },
    "Zula Casino": {
        "source_pdf": "SweepsKings Partners PDF",
        "page_number": 31,
        "terms": ["Zula Casino", "Zula"],
        "cropper": crop_partner_banner,
        "notes": "Banner card with logo visible.",
    },
    "Chanced": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 6,
        "terms": ["Chanced Casino", "Chanced"],
        "cropper": crop_crypto_list_card,
        "notes": "Comparison card visible.",
    },
    "RichSweeps": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 6,
        "terms": ["RichSweeps Casino", "RichSweeps"],
        "cropper": crop_crypto_list_card,
        "notes": "Comparison card visible.",
    },
    "DimeSweeps": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 6,
        "terms": ["DimeSweeps Casino", "DimeSweeps"],
        "cropper": crop_crypto_list_card,
        "notes": "Comparison card visible.",
    },
    "Spree": {
        "source_pdf": "SweepsKings Partners PDF",
        "page_number": 36,
        "terms": ["Spree"],
        "cropper": crop_partner_banner,
        "notes": "Banner card with logo visible.",
    },
    "SpeedSweeps": {
        "source_pdf": "CryptoSlate Crypto Casino PDF",
        "page_number": 7,
        "terms": ["SpeedSweeps Casino", "SpeedSweeps"],
        "cropper": crop_crypto_list_card,
        "notes": "Comparison card visible.",
    },
    "High 5 Casino": {
        "source_pdf": "SweepsKings Partners PDF",
        "page_number": 14,
        "terms": ["High 5 Casino", "High 5"],
        "cropper": crop_partner_banner,
        "notes": "Banner card with logo visible.",
    },
    "FreeSpin": {
        "source_pdf": "SweepsKings Casino List PDF",
        "page_number": 4,
        "terms": ["FreeSpin", "Free Spin Review"],
        "cropper": crop_sweeps_list_feature,
        "notes": "Shortlist card visible.",
    },
    "KingPrize": {
        "source_pdf": "SweepsKings Casino List PDF",
        "page_number": 4,
        "terms": ["KingPrize", "KingPrize Review"],
        "cropper": crop_sweeps_list_feature,
        "notes": "Shortlist card visible.",
    },
    "LoneStar": {
        "source_pdf": "SweepsKings Casino List PDF",
        "page_number": 10,
        "terms": ["LoneStar Review", "LoneStar"],
        "cropper": crop_sweeps_list_feature,
        "notes": "Browse-list card visible with logo.",
    },
    "Captain Jack Casino": {
        "source_pdf": "No Deposit Kings PDF",
        "page_number": 3,
        "terms": ["Captain Jack Casino", "Captain Jack"],
        "cropper": crop_nodeposit,
        "notes": "Bonus card with logo visible.",
    },
    "Slots of Vegas": {
        "source_pdf": "No Deposit Kings PDF",
        "page_number": 3,
        "terms": ["Slots of Vegas Casino", "Slots of Vegas"],
        "cropper": crop_nodeposit,
        "notes": "Bonus card with logo visible.",
    },
    "Brango Casino": {
        "source_pdf": "No Deposit Kings PDF",
        "page_number": 2,
        "terms": ["Casino Brango", "Brango"],
        "cropper": crop_nodeposit,
        "notes": "Bonus card with logo visible.",
    },
    "Casino Extreme": {
        "source_pdf": "No Deposit Kings PDF",
        "page_number": 2,
        "terms": ["Casino Extreme"],
        "cropper": crop_nodeposit,
        "notes": "Bonus card with logo visible.",
    },
    "Yabby Casino": {
        "source_pdf": "No Deposit Kings PDF",
        "page_number": 2,
        "terms": ["Yabby Casino", "Yabby"],
        "cropper": crop_nodeposit,
        "notes": "Bonus card with logo visible.",
    },
}


NOT_FOUND_NOTES = {
    "Prism Casino": "Not visible in the four requested PDFs.",
    "BetFoxx": "Not visible in the four requested PDFs.",
    "Coinbet24": "Not visible in the four requested PDFs.",
}


def save_crop(page: fitz.Page, rect: fitz.Rect, output_path: Path) -> None:
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect, alpha=False)
    pix.save(output_path)


def extract_one(casino_name: str) -> dict[str, str | int]:
    if casino_name not in EXTRACTIONS:
        return {
            "casino_name": casino_name,
            "source_pdf": "",
            "page_number": "",
            "thumbnail_file": "",
            "status": "NOT_FOUND",
            "notes": NOT_FOUND_NOTES.get(
                casino_name,
                "Mention not found or no clean visible logo/card in the requested PDFs.",
            ),
        }

    spec = EXTRACTIONS[casino_name]
    pdf_path = PDFS[spec["source_pdf"]]
    page_number = spec["page_number"]
    cropper = spec["cropper"]
    with fitz.open(pdf_path) as doc:
        page = doc[page_number - 1]
        if cropper is crop_partner_banner:
            rect = cropper(page)
        else:
            rect = cropper(page, spec["terms"])

        if rect is None or rect.width < 40 or rect.height < 25:
            return {
                "casino_name": casino_name,
                "source_pdf": spec["source_pdf"],
                "page_number": page_number,
                "thumbnail_file": "",
                "status": "NOT_FOUND",
                "notes": "Casino mention found, but no reliable visible card region could be cropped.",
            }

        filename = f"{slugify(casino_name)}.png"
        output_path = OUTPUT_DIR / filename
        save_crop(page, rect, output_path)

    return {
        "casino_name": casino_name,
        "source_pdf": spec["source_pdf"],
        "page_number": page_number,
        "thumbnail_file": filename,
        "status": "FOUND",
        "notes": spec["notes"],
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for existing in OUTPUT_DIR.glob("*.png"):
        existing.unlink()
    rows = [extract_one(casino_name) for casino_name in TARGETS]
    df = pd.DataFrame(
        rows,
        columns=[
            "casino_name",
            "source_pdf",
            "page_number",
            "thumbnail_file",
            "status",
            "notes",
        ],
    )
    df.to_excel(REPORT_PATH, index=False)
    found = int((df["status"] == "FOUND").sum())
    not_found = int((df["status"] == "NOT_FOUND").sum())
    print(f"Saved {found} thumbnails to {OUTPUT_DIR}")
    print(f"Marked {not_found} casinos as NOT_FOUND")
    print(f"Saved report to {REPORT_PATH}")


if __name__ == "__main__":
    main()
