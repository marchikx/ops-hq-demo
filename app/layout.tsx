import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ops HQ Demo",
  description:
    "Dark-mode ops dashboard demonstrating webhook outbox, payment ledger, and LLM budget patterns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
