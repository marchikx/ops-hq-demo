"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/deliveries", label: "Deliveries" },
  { href: "/payments", label: "Payments" },
  { href: "/llm-budget", label: "LLM budget" },
];

export function NavLinks({ basePath = "" }: { basePath?: string }) {
  const pathname = usePathname() || "/";
  const normalized = pathname.replace(/\/$/, "") || "/";

  return (
    <nav className="flex flex-wrap gap-1 text-sm">
      {nav.map((item) => {
        const href = `${basePath}${item.href === "/" ? "/" : item.href}`;
        const active =
          item.href === "/"
            ? normalized === `${basePath}` || normalized === `${basePath}/` || normalized.endsWith("/ops-hq-demo")
            : normalized.endsWith(item.href) || normalized.endsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={href}
            className={
              active
                ? "px-3 py-1.5 rounded-md bg-accent/15 text-accent"
                : "px-3 py-1.5 rounded-md text-muted hover:text-[var(--color-text)] hover:bg-panel transition-colors"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
