import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCourseDate } from "@/lib/dates";
import { averageRating, reviewsForCourse } from "@/lib/reviews";
import type { Course, Review } from "@/lib/types";
import { coursePath } from "@/lib/utils";

type CourseCardProps = {
  course: Course;
  reviews: Review[];
};

export function CourseCard({ course, reviews }: CourseCardProps) {
  const courseReviews = reviewsForCourse(reviews, course.code);
  const rating = averageRating(courseReviews);

  return (
    <Link href={coursePath(course.code)} className="block h-full">
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {course.code}
          </p>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>
            {course.instructor} · {course.credits} credits
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{rating === null ? "No rating" : `${rating} / 5`}</span>
          <span>{courseReviews.length} reviews</span>
          <span>Starts {formatCourseDate(course.startDate)}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
