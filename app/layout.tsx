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
  title: {
    default: "Snap Critique by Studio 198",
    template: "%s | Snap Critique",
  },
  description:
    "Dark, verdict-first movie reviews from Studio 198. Poster-driven criticism with sharp quick hits, full takes, and where-to-watch links.",
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
    title: "Snap Critique by Studio 198",
    description:
      "Not Meant to Feel Safe. A cinematic movie review platform built by Studio 198.",
    siteName: "Snap Critique",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Critique by Studio 198",
    description:
      "Verdict-driven movie reviews with a dark cinematic Studio 198 identity.",
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
      </body>
    </html>
  );
}
