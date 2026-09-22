export function formatCourseDate(isoDate: string): string {
  const formatted = new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${formatted} (${isoDate})`;
}
