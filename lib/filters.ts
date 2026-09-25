import type { Course, MeetingDay, Review } from "@/lib/types";

export type TimeOfDay = "morning" | "midday" | "afternoon";

export type WorkloadBand = "light" | "medium" | "heavy";

export type CourseFilters = {
  departments: string[];
  credits: number[];
  days: MeetingDay[];
  minRating: number | null;
  times: TimeOfDay[];
  workloads: WorkloadBand[];
  levels: number[];
  avoidConflicts: boolean;
};

export const defaultCourseFilters: CourseFilters = {
  departments: [],
  credits: [],
  days: [],
  minRating: null,
  times: [],
  workloads: [],
  levels: [],
  avoidConflicts: false,
};

export function courseLevel(_course: Course): number | null {
  throw new Error("Not implemented");
}

export function timeOfDay(_course: Course): TimeOfDay {
  throw new Error("Not implemented");
}

export function workloadBand(_reviews: Review[]): WorkloadBand | null {
  throw new Error("Not implemented");
}

export function coursesOverlap(_a: Course, _b: Course): boolean {
  throw new Error("Not implemented");
}

export function filterCourses(
  _courses: Course[],
  _reviews: Review[],
  _filters: CourseFilters,
  _pinnedCodes: string[],
): Course[] {
  throw new Error("Not implemented");
}
