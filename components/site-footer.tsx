import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Snap Critique by Studio 198</strong>
          <p>Dark, verdict-first reviews built for the web.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/reviews">Archive</Link>
          <Link href="/about">Mission</Link>
          <Link href="/contact">Contact</Link>
          <a href="#" aria-disabled="true">
            Instagram
          </a>
          <a href="#" aria-disabled="true">
            YouTube
          </a>
        </nav>
      </div>
    </footer>
  );
}
