import { describe, expect, it } from "vitest";

import { PAGE_SIZE, pageCount, paginate } from "@/lib/pagination";
import { getCourses } from "@/lib/seed";

const courses = getCourses();

describe("catalog pagination", () => {
  it("returns a page of courses", () => {
    const page = paginate(courses, 1);
    expect(Array.isArray(page)).toBe(true);
  });

  it("returns exactly PAGE_SIZE courses on full pages", () => {
    const page1 = paginate(courses, 1);
    expect(page1).toHaveLength(PAGE_SIZE);
  });

  it("calculates correct page count for 42 courses with page size 10", () => {
    expect(courses).toHaveLength(42);
    expect(pageCount(courses.length)).toBe(5);
  });

  it("returns the remaining 2 courses on page 5, including CMSC 250", () => {
    const page5 = paginate(courses, 5);
    expect(page5).toHaveLength(2);
    expect(page5.some((course) => course.code === "CMSC 250")).toBe(true);
  });

  it("reaches all 42 courses across all 5 pages without skipping items", () => {
    const totalPages = pageCount(courses.length);
    const collected = [];
    for (let p = 1; p <= totalPages; p++) {
      collected.push(...paginate(courses, p));
    }
    expect(collected).toHaveLength(courses.length);
    expect(collected.map((c) => c.code)).toEqual(courses.map((c) => c.code));
  });
});
