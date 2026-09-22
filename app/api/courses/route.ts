import { pageCount, paginate } from "@/lib/pagination";
import { searchCourses } from "@/lib/search";
import { getCourses } from "@/lib/seed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const filtered = searchCourses(getCourses(), query);
  const items = paginate(filtered, page);

  return Response.json({
    items,
    page,
    pageCount: pageCount(filtered.length),
    total: filtered.length,
  });
}
