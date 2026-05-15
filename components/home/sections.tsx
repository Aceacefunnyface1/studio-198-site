import Image from "next/image";
import { SectionHeading } from "@/components/home/section-heading";
import {
  hours,
  menuCategories,
  pickupDetails,
  popularDishes,
  restaurant,
  spotlights,
} from "@/components/home/data";

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar__inner">
        <div className="brand-lockup">
          <div className="brand-lockup__logo">
            <Image src="/logo.png" alt="Hot Wok logo" fill sizes="48px" />
          </div>
          <div className="brand-lockup__copy">
            <p className="brand-lockup__eyebrow">Chinese Restaurant</p>
            <p className="brand-lockup__name">{restaurant.name}</p>
            <p className="brand-lockup__meta">{restaurant.address}</p>
          </div>
        </div>

        <div className="header-actions">
          <a className="phone-link" href={restaurant.phoneHref}>
            {restaurant.phoneDisplay}
          </a>
          <a className="button-primary" href={restaurant.phoneHref}>
            Call to Order
          </a>
        </div>
      </div>
    </header>
  );
}

export function PopularDishesSection() {
  return (
    <section className="section" aria-labelledby="popular-dishes-title">
      <div className="container">
        <SectionHeading
          eyebrow="Popular Dishes"
          title="The dishes people call back for."
          description="Built to feel craveable at a glance: crispy chicken, savory noodles, rich fried rice, and shareable starters that travel well."
        />

        <div className="dish-grid">
          {popularDishes.map((dish, index) => (
            <article className="dish-card" key={dish.name}>
              <div className="dish-card__media">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(min-width: 980px) 33vw, (min-width: 720px) 50vw, 100vw"
                  priority={index < 2}
                />
              </div>
              <div className="dish-card__body">
                <h3 className="dish-card__title">{dish.name}</h3>
                <p className="dish-card__text">{dish.description}</p>
                <p className="dish-card__price">{dish.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MenuCategoriesSection() {
  return (
    <section className="section" aria-labelledby="menu-categories-title">
      <div className="container">
        <SectionHeading
          eyebrow="Menu Preview"
          title="Easy sections for fast ordering."
          description="The menu is organized the way regulars already think about it, so callers can decide quickly and order with confidence."
        />

        <div className="category-grid">
          {menuCategories.map((category) => (
            <article className="category-card" key={category.title}>
              <div className="category-card__media">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(min-width: 980px) 33vw, (min-width: 720px) 50vw, 100vw"
                />
              </div>
              <div className="category-card__body">
                <h3 className="category-card__title">{category.title}</h3>
                <p className="category-card__text">{category.description}</p>
                <span className="category-card__tag">{category.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SpotlightSection() {
  return (
    <section className="section" aria-labelledby="spotlight-title">
      <div className="container">
        <SectionHeading
          eyebrow="Worth Adding"
          title="Two easy add-ons that complete the order."
          description="A couple of dependable favorites give the page more variety and help push appetizer and soup add-ons without clutter."
        />

        <div className="spotlight-grid">
          {spotlights.map((item) => (
            <article className="spotlight-card" key={item.title}>
              <div className="spotlight-card__media">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 720px) 50vw, 100vw"
                />
              </div>
              <div className="spotlight-card__body">
                <h3 className="spotlight-card__title">{item.title}</h3>
                <p className="spotlight-card__text">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HoursSection() {
  return (
    <section className="section" aria-labelledby="hours-title">
      <div className="container">
        <SectionHeading
          eyebrow="Business Hours"
          title="Simple hours customers can scan fast."
          description="Restaurant websites work best when basic details are easy to confirm right before someone decides to call."
        />

        <div className="info-grid">
          <article className="info-card">
            <h3>Open for lunch and dinner</h3>
            <p>
              Hours are set up with realistic local restaurant timing and are
              easy to adjust later if your schedule changes.
            </p>
            <ul>
              {hours.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </article>

          <article className="info-card">
            <h3>Best time to call</h3>
            <p>
              Mid-morning and mid-afternoon are usually the easiest times to
              place advance pickup orders and ask quick menu questions.
            </p>
            <ul>
              <li>
                <strong>Lunch rush:</strong> 11:30 AM to 1:30 PM
              </li>
              <li>
                <strong>Dinner rush:</strong> 5:00 PM to 7:30 PM
              </li>
              <li>
                <strong>Quick orders:</strong> Call ahead for smoother pickup
              </li>
            </ul>
          </article>

          <article className="info-card">
            <h3>Ordering notes</h3>
            <p>
              Let customers know what to expect right away so the ordering
              process feels simple and familiar on mobile.
            </p>
            <ul>
              <li>
                <strong>Phone orders:</strong> Best for the fastest service
              </li>
              <li>
                <strong>Large meals:</strong> Family-style combinations are
                easy to coordinate by phone
              </li>
              <li>
                <strong>Pickup:</strong> Head to the counter when your order is
                ready
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export function DeliverySection() {
  return (
    <section className="section" aria-labelledby="delivery-title">
      <div className="container">
        <SectionHeading
          eyebrow="Pickup and Delivery"
          title="Built for fast weeknight ordering."
          description="The copy here is intentionally practical and local-business friendly, with realistic placeholder details you can keep or fine-tune."
        />

        <div className="info-grid">
          <article className="info-card">
            <h3>Pickup</h3>
            <p>
              Call in, choose your favorites, and swing by for a quick pickup on
              the way home.
            </p>
            <ul>
              {pickupDetails.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>

          <article className="info-card">
            <h3>Delivery area</h3>
            <p>
              Delivery language is kept realistic for a neighborhood restaurant
              and avoids overpromising coverage.
            </p>
            <ul>
              <li>
                <strong>Typical range:</strong> Nearby Lawton neighborhoods
              </li>
              <li>
                <strong>Busy periods:</strong> Delivery timing may be longer on
                Friday and Saturday evenings
              </li>
              <li>
                <strong>Best option:</strong> Call to confirm current delivery
                availability
              </li>
            </ul>
          </article>

          <article className="info-card">
            <h3>Why people keep it simple</h3>
            <p>
              The site is tuned to encourage direct calls instead of making the
              order flow feel complicated or buried behind extra steps.
            </p>
            <ul>
              <li>
                <strong>Main CTA:</strong> Call to Order stays visible
              </li>
              <li>
                <strong>Mobile support:</strong> Sticky call button stays on
                screen
              </li>
              <li>
                <strong>Direction CTA:</strong> Easy for pickup customers
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          eyebrow="Contact and Location"
          title="Easy to find, easy to call, easy to order."
          description="This final section repeats the essentials so customers never have to hunt for the phone number or address."
        />

        <div className="contact-grid">
          <article className="contact-card">
            <h3>Hot Wok</h3>
            <p>
              Chinese takeout and comfort-food favorites for lunch, dinner, and
              last-minute family meals in Lawton.
            </p>
            <ul>
              <li>
                <strong>Phone:</strong>{" "}
                <a href={restaurant.phoneHref}>{restaurant.phoneDisplay}</a>
              </li>
              <li>
                <strong>Address:</strong> {restaurant.address}
              </li>
              <li>
                <strong>Ordering:</strong> Phone orders recommended for the
                fastest service
              </li>
            </ul>
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
          </article>

          <article className="map-card">
            <div className="map-card__pattern" aria-hidden="true" />
            <div className="map-card__content">
              <p className="map-card__eyebrow">Pickup friendly location</p>
              <h3>Right on SW Lee Blvd</h3>
              <p>
                Give customers confidence with a clear location section that
                feels polished even before embedding a full map.
              </p>
              <div className="hero__actions">
                <a
                  className="button-secondary"
                  href={restaurant.directionsHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-card">
          <div className="footer-card__brand">
            <div className="footer-card__logo-row">
              <div className="footer-card__logo">
                <Image src="/logo.png" alt="Hot Wok logo" fill sizes="52px" />
              </div>
              <div>
                <p className="footer-card__name">{restaurant.name}</p>
                <p className="footer-card__small">Chinese takeout in Lawton</p>
              </div>
            </div>
            <p>
              Food-first, direct-call website designed for quick orders, local
              trust, and an appetizing first impression.
            </p>
          </div>

          <div className="footer-card__links">
            <h3>Visit</h3>
            <ul>
              <li>{restaurant.address}</li>
              <li>
                <a href={restaurant.directionsHref} target="_blank" rel="noreferrer">
                  Get Directions
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-card__links">
            <h3>Order</h3>
            <ul>
              <li>
                <a href={restaurant.phoneHref}>{restaurant.phoneDisplay}</a>
              </li>
              <li>Call ahead for pickup and delivery details</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function StickyCallBar() {
  return (
    <div className="sticky-call">
      <a href={restaurant.phoneHref} aria-label={`Call ${restaurant.name}`}>
        Call Hot Wok: {restaurant.phoneDisplay}
      </a>
    </div>
  );
}
