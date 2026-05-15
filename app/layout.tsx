import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/shine/site-footer";
import { SiteHeader } from "@/components/shine/site-header";
import { siteInfo } from "@/lib/shine-on-data";
import "./globals.css";

const metadataBase = (() => {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    "http://localhost:3000";

  return new URL(base.startsWith("http") ? base : `https://${base}`);
})();

export const metadata: Metadata = {
  metadataBase,
  title: siteInfo.title,
  description: siteInfo.description,
  applicationName: siteInfo.name,
  keywords: [...siteInfo.keywords],
  openGraph: {
    title: siteInfo.title,
    description: siteInfo.description,
    type: "website",
    locale: "en_US",
    siteName: siteInfo.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteInfo.title,
    description: siteInfo.description,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: siteInfo.name,
    image: `${metadataBase}/opengraph-image`,
    telephone: siteInfo.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteInfo.addressLine1,
      addressLocality: "Lawton",
      addressRegion: "OK",
      postalCode: "73505",
      addressCountry: "US",
    },
    areaServed: "Lawton, Oklahoma",
    paymentAccepted: "Cash",
    openingHours: ["Mo-Su 06:00-21:00"],
    url: metadataBase.toString(),
  };

  return (
    <html lang="en">
      <body id="top">
        <SiteHeader />
        {children}
        <SiteFooter />
        <div className="mobile-cta">
          <a href={siteInfo.phoneHref} className="button button--primary">
            Call {siteInfo.phoneDisplay}
          </a>
          <a href={siteInfo.smsHref} className="button button--secondary">
            Text Now
          </a>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
