import { Catalog } from "@/components/catalog";
import { getCourses, getReviews } from "@/lib/seed";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          University catalog
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Find a course</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Search the catalog, read student reviews, and pin sections onto a weekly schedule.
        </p>
      </div>
      <Catalog courses={getCourses()} reviews={getReviews()} />
    </div>
  );
}
