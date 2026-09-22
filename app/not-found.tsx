import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Course not found</h1>
      <p className="text-muted-foreground">That code is not in the catalog seed.</p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Back to the catalog
      </Link>
    </div>
  );
}
