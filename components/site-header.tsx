import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Snap Critique home">
          <div className="brand-mark" aria-hidden="true">
            198
          </div>
          <div className="brand-text">
            <p>Studio 198</p>
            <span>Snap Critique</span>
          </div>
        </Link>

        <nav className="header-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
