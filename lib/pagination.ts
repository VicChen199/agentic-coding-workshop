export const PAGE_SIZE = 10;

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

export function pageCount(total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.ceil(total / PAGE_SIZE);
}
