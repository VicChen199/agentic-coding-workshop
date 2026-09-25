import type { Course } from "@/lib/types";

export function searchCourses(courses: Course[], query: string): Course[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return courses;
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);

  return courses.filter((course) => {
    const haystack =
      `${course.code} ${course.title} ${course.description} ${course.instructor}`.toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}
