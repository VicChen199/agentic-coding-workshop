import { describe, expect, it } from "vitest";

import { PAGE_SIZE, pageCount, paginate } from "@/lib/pagination";
import { getCourses } from "@/lib/seed";

describe("catalog pagination", () => {
  it("returns a page of courses", () => {
    const page = paginate(getCourses(), 1);
    expect(Array.isArray(page)).toBe(true);
  });

  it("puts the leftover courses on page 5 when there are 42 items", () => {
    const courses = getCourses();
    expect(PAGE_SIZE).toBe(10);
    expect(courses).toHaveLength(42);
    expect(paginate(courses, 5)).toHaveLength(2);
    expect(pageCount(42)).toBe(5);
    expect(paginate(courses, 5).some((course) => course.code === "CMSC 250")).toBe(true);
  });
});
