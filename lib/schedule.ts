export const SCHEDULE_STORAGE_KEY = "courseradar-schedule";

export function readSchedule(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((code): code is string => typeof code === "string");
  } catch {
    return [];
  }
}

export function writeSchedule(codes: string[]) {
  window.localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(codes));
}

export function toggleSchedule(code: string): string[] {
  const current = readSchedule();
  const next = current.includes(code)
    ? current.filter((item) => item !== code)
    : [...current, code];
  writeSchedule(next);
  return next;
}
