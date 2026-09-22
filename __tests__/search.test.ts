import { describe, expect, it } from "vitest";

import { getCourses } from "@/lib/seed";
import { searchCourses } from "@/lib/search";

const courses = getCourses();

describe("keyword search", () => {
  it("filters courses by keyword", () => {
    const results = searchCourses(courses, "algebra");
    expect(results.some((course) => course.code === "MATH 240")).toBe(true);
  });

  it("finds CMSC 220 when searching for C++", () => {
    const results = searchCourses(courses, "C++");
    expect(results.some((course) => course.code === "CMSC 220")).toBe(true);
  });

  it("returns the full catalog for a blank query", () => {
    expect(searchCourses(courses, "   ")).toHaveLength(courses.length);
  });
});
