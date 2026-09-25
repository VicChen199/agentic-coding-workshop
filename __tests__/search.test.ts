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

  it("finds courses when searching with lowercase letters", () => {
    const results = searchCourses(courses, "computer systems");
    expect(
      results.some(
        (course) =>
          course.code === "CMSC 216" && course.title === "Computer Systems",
      ),
    ).toBe(true);
  });

  it("returns all courses when query is empty or whitespace", () => {
    expect(searchCourses(courses, "")).toHaveLength(courses.length);
    expect(searchCourses(courses, "   ")).toHaveLength(courses.length);
  });

  it("handles special regex characters safely without throwing", () => {
    expect(() => searchCourses(courses, "(")).not.toThrow();
    expect(() => searchCourses(courses, "[")).not.toThrow();
    expect(() => searchCourses(courses, "*")).not.toThrow();
    expect(() => searchCourses(courses, "+")).not.toThrow();
    expect(() => searchCourses(courses, "C++")).not.toThrow();
  });

  it("finds courses by matching words in the description", () => {
    const results = searchCourses(courses, "templates");
    expect(results.some((course) => course.code === "CMSC 220")).toBe(true);
  });

  it("supports multi-token queries across code and title", () => {
    const results = searchCourses(courses, "cmsc c++");
    expect(results.some((course) => course.code === "CMSC 220")).toBe(true);
  });

  it("handles queries with extra whitespace between tokens", () => {
    const results = searchCourses(courses, "   programming    c++   ");
    expect(results.some((course) => course.code === "CMSC 220")).toBe(true);
  });
});
