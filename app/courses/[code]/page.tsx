import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToSchedule } from "@/components/add-to-schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCourseDate } from "@/lib/dates";
import { averageRating, averageWorkload, reviewsForCourse } from "@/lib/reviews";
import { getCourse, getReviews } from "@/lib/seed";
import { coursePath } from "@/lib/utils";

type CoursePageProps = {
  params: Promise<{ code: string }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { code } = await params;
  const course = getCourse(decodeURIComponent(code));
  if (!course) {
    notFound();
  }

  const reviews = reviewsForCourse(getReviews(), course.code);
  const rating = averageRating(reviews);
  const workload = averageWorkload(reviews);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Catalog
          </Link>
          <span> / {course.code}</span>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
        <p className="text-muted-foreground">
          {course.instructor} · {course.department} · {course.credits} credits
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <AddToSchedule code={course.code} prerequisites={course.prerequisites} />
        <p className="text-sm text-muted-foreground">
          {course.meetingDays.join(", ")} {course.startTime}–{course.endTime}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About this course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6">
          <p>{course.description}</p>
          <p className="text-muted-foreground">
            {course.prerequisites.length === 0 ? (
              "No prerequisites"
            ) : (
              <>
                Prerequisites:{" "}
                {course.prerequisites.map((prereq, index) => (
                  <span key={prereq}>
                    {index > 0 ? ", " : null}
                    <Link href={coursePath(prereq)} className="hover:text-foreground">
                      {prereq}
                    </Link>
                  </span>
                ))}
              </>
            )}
          </p>
          <p className="text-muted-foreground">Starts {formatCourseDate(course.startDate)}</p>
          <p className="text-muted-foreground">
            {rating === null ? "No average rating yet" : `Average rating ${rating} / 5`}
            {workload === null ? "" : ` · Average workload ${workload} hours / week`}
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm font-medium">
                    {review.rating} / 5 · {review.workloadHours} hours / week · {review.author}
                  </p>
                  <p className="text-sm leading-6">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted {formatCourseDate(review.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
