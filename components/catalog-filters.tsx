"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  courseLevel,
  defaultCourseFilters,
  type CourseFilters,
  type TimeOfDay,
  type WorkloadBand,
} from "@/lib/filters";
import type { Course, MeetingDay } from "@/lib/types";

const MEETING_DAYS: readonly MeetingDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const TIME_OPTIONS: readonly { value: TimeOfDay; label: string }[] = [
  { value: "morning", label: "Morning (before 12:00)" },
  { value: "midday", label: "Midday (12:00–14:59)" },
  { value: "afternoon", label: "Afternoon (15:00 or later)" },
];

const WORKLOAD_OPTIONS: readonly { value: WorkloadBand; label: string }[] = [
  { value: "light", label: "Light (under 6 hours)" },
  { value: "medium", label: "Medium (6 to under 9 hours)" },
  { value: "heavy", label: "Heavy (9 hours or more)" },
];

const MIN_RATING_OPTIONS = [
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "3.5", label: "3.5+" },
  { value: "4", label: "4+" },
] as const;

function setMembership<T>(values: readonly T[], value: T, selected: boolean): T[] {
  if (selected) {
    return values.includes(value) ? [...values] : [...values, value];
  }
  return values.filter((item) => item !== value);
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onToggle(event.target.checked)}
      />
      {label}
    </label>
  );
}

export function CatalogFilters({
  courses,
  filters,
  onChange,
}: {
  courses: Course[];
  filters: CourseFilters;
  onChange: (filters: CourseFilters) => void;
}) {
  const departments = [...new Set(courses.map((course) => course.department))].sort();
  const credits = [...new Set(courses.map((course) => course.credits))].sort(
    (left, right) => left - right,
  );
  const levels = [
    ...new Set(
      courses
        .map((course) => courseLevel(course))
        .filter((level): level is number => level !== null),
    ),
  ].sort((left, right) => left - right);

  return (
    <fieldset className="space-y-4 rounded-lg border border-border p-4 text-sm">
      <legend className="px-1 text-sm font-medium">Filters</legend>

      <FilterGroup label="Departments">
        {departments.map((department) => (
          <FilterCheckbox
            key={department}
            checked={filters.departments.includes(department)}
            label={department}
            onToggle={(checked) =>
              onChange({
                ...filters,
                departments: setMembership(filters.departments, department, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Credits">
        {credits.map((credit) => (
          <FilterCheckbox
            key={credit}
            checked={filters.credits.includes(credit)}
            label={`${credit} credits`}
            onToggle={(checked) =>
              onChange({
                ...filters,
                credits: setMembership(filters.credits, credit, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Meeting days">
        {MEETING_DAYS.map((day) => (
          <FilterCheckbox
            key={day}
            checked={filters.days.includes(day)}
            label={day}
            onToggle={(checked) =>
              onChange({
                ...filters,
                days: setMembership(filters.days, day, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-filters-min-rating" className="text-muted-foreground">
          Minimum rating
        </label>
        <select
          id="catalog-filters-min-rating"
          className="h-10 w-full max-w-xs rounded-md border border-border bg-background px-3 text-sm"
          value={filters.minRating === null ? "any" : String(filters.minRating)}
          onChange={(event) => {
            const value = event.target.value;
            onChange({
              ...filters,
              minRating: value === "any" ? null : Number(value),
            });
          }}
        >
          <option value="any">Any</option>
          {MIN_RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <FilterGroup label="Time of day">
        {TIME_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.times.includes(option.value)}
            label={option.label}
            onToggle={(checked) =>
              onChange({
                ...filters,
                times: setMembership(filters.times, option.value, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Workload">
        {WORKLOAD_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.workloads.includes(option.value)}
            label={option.label}
            onToggle={(checked) =>
              onChange({
                ...filters,
                workloads: setMembership(filters.workloads, option.value, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Course level">
        {levels.map((level) => (
          <FilterCheckbox
            key={level}
            checked={filters.levels.includes(level)}
            label={`${level}-level`}
            onToggle={(checked) =>
              onChange({
                ...filters,
                levels: setMembership(filters.levels, level, checked),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterCheckbox
        checked={filters.avoidConflicts}
        label="Hide conflicts with pinned courses"
        onToggle={(checked) => onChange({ ...filters, avoidConflicts: checked })}
      />

      <div>
        <Button type="button" variant="outline" onClick={() => onChange(defaultCourseFilters)}>
          Clear
        </Button>
      </div>
    </fieldset>
  );
}
