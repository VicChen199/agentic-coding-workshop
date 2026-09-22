import { ScheduleBoard } from "@/components/schedule-board";
import { getCourses } from "@/lib/seed";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Weekly schedule</h1>
        <p className="mt-2 text-muted-foreground">
          Courses you add stay in local storage on this browser. There is no account.
        </p>
      </div>
      <ScheduleBoard courses={getCourses()} />
    </div>
  );
}
