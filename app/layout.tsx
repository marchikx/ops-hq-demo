import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const siteUrl =
  process.env.GITHUB_PAGES === "true"
    ? "https://marchikx.github.io/ops-hq-demo"
    : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Ops HQ Demo — press a button, watch a money-path failure",
  description:
    "Interactive hire proof: fail a webhook, accept a payment safely, or block an LLM call — real library code in the browser.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Ops HQ Demo",
    description:
      "For hirers: press button 1–3 and read a plain-English result. Sample seed KPIs only.",
    url: siteUrl,
    siteName: "Ops HQ Demo",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ops HQ Demo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ops HQ Demo",
    description: "Press a button. Watch a failure that usually costs money.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
