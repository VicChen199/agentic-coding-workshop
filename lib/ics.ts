import type { Course } from "@/lib/types";

const DAY_TO_BYDAY: Record<string, string> = {
  Mon: "MO",
  Tue: "TU",
  Wed: "WE",
  Thu: "TH",
  Fri: "FR",
};

function compactDate(isoDate: string, time: string): string {
  const [year, month, day] = isoDate.split("-");
  const [hours, minutes] = time.split(":");
  return `${year}${month}${day}T${hours}${minutes}00`;
}

export function buildCalendar(courses: Course[]): string {
  const events = courses.flatMap((course) => {
    const days = course.meetingDays.map((day) => DAY_TO_BYDAY[day]).filter(Boolean);
    const start = compactDate(course.startDate, course.startTime);
    const end = compactDate(course.startDate, course.endTime);
    return [
      "BEGIN:VEVENT",
      `UID:${course.code.replace(/\s+/g, "")}@courseradar`,
      `SUMMARY:${course.code} ${course.title}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      days.length > 0 ? `RRULE:FREQ=WEEKLY;BYDAY=${days.join(",")}` : "",
      "END:VEVENT",
    ].filter(Boolean);
  });

  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CourseRadar//EN", ...events, "END:VCALENDAR"].join(
    "\r\n",
  );
}
