import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";

export function Shell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.06),_transparent_45%)]"
      />
      <header className="relative border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold tracking-tight text-accent">
            Ops HQ Demo
          </Link>
          <NavLinks />
        </div>
      </header>
      <main className="relative flex-1 mx-auto w-full max-w-5xl px-4 py-8 animate-fade-in">
        {title ? (
          <h1 className="text-2xl font-semibold mb-6 tracking-tight">{title}</h1>
        ) : null}
        {children}
      </main>
      <footer className="relative border-t border-border py-4 text-center text-xs text-muted">
        Portfolio demo · seed + live lib wiring · no production secrets
      </footer>
    </div>
  );
}
