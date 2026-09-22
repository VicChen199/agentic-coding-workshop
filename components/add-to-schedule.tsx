"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { readSchedule, toggleSchedule } from "@/lib/schedule";

export function AddToSchedule({ code }: { code: string }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(readSchedule().includes(code));
  }, [code]);

  return (
    <Button
      variant={selected ? "secondary" : "default"}
      onClick={() => setSelected(toggleSchedule(code).includes(code))}
    >
      {selected ? "Remove from schedule" : "Add to schedule"}
    </Button>
  );
}
