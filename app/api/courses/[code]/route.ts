import { reviewsForCourse } from "@/lib/reviews";
import { getCourse, getReviews } from "@/lib/seed";

type CourseRouteProps = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, { params }: CourseRouteProps) {
  const { code } = await params;
  const course = getCourse(decodeURIComponent(code));
  if (!course) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }

  return Response.json({
    course,
    reviews: reviewsForCourse(getReviews(), course.code),
  });
}
