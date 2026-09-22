import { averageRating, averageWorkload, reviewsForCourse } from "@/lib/reviews";
import type { Course, Review } from "@/lib/types";

export function averageRatingByDepartment(
  courses: Course[],
  reviews: Review[],
  department: string,
): number | null {
  const departmentCourses = courses.filter((course) => course.department === department);
  const ratings = departmentCourses
    .map((course) => averageRating(reviewsForCourse(reviews, course.code)))
    .filter((value): value is number => value !== null);

  if (ratings.length === 0) {
    return null;
  }

  const total = ratings.reduce((sum, value) => sum + value, 0);
  return Math.round((total / ratings.length) * 10) / 10;
}

export function topWorkloadCourses(courses: Course[], reviews: Review[], limit = 10): Course[] {
  return [...courses]
    .map((course) => ({
      course,
      workload: averageWorkload(reviewsForCourse(reviews, course.code)) ?? -1,
    }))
    .filter((entry) => entry.workload >= 0)
    .sort((a, b) => b.workload - a.workload)
    .slice(0, limit)
    .map((entry) => entry.course);
}
