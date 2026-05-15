from __future__ import annotations

import re
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

import pandas as pd
from playwright.sync_api import Page, TimeoutError as PlaywrightTimeoutError, sync_playwright


SITES = [
    ("Jackbit", "https://jackbit.com"),
    ("Thrill", "https://thrill.com"),
    ("Bets.io", "https://www.bets.io"),
    ("Dexsport", "https://dexsport.io"),
    ("Stake.us", "https://stake.us"),
    ("WOW Vegas", "https://www.wowvegas.com"),
    ("Vavada", "https://vavada.com"),
    ("Crypto-Games.io", "https://crypto-games.io"),
    ("BC.Game", "https://bc.game"),
    ("Pulsz", "https://www.pulsz.com"),
    ("McLuck", "https://www.mcluck.com"),
    ("Fortune Coins", "https://www.fortunecoins.com"),
    ("Zula Casino", "https://www.zulacasino.com"),
    ("Chanced", "https://chanced.com"),
    ("RichSweeps", "https://www.richsweeps.com"),
    ("DimeSweeps", "https://www.dimesweeps.com"),
    ("Spree", "https://spree.com"),
    ("SpeedSweeps", "https://www.speedsweeps.com"),
    ("High 5 Casino", "https://www.high5casino.com"),
    ("FreeSpin", "https://www.freespin.com"),
    ("KingPrize", "https://www.kingprize.com"),
    ("LoneStar", "https://www.lonestarcasino.com"),
    ("Captain Jack Casino", "https://www.captainjackcasino.com"),
    ("Slots of Vegas", "https://www.slotsofvegas.com"),
    ("Prism Casino", "https://www.prismcasino.com"),
    ("BetFoxx", "https://www.betfoxx.com"),
    ("Coinbet24", "https://coinbet24.com"),
    ("Brango Casino", "https://www.casinobrango.com"),
    ("Casino Extreme", "https://www.casinoextreme.com"),
    ("Yabby Casino", "https://www.yabbycasino.com"),
]

OUTPUT_DIR = Path(__file__).resolve().parent
THUMBNAILS_DIR = OUTPUT_DIR / "thumbnails"
REPORT_PATH = OUTPUT_DIR / "casino_thumbnails_report.xlsx"
VIEWPORT = {"width": 1200, "height": 675}
NAVIGATION_TIMEOUT_MS = 30_000
POST_LOAD_WAIT_MS = 2_000
ALLOWED_HOME_PATHS = {"", "/", "/en", "/en-us", "/home", "/homepage", "/casino"}
BLOCK_PATTERNS = [
    re.compile(pattern, re.I)
    for pattern in [
        r"access denied",
        r"forbidden",
        r"error 10\d",
        r"cloudflare",
        r"checking your browser",
        r"verify you are human",
        r"attention required",
        r"restricted",
        r"not available in your region",
        r"not available in your jurisdiction",
        r"not available in your location",
        r"geo.?block",
        r"location blocked",
        r"gambling restriction",
        r"cannot be accessed from your country",
        r"service unavailable in your area",
        r"blocked",
    ]
]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "site"


def normalize_url(url: str) -> str:
    parsed = urlsplit(url)
    path = parsed.path.rstrip("/")
    return f"{parsed.scheme.lower()}://{parsed.netloc.lower()}{path}"


def canonical_hostname(url: str) -> str:
    hostname = urlsplit(url).netloc.lower()
    if hostname.startswith("www."):
        hostname = hostname[4:]
    return hostname


def normalized_home_path(url: str) -> str:
    path = urlsplit(url).path.strip().lower()
    if not path:
        return "/"
    path = re.sub(r"/+", "/", path).rstrip("/")
    return path or "/"


def is_allowed_homepage_redirect(start_url: str, final_url: str) -> bool:
    if canonical_hostname(start_url) != canonical_hostname(final_url):
        return False

    final_path = normalized_home_path(final_url)
    return final_path in ALLOWED_HOME_PATHS


def was_redirected(request: Any) -> bool:
    current = request
    while current is not None:
        if current.redirected_from is not None:
            return True
        current = current.redirected_from
    return False


def dismiss_common_overlays(page: Page) -> None:
    labels = [
        "accept",
        "accept all",
        "agree",
        "allow all",
        "continue",
        "enter",
        "enter site",
        "i am 18",
        "i'm 18",
        "yes",
    ]
    for label in labels:
        locator = page.get_by_role("button", name=re.compile(rf"^{re.escape(label)}$", re.I))
        try:
            if locator.count() > 0:
                locator.first.click(timeout=1_500)
                page.wait_for_timeout(500)
                return
        except Exception:
            continue


def wait_for_page_settle(page: Page) -> None:
    try:
        page.wait_for_load_state("networkidle", timeout=10_000)
    except PlaywrightTimeoutError:
        # Some sites keep long-lived network connections open; a screenshot can still be usable.
        pass
    page.wait_for_timeout(POST_LOAD_WAIT_MS)


def detect_failure_reason(page: Page, response: Any, final_url: str) -> str | None:
    if response is not None and response.status >= 400:
        return f"HTTP {response.status}"

    title = ""
    try:
        title = page.title().strip()
    except Exception:
        pass

    body_text = ""
    try:
        body_text = page.locator("body").inner_text(timeout=5_000).strip()
    except Exception:
        pass

    combined = f"{final_url}\n{title}\n{body_text[:4000]}"
    for pattern in BLOCK_PATTERNS:
        if pattern.search(combined):
            return f"Blocked page detected: {pattern.pattern}"

    if title and re.search(r"\b(error|denied|forbidden|blocked)\b", title, re.I):
        return f"Error page title: {title}"

    if len(body_text) < 30:
        return "Blank or near-empty page"

    return None


def capture_site(page: Page, name: str, url: str) -> dict[str, str]:
    slug = slugify(name)
    screenshot_name = f"{slug}.png"
    screenshot_path = THUMBNAILS_DIR / screenshot_name

    result = {
        "name": name,
        "url": url,
        "thumbnail_file": "",
        "status": "FAILED",
        "error": "",
    }

    try:
        response = page.goto(url, wait_until="domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
        wait_for_page_settle(page)
        dismiss_common_overlays(page)

        final_url = page.url
        redirected = response is not None and was_redirected(response.request)

        if redirected and not is_allowed_homepage_redirect(url, final_url):
            raise RuntimeError(f"Redirected to different domain or disallowed path: {final_url}")

        if not redirected and not is_allowed_homepage_redirect(url, final_url):
            normalized_input = normalize_url(url)
            normalized_final = normalize_url(final_url)
            if normalized_input != normalized_final:
                raise RuntimeError(f"Unexpected final URL: {final_url}")

        failure_reason = detect_failure_reason(page, response, final_url)
        if failure_reason:
            raise RuntimeError(failure_reason)

        page.screenshot(path=str(screenshot_path), full_page=False)
        result["thumbnail_file"] = screenshot_name
        result["status"] = "SUCCESS"
        return result
    except PlaywrightTimeoutError as exc:
        result["error"] = f"Timeout: {exc}"
    except Exception as exc:
        result["error"] = str(exc)
    finally:
        try:
            page.goto("about:blank", wait_until="load", timeout=5_000)
        except Exception:
            pass

    if screenshot_path.exists():
        screenshot_path.unlink(missing_ok=True)

    return result


def write_report(rows: list[dict[str, str]]) -> None:
    frame = pd.DataFrame(rows, columns=["name", "url", "thumbnail_file", "status", "error"])
    frame.to_excel(REPORT_PATH, index=False)


def main() -> None:
    THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)
    rows: list[dict[str, str]] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(
            viewport=VIEWPORT,
            screen=VIEWPORT,
            device_scale_factor=1,
            ignore_https_errors=True,
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        page = context.new_page()
        page.set_default_navigation_timeout(NAVIGATION_TIMEOUT_MS)
        page.set_default_timeout(15_000)

        for name, url in SITES:
            row = capture_site(page, name, url)
            rows.append(row)
            print(f"{row['status']}: {name} -> {row['error'] or row['thumbnail_file']}")

        context.close()
        browser.close()

    write_report(rows)
    print(f"\nSaved report: {REPORT_PATH}")
    print(f"Saved thumbnails in: {THUMBNAILS_DIR}")


if __name__ == "__main__":
    main()
