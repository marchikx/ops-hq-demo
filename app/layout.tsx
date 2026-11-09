import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const siteUrl =
  process.env.GITHUB_PAGES === "true"
    ? "https://marchikx.github.io/ops-hq-demo"
    : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Ops HQ Demo — webhook · payments · LLM gates",
  description:
    "Interactive ops console: webhook-relay DLQ, Stripe 202→worker ledger, llm-guardrails deny paths — real library imports.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Ops HQ Demo",
    description:
      "Run a 60s incident: outbox→retry→DLQ, payment 202→work, LLM budget deny.",
    url: siteUrl,
    siteName: "Ops HQ Demo",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ops HQ Demo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ops HQ Demo",
    description: "Interactive portfolio proof for webhook, payment, LLM failure paths.",
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
