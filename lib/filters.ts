import type { Course, MeetingDay, Review } from "@/lib/types";
import { averageRating, averageWorkload, reviewsForCourse } from "@/lib/reviews";

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

export function courseLevel(course: Course): number | null {
  const match = course.code.match(/\d+/);
  if (!match) {
    return null;
  }
  return Math.floor(Number.parseInt(match[0], 10) / 100) * 100;
}

function minutes(time: string): number {
  const [hours, mins] = time.split(":").map((part) => Number.parseInt(part, 10));
  return hours * 60 + mins;
}

export function timeOfDay(course: Course): TimeOfDay {
  const start = minutes(course.startTime);
  if (start < 12 * 60) {
    return "morning";
  }
  if (start < 15 * 60) {
    return "midday";
  }
  return "afternoon";
}

export function workloadBand(reviews: Review[]): WorkloadBand | null {
  const average = averageWorkload(reviews);
  if (average === null) {
    return null;
  }
  if (average < 6) {
    return "light";
  }
  if (average < 9) {
    return "medium";
  }
  return "heavy";
}

export function coursesOverlap(a: Course, b: Course): boolean {
  const sharesDay = a.meetingDays.some((day) => b.meetingDays.includes(day));
  if (!sharesDay) {
    return false;
  }
  const startA = minutes(a.startTime);
  const endA = minutes(a.endTime);
  const startB = minutes(b.startTime);
  const endB = minutes(b.endTime);
  return startA < endB && startB < endA;
}

export function filterCourses(
  courses: Course[],
  reviews: Review[],
  filters: CourseFilters,
  pinnedCodes: string[],
): Course[] {
  const pinned = filters.avoidConflicts
    ? pinnedCodes.flatMap((code) => {
        const match = courses.find((course) => course.code === code);
        return match ? [match] : [];
      })
    : [];

  return courses.filter((course) => {
    if (
      filters.departments.length > 0 &&
      !filters.departments.includes(course.department)
    ) {
      return false;
    }
    if (filters.credits.length > 0 && !filters.credits.includes(course.credits)) {
      return false;
    }
    if (
      filters.days.length > 0 &&
      !filters.days.every((day) => course.meetingDays.includes(day))
    ) {
      return false;
    }
    if (filters.times.length > 0 && !filters.times.includes(timeOfDay(course))) {
      return false;
    }
    if (filters.levels.length > 0) {
      const level = courseLevel(course);
      if (level === null || !filters.levels.includes(level)) {
        return false;
      }
    }

    const courseReviews = reviewsForCourse(reviews, course.code);
    if (filters.minRating !== null) {
      const rating = averageRating(courseReviews);
      if (rating === null || rating < filters.minRating) {
        return false;
      }
    }
    if (filters.workloads.length > 0) {
      const band = workloadBand(courseReviews);
      if (band === null || !filters.workloads.includes(band)) {
        return false;
      }
    }
    if (
      pinned.some((pin) => pin.code !== course.code && coursesOverlap(course, pin))
    ) {
      return false;
    }
    return true;
  });
}
