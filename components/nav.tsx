import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          CourseRadar
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Catalog
          </Link>
          <Link href="/schedule" className="text-muted-foreground hover:text-foreground">
            Schedule
          </Link>
        </nav>
      </div>
    </header>
  );
}
