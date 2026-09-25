import { describe, expect, it } from "vitest";

import { missingPrerequisites } from "@/lib/prerequisites";
import { getCourses } from "@/lib/seed";

describe("missingPrerequisites", () => {
  it("returns codes that are not on the schedule", () => {
    expect(missingPrerequisites(["CMSC 216", "CMSC 250"], ["CMSC 216"])).toEqual([
      "CMSC 250",
    ]);
  });

  it("returns an empty list when every prerequisite is scheduled", () => {
    expect(missingPrerequisites(["CMSC 131"], ["CMSC 131", "CMSC 132"])).toEqual([]);
  });

  it("returns an empty list when the course has no prerequisites", () => {
    expect(missingPrerequisites([], ["CMSC 131"])).toEqual([]);
  });
});

describe("seed prerequisites", () => {
  it("points only at other courses in the catalog", () => {
    const courses = getCourses();
    const codes = new Set(courses.map((course) => course.code));

    for (const course of courses) {
      for (const prereq of course.prerequisites) {
        expect(codes.has(prereq)).toBe(true);
        expect(prereq).not.toBe(course.code);
      }
    }
  });
});
