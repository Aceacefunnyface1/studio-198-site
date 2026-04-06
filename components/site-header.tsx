import Image from "next/image";
import Link from "next/link";
import { POSTER_MATCH_ROUTE } from "@/lib/poster-match";

const navItems = [
  { href: "/", label: "Home" },
  { href: POSTER_MATCH_ROUTE, label: "Poster Match" },
  { href: "/reviews", label: "Reviews" },
  { href: "/early-horror", label: "The Bloody Birth of Horror" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Studio 198 home">
          <div className="brand-mark" aria-hidden="true">
            <Image
              src="/brand/studio-198-logo.png"
              alt=""
              width={220}
              height={224}
              className="brand-logo"
              priority
            />
          </div>
          <div className="brand-text">
            <p>Studio 198</p>
            <span>Snap Critique</span>
          </div>
        </Link>

        <div className="site-header__utility">
          <form action="/reviews" method="get" className="header-search" role="search">
            <label htmlFor="header-search" className="sr-only">
              Search reviews
            </label>
            <input
              id="header-search"
              name="search"
              type="search"
              placeholder="Search titles"
            />
            <button type="submit">Search</button>
          </form>

          <nav className="header-nav" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
