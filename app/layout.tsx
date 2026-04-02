import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Cinzel_Decorative, Lato } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moviesbybrad.com"),
  title: "Snap Critique - No Hype. No Mercy.",
  description:
    "Short-form reviews. Instant verdicts. No fake praise. If it hits, it earns it. If it doesn't, it gets buried.",
  applicationName: "Snap Critique",
  keywords: [
    "Snap Critique",
    "Studio 198",
    "movie reviews",
    "film criticism",
    "The Batman review",
    "Terrifier 3 review",
  ],
  openGraph: {
    title: "Snap Critique - No Hype. No Mercy.",
    description: "Short-form reviews. Instant verdicts. No fake praise.",
    url: "https://www.moviesbybrad.com",
    siteName: "Snap Critique",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Critique - No Hype. No Mercy.",
    description: "Short-form reviews. Instant verdicts. No fake praise.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  verification: {
    google: "DiAhR40RSmomb0K3RUxbwf9aKoYAP3Gzjz6VQpfBI-U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzelDecorative.variable} ${lato.variable} bg-black`}
    >
      <body>
        <div className="site-frame">
          <div className="ambient ambient-left" />
          <div className="ambient ambient-right" />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
