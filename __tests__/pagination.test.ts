import { describe, expect, it } from "vitest";

import { paginate } from "@/lib/pagination";
import { getCourses } from "@/lib/seed";

describe("catalog pagination", () => {
  it("returns a page of courses", () => {
    const page = paginate(getCourses(), 1);
    expect(Array.isArray(page)).toBe(true);
  });
});
