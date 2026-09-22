import { describe, expect, it } from "vitest";

import { buildCalendar } from "@/lib/ics";
import { getCourse } from "@/lib/seed";

describe("calendar export", () => {
  it("includes a course code in the file body", () => {
    const course = getCourse("CMSC 220");
    expect(course).toBeDefined();
    const ics = buildCalendar([course!]);
    expect(ics).toContain("CMSC 220");
  });
});
