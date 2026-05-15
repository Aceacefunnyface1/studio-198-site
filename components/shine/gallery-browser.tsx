"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryCategory } from "@/lib/gallery-data";

type GalleryBrowserProps = {
  categories: GalleryCategory[];
};

const initialVisibleCount = 6;

export function GalleryBrowser({ categories }: GalleryBrowserProps) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const activeCategory =
    categories.find((category) => category.slug === activeSlug) ?? categories[0];

  if (!activeCategory) {
    return null;
  }

  const visibleImages = activeCategory.images.slice(0, visibleCount);
  const canShowMore = visibleCount < activeCategory.images.length;

  return (
    <section className="gallery-browser">
      <div className="gallery-browser__tabs" role="tablist" aria-label="Gallery filters">
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            className={category.slug === activeCategory.slug ? "filter-chip is-active" : "filter-chip"}
            onClick={() => {
              setActiveSlug(category.slug);
              setVisibleCount(initialVisibleCount);
            }}
          >
            <span>{category.name}</span>
            <small>{category.totalCount}</small>
          </button>
        ))}
      </div>

      <div className="gallery-browser__meta">
        <div>
          <p className="section-label">Selected Collection</p>
          <h2>{activeCategory.name}</h2>
        </div>
        <p>
          Showing {visibleImages.length} of {activeCategory.totalCount} images in this collection.
        </p>
      </div>

      <div className="gallery-grid">
        {visibleImages.map((image, index) => (
          <article key={image.src} className="gallery-card">
            <div className="gallery-card__image">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 720px) 50vw, (max-width: 1100px) 33vw, 20vw"
              />
            </div>
            <div className="gallery-card__caption">
              <span>{activeCategory.name}</span>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
            </div>
          </article>
        ))}
      </div>

      {canShowMore ? (
        <button
          type="button"
          className="button button--primary gallery-browser__more"
          onClick={() => setVisibleCount((count) => Math.min(count + 6, activeCategory.images.length))}
        >
          Show More
        </button>
      ) : null}
    </section>
  );
}
