import { describe, expect, it } from "vitest";

import { getCourses, getReviews } from "@/lib/seed";
import { averageRatingByDepartment } from "@/lib/stats";

describe("department stats", () => {
  it("uses only that department’s courses for an average", () => {
    const courses = getCourses();
    const reviews = getReviews();
    const mathOnly = courses.filter((course) => course.department === "MATH");
    const mixed = [
      ...mathOnly,
      ...courses.filter((course) => course.department === "CMSC").slice(0, 3),
    ];

    const fromMathSeed = averageRatingByDepartment(mathOnly, reviews, "MATH");
    const fromMixedSeed = averageRatingByDepartment(mixed, reviews, "MATH");

    expect(fromMathSeed).not.toBeNull();
    expect(fromMathSeed).toBe(fromMixedSeed);
  });
});
