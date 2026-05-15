import Image from "next/image";
import { restaurant } from "@/components/home/data";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__panel">
        <div className="hero__content">
          <div className="brand-lockup">
            <div className="brand-lockup__logo">
              <Image
                src="/logo.png"
                alt="Hot Wok logo"
                fill
                sizes="48px"
                priority
              />
            </div>
            <div className="brand-lockup__copy">
              <p className="brand-lockup__eyebrow">Lawton Chinese Takeout</p>
              <p className="brand-lockup__name">{restaurant.name}</p>
            </div>
          </div>

          <p className="hero__badge">Fresh wok-fired favorites</p>
          <h1 id="hero-title">Comfort food with heat, crunch, and big flavor.</h1>
          <p className="hero__lede">
            Hot Wok serves classic Chinese takeout dishes with a warm, local
            feel. Order your family favorites, call ahead for pickup, and make
            tonight&apos;s dinner easy.
          </p>

          <div className="hero__facts">
            <div className="hero__fact-card">
              <span className="hero__fact-label">Address</span>
              <p className="hero__fact-value">{restaurant.address}</p>
            </div>
            <div className="hero__fact-card">
              <span className="hero__fact-label">Call</span>
              <p className="hero__fact-value">{restaurant.phoneDisplay}</p>
            </div>
          </div>

          <div className="hero__actions">
            <a className="button-primary" href={restaurant.phoneHref}>
              Call to Order
            </a>
            <a
              className="button-secondary"
              href={restaurant.directionsHref}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="hero__image-wrap">
          <Image
            className="hero__image"
            src="/hero-wok.png"
            alt="A Hot Wok signature dish served fresh from the wok"
            fill
            priority
            sizes="(min-width: 980px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
