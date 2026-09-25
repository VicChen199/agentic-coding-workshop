import { describe, expect, it } from "vitest";

import {
  courseLevel,
  coursesOverlap,
  defaultCourseFilters,
  filterCourses,
  timeOfDay,
  workloadBand,
  type CourseFilters,
} from "@/lib/filters";
import { getCourses } from "@/lib/seed";
import { searchCourses } from "@/lib/search";
import type { Course, Review } from "@/lib/types";

function course(overrides: Partial<Course> & Pick<Course, "code">): Course {
  return {
    title: "Title",
    department: "CMSC",
    credits: 3,
    instructor: "Ada Lovelace",
    description: "Desc",
    meetingDays: ["Mon", "Wed"],
    startTime: "09:00",
    endTime: "10:15",
    startDate: "2026-01-20",
    ...overrides,
  };
}

function review(
  courseCode: string,
  rating: number,
  workloadHours: number,
): Review {
  return {
    id: `${courseCode}-${rating}-${workloadHours}`,
    courseCode,
    rating,
    workloadHours,
    comment: "",
    author: "Sam",
    createdAt: "2026-01-01",
  };
}

function filters(overrides: Partial<CourseFilters> = {}): CourseFilters {
  return { ...defaultCourseFilters, ...overrides };
}

const cmsc220 = course({
  code: "CMSC 220",
  title: "Programming in C++",
  credits: 4,
  meetingDays: ["Tue", "Thu"],
  startTime: "10:00",
  endTime: "11:15",
});
const math140 = course({
  code: "MATH 140",
  department: "MATH",
  credits: 4,
  meetingDays: ["Mon", "Wed", "Fri"],
  startTime: "12:00",
  endTime: "12:50",
});
const engl101 = course({
  code: "ENGL 101",
  department: "ENGL",
  credits: 3,
  meetingDays: ["Mon", "Wed"],
  startTime: "15:00",
  endTime: "16:15",
});
const phys404 = course({
  code: "PHYS 404",
  department: "PHYS",
  credits: 3,
  meetingDays: ["Tue", "Thu"],
  startTime: "14:59",
  endTime: "16:15",
});

const catalog = [cmsc220, math140, engl101, phys404];

describe("filter helpers", () => {
  it("reads the course level from the hundreds digit", () => {
    expect(courseLevel(course({ code: "HIST 110" }))).toBe(100);
    expect(courseLevel(cmsc220)).toBe(200);
    expect(courseLevel(course({ code: "PSYC 300" }))).toBe(300);
    expect(courseLevel(phys404)).toBe(400);
    expect(courseLevel(course({ code: "SEMINAR" }))).toBeNull();
  });

  it("buckets start time into morning, midday, and afternoon", () => {
    expect(timeOfDay(course({ code: "A", startTime: "11:59" }))).toBe("morning");
    expect(timeOfDay(course({ code: "B", startTime: "12:00" }))).toBe("midday");
    expect(timeOfDay(phys404)).toBe("midday");
    expect(timeOfDay(engl101)).toBe("afternoon");
  });

  it("buckets average workload at 6 and 9 hours", () => {
    expect(workloadBand([])).toBeNull();
    expect(workloadBand([review("A", 3, 5.9)])).toBe("light");
    expect(workloadBand([review("A", 3, 6)])).toBe("medium");
    expect(workloadBand([review("A", 3, 8.9)])).toBe("medium");
    expect(workloadBand([review("A", 3, 9)])).toBe("heavy");
  });

  it("treats overlapping intervals as conflicts and touching endpoints as clear", () => {
    const first = course({
      code: "A",
      meetingDays: ["Mon"],
      startTime: "10:00",
      endTime: "11:00",
    });
    const overlap = course({
      code: "B",
      meetingDays: ["Mon"],
      startTime: "10:30",
      endTime: "11:30",
    });
    const backToBack = course({
      code: "C",
      meetingDays: ["Mon"],
      startTime: "11:00",
      endTime: "12:00",
    });
    const otherDay = course({
      code: "D",
      meetingDays: ["Tue"],
      startTime: "10:30",
      endTime: "11:30",
    });

    expect(coursesOverlap(first, overlap)).toBe(true);
    expect(coursesOverlap(first, backToBack)).toBe(false);
    expect(coursesOverlap(first, otherDay)).toBe(false);
  });
});

describe("filterCourses", () => {
  it("returns every course when filters are at their defaults", () => {
    expect(filterCourses(catalog, [], defaultCourseFilters, [])).toEqual(catalog);
  });

  it("keeps a course that matches any selected department, credit, time, workload, or level", () => {
    const reviews = [
      review("CMSC 220", 4, 5),
      review("MATH 140", 4, 7),
      review("ENGL 101", 4, 10),
      review("PHYS 404", 4, 8),
    ];

    expect(
      filterCourses(catalog, reviews, filters({ departments: ["CMSC", "MATH"] }), []).map(
        (item) => item.code,
      ),
    ).toEqual(["CMSC 220", "MATH 140"]);

    expect(
      filterCourses(catalog, reviews, filters({ credits: [3] }), []).map((item) => item.code),
    ).toEqual(["ENGL 101", "PHYS 404"]);

    expect(
      filterCourses(catalog, reviews, filters({ times: ["morning", "afternoon"] }), []).map(
        (item) => item.code,
      ),
    ).toEqual(["CMSC 220", "ENGL 101"]);

    expect(
      filterCourses(catalog, reviews, filters({ workloads: ["light", "heavy"] }), []).map(
        (item) => item.code,
      ),
    ).toEqual(["CMSC 220", "ENGL 101"]);

    expect(
      filterCourses(catalog, reviews, filters({ levels: [200, 400] }), []).map(
        (item) => item.code,
      ),
    ).toEqual(["CMSC 220", "PHYS 404"]);
  });

  it("keeps a course only when it meets on every selected day", () => {
    expect(
      filterCourses(catalog, [], filters({ days: ["Tue"] }), []).map((item) => item.code),
    ).toEqual(["CMSC 220", "PHYS 404"]);

    expect(
      filterCourses(catalog, [], filters({ days: ["Tue", "Thu"] }), []).map((item) => item.code),
    ).toEqual(["CMSC 220", "PHYS 404"]);

    expect(
      filterCourses(catalog, [], filters({ days: ["Mon", "Fri"] }), []).map((item) => item.code),
    ).toEqual(["MATH 140"]);
  });

  it("applies a minimum rating and drops courses with no reviews", () => {
    const reviews = [review("CMSC 220", 3, 5), review("CMSC 220", 4, 5), review("MATH 140", 2, 5)];

    expect(
      filterCourses(catalog, reviews, filters({ minRating: null }), []).map((item) => item.code),
    ).toEqual(["CMSC 220", "MATH 140", "ENGL 101", "PHYS 404"]);

    expect(
      filterCourses(catalog, reviews, filters({ minRating: 3.5 }), []).map((item) => item.code),
    ).toEqual(["CMSC 220"]);

    expect(
      filterCourses(catalog, reviews, filters({ minRating: 4 }), []).map((item) => item.code),
    ).toEqual([]);
  });

  it("drops courses with no reviews when a workload band is selected", () => {
    const reviews = [review("MATH 140", 3, 7)];

    expect(
      filterCourses(catalog, reviews, filters({ workloads: ["medium"] }), []).map(
        (item) => item.code,
      ),
    ).toEqual(["MATH 140"]);
  });

  it("combines two active filters with AND", () => {
    const result = filterCourses(
      catalog,
      [],
      filters({ departments: ["CMSC"], credits: [4] }),
      [],
    );

    expect(result.map((item) => item.code)).toEqual(["CMSC 220"]);
  });

  it("keeps CMSC 220 when department CMSC is applied after a C++ search", () => {
    const searched = searchCourses(getCourses(), "C++");
    const result = filterCourses(searched, [], filters({ departments: ["CMSC"] }), []);

    expect(result.some((item) => item.code === "CMSC 220")).toBe(true);
  });

  it("hides courses that conflict with a pinned course, not the pinned course itself", () => {
    const pinned = course({
      code: "PIN",
      meetingDays: ["Mon"],
      startTime: "10:00",
      endTime: "11:00",
    });
    const clash = course({
      code: "CLASH",
      meetingDays: ["Mon", "Wed"],
      startTime: "10:30",
      endTime: "11:30",
    });
    const touch = course({
      code: "TOUCH",
      meetingDays: ["Mon"],
      startTime: "11:00",
      endTime: "12:00",
    });
    const list = [pinned, clash, touch];

    expect(
      filterCourses(list, [], filters({ avoidConflicts: true }), ["PIN"]).map((item) => item.code),
    ).toEqual(["PIN", "TOUCH"]);
  });

  it("hides nothing when the pin list is empty or the code is unknown", () => {
    const list = [
      course({
        code: "A",
        meetingDays: ["Mon"],
        startTime: "10:00",
        endTime: "11:00",
      }),
    ];

    expect(filterCourses(list, [], filters({ avoidConflicts: true }), [])).toEqual(list);
    expect(
      filterCourses(list, [], filters({ avoidConflicts: true }), ["NOT-A-COURSE"]),
    ).toEqual(list);
  });
});
