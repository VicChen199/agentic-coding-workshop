import type { Course } from "@/lib/types";

export function searchCourses(courses: Course[], query: string): Course[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return courses;
  }

  return courses.filter((course) => {
    const fields = [course.code, course.title, course.instructor];
    return fields.some((field) => field.toLowerCase().includes(needle));
  });
}
