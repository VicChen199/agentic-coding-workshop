"use client";

import { useEffect, useMemo, useState } from "react";

import { CatalogFilters } from "@/components/catalog-filters";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultCourseFilters, filterCourses, type CourseFilters } from "@/lib/filters";
import { PAGE_SIZE, pageCount, paginate } from "@/lib/pagination";
import { readSchedule } from "@/lib/schedule";
import { searchCourses } from "@/lib/search";
import type { Course, Review } from "@/lib/types";

type CatalogProps = {
  courses: Course[];
  reviews: Review[];
};

export function Catalog({ courses, reviews }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<CourseFilters>(defaultCourseFilters);
  const [page, setPage] = useState(1);
  const [pinnedCodes, setPinnedCodes] = useState<string[]>([]);

  useEffect(() => {
    setPinnedCodes(readSchedule());
  }, []);

  const filtered = filterCourses(
    searchCourses(courses, query),
    reviews,
    filters,
    pinnedCodes,
  );
  const totalPages = Math.max(pageCount(filtered.length), 1);
  const visible = paginate(filtered, page);

  const rangeLabel = useMemo(() => {
    if (filtered.length === 0) {
      return "0 courses";
    }
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = start + visible.length - 1;
    return `${start}–${end} of ${filtered.length} courses`;
  }, [filtered.length, page, visible.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search by course code or title"
          aria-label="Search courses"
        />
        <CatalogFilters
          courses={courses}
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>{rangeLabel}</p>
        <p>
          Page {page} of {totalPages}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No courses match.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((course) => (
            <CourseCard key={course.code} course={course} reviews={reviews} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
