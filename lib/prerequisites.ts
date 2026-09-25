export function missingPrerequisites(
  prerequisites: string[],
  scheduledCodes: string[],
): string[] {
  const scheduled = new Set(scheduledCodes);
  return prerequisites.filter((code) => !scheduled.has(code));
}
