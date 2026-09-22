import type { Review } from "@/lib/types";

export function reviewsForCourse(reviews: Review[], courseCode: string): Review[] {
  return reviews.filter((review) => review.courseCode === courseCode);
}

export function averageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) {
    return null;
  }
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function averageWorkload(reviews: Review[]): number | null {
  if (reviews.length === 0) {
    return null;
  }
  const total = reviews.reduce((sum, review) => sum + review.workloadHours, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}
