import type { Metadata } from "next";
import { GalleryBrowser } from "@/components/shine/gallery-browser";
import { galleryCategories, galleryTotals } from "@/lib/gallery-data";
import { siteInfo } from "@/lib/shine-on-data";

export const metadata: Metadata = {
  title: `Gallery | ${siteInfo.name}`,
  description:
    "Browse grouped image collections powering the Shine On Tattoo gallery experience.",
};

export default function GalleryPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Gallery</p>
          <h1>Browse the work archive by collection instead of one endless feed.</h1>
          <p className="page-hero__lead">
            Use the filters to switch between image groups. Each collection is capped for faster loading on mobile while still giving you a solid preview of the overall archive.
          </p>
          <p className="section-note">
            {galleryTotals.images}+ images organized into {galleryTotals.categories} categories.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <GalleryBrowser categories={galleryCategories} />
        </div>
      </section>
    </main>
  );
}
