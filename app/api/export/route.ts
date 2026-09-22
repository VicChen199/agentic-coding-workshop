import { buildCalendar } from "@/lib/ics";
import { getCourses } from "@/lib/seed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("codes") ?? "";
  const codes = raw
    .split(",")
    .map((code) => decodeURIComponent(code).trim())
    .filter(Boolean);
  const selected = getCourses().filter((course) => codes.includes(course.code));
  const body = buildCalendar(selected);

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="courseradar.ics"',
    },
  });
}
