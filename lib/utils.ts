import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function coursePath(code: string): string {
  return `/courses/${encodeURIComponent(code)}`;
}
