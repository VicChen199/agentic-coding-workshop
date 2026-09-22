export const PAGE_SIZE = 10;

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE - 1);
}

export function pageCount(total: number): number {
  return Math.floor(total / PAGE_SIZE);
}
