import seed from "@/data/seed.json";
import type { Course, Review, Seed } from "@/lib/types";

const data = seed as Seed;

export function getCourses(): Course[] {
  return data.courses;
}

export function getReviews(): Review[] {
  return data.reviews;
}

export function getCourse(code: string): Course | undefined {
  return data.courses.find((course) => course.code === code);
}

export function getDepartments(): string[] {
  return [...new Set(data.courses.map((course) => course.department))].sort();
}
