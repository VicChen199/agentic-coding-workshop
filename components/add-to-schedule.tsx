"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { missingPrerequisites } from "@/lib/prerequisites";
import { readSchedule, toggleSchedule } from "@/lib/schedule";

export function AddToSchedule({
  code,
  prerequisites,
}: {
  code: string;
  prerequisites: string[];
}) {
  const [selected, setSelected] = useState(false);
  const [scheduled, setScheduled] = useState<string[]>([]);

  useEffect(() => {
    const codes = readSchedule();
    setScheduled(codes);
    setSelected(codes.includes(code));
  }, [code]);

  const missing = missingPrerequisites(prerequisites, scheduled);
  const blocked = !selected && missing.length > 0;

  return (
    <div className="space-y-2">
      <Button
        variant={selected ? "secondary" : "default"}
        disabled={blocked}
        onClick={() => {
          if (blocked) {
            return;
          }
          const next = toggleSchedule(code);
          setScheduled(next);
          setSelected(next.includes(code));
        }}
      >
        {selected ? "Remove from schedule" : "Add to schedule"}
      </Button>
      {blocked ? (
        <p className="text-sm text-muted-foreground">
          Requires {missing.join(", ")} on your schedule.
        </p>
      ) : null}
    </div>
  );
}
