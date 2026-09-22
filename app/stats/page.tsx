import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { averageWorkload, reviewsForCourse } from "@/lib/reviews";
import { getCourses, getDepartments, getReviews } from "@/lib/seed";
import { averageRatingByDepartment, topWorkloadCourses } from "@/lib/stats";
import { coursePath } from "@/lib/utils";
import Link from "next/link";

export default function StatsPage() {
  const courses = getCourses();
  const reviews = getReviews();
  const departments = getDepartments();
  const heaviest = topWorkloadCourses(courses, reviews, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Catalog stats</h1>
        <p className="mt-2 text-muted-foreground">
          Averages from the seed reviews. Six departments, no live model.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Average rating by department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {departments.map((department) => {
            const average = averageRatingByDepartment(courses, reviews, department);
            return (
              <div key={department} className="flex items-center justify-between">
                <span>{department}</span>
                <span className="text-muted-foreground">
                  {average === null ? "No reviews" : `${average} / 5`}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highest average workload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {heaviest.map((course) => {
            const hours = averageWorkload(reviewsForCourse(reviews, course.code));
            return (
              <div key={course.code} className="flex items-center justify-between gap-4">
                <Link href={coursePath(course.code)} className="hover:underline">
                  {course.code} · {course.title}
                </Link>
                <span className="shrink-0 text-muted-foreground">{hours} hours / week</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
