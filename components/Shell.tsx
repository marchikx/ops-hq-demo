import Link from "next/link";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/deliveries", label: "Deliveries" },
  { href: "/payments", label: "Payments" },
  { href: "/llm-budget", label: "LLM budget" },
];

export function Shell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold tracking-tight text-accent">
            Ops HQ Demo
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-md text-muted hover:text-[var(--color-text)] hover:bg-panel transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 animate-fade-in">
        {title ? (
          <h1 className="text-2xl font-semibold mb-6 tracking-tight">{title}</h1>
        ) : null}
        {children}
      </main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted">
        Portfolio demo · seed data only · no production secrets
      </footer>
    </div>
  );
}
