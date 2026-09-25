export const PAGE_SIZE = 10;

export function paginate<T>(items: T[], page: number): T[] {
  const start = Math.max(0, (page - 1) * PAGE_SIZE);
  return items.slice(start, start + PAGE_SIZE);
}

export function pageCount(total: number): number {
  return Math.ceil(total / PAGE_SIZE);
}
