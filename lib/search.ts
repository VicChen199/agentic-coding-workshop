import type { Course } from "@/lib/types";

export function searchCourses(courses: Course[], query: string): Course[] {
  const pattern = new RegExp(query);
  return courses.filter(
    (course) => pattern.test(course.title) || pattern.test(course.code),
  );
}
