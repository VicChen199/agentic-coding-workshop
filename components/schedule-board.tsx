"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readSchedule, toggleSchedule } from "@/lib/schedule";
import type { Course, MeetingDay } from "@/lib/types";
import { coursePath } from "@/lib/utils";
import Link from "next/link";

const DAYS: MeetingDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function ScheduleBoard({ courses }: { courses: Course[] }) {
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    setCodes(readSchedule());
  }, []);

  const selected = useMemo(
    () => codes.map((code) => courses.find((course) => course.code === code)).filter(Boolean) as Course[],
    [codes, courses],
  );

  function downloadCalendar() {
    const query = codes.map((code) => encodeURIComponent(code)).join(",");
    window.location.href = `/api/export?codes=${query}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" onClick={downloadCalendar} disabled={selected.length === 0}>
          Download calendar
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {DAYS.map((day) => (
          <Card key={day}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selected
                .filter((course) => course.meetingDays.includes(day))
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((course) => (
                  <div key={`${day}-${course.code}`} className="rounded-md bg-muted px-3 py-2 text-sm">
                    <Link href={coursePath(course.code)} className="font-medium hover:underline">
                      {course.code}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {course.startTime}–{course.endTime}
                    </p>
                  </div>
                ))}
              {selected.every((course) => !course.meetingDays.includes(day)) ? (
                <p className="text-xs text-muted-foreground">Nothing scheduled</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pinned courses</h2>
        {selected.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add a course from its detail page. Your list stays in this browser.
          </p>
        ) : (
          <ul className="space-y-2">
            {selected.map((course) => (
              <li key={course.code} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">
                    {course.code} · {course.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {course.meetingDays.join(", ")} {course.startTime}–{course.endTime}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCodes(toggleSchedule(course.code))}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
