import Image from "next/image";
import Link from "next/link";
import { getHomepageShelfBundle } from "@/lib/review-queries";

const ROB_ZOMBIE_FALLBACK_HREF = "/reviews?search=Rob%20Zombie#browse-all";
const TARANTINO_FALLBACK_HREF = "/reviews?search=Quentin%20Tarantino#browse-all";

export default async function HomePage() {
  const homepageShelves = await getHomepageShelfBundle();
  const robZombieHref =
    homepageShelves.robZombieCollection?.viewAllHref ?? ROB_ZOMBIE_FALLBACK_HREF;
  const tarantinoHref =
    homepageShelves.quentinTarantinoCollection?.viewAllHref ??
    TARANTINO_FALLBACK_HREF;

  return (
    <section className="vault-home" aria-labelledby="vault-hero-title">
      <div className="vault-hero">
        <h1 id="vault-hero-title" className="sr-only">
          Studio 198 collection vault hero
        </h1>

        <div className="vault-hero__panel">
          <div className="vault-hero__top-bar" aria-hidden="true" />

          <div className="vault-hero__media">
            <Image
              src="/home-hero/hero-placeholder.png"
              alt="Hero placeholder art. Replace public/home-hero/hero-placeholder.png to swap this image."
              fill
              priority
              sizes="(max-width: 900px) 92vw, 860px"
            />
          </div>

          <div className="vault-hero__buttons" aria-label="Collection vault links">
            <Link href={robZombieHref} className="vault-hero__button">
              <Image
                src="/home-hero/rob-zombie-button.png"
                alt=""
                fill
                sizes="(max-width: 900px) 92vw, 420px"
              />
              <span>Enter the Rob Zombie Vault</span>
            </Link>

            <Link href={tarantinoHref} className="vault-hero__button">
              <Image
                src="/home-hero/tarantino-button.png"
                alt=""
                fill
                sizes="(max-width: 900px) 92vw, 420px"
              />
              <span>Enter the Tarantino Vault</span>
            </Link>
          </div>

          <div className="vault-hero__fire" aria-hidden="true">
            <Image
              src="/home-hero/fire-strip.png"
              alt=""
              fill
              sizes="(max-width: 1100px) 100vw, 980px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
