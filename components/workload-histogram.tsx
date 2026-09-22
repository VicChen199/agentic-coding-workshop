type HistogramBar = {
  label: string;
  hours: number;
};

export function WorkloadHistogram({ bars }: { bars: HistogramBar[] }) {
  if (bars.length === 0) {
    return <p className="text-sm text-muted-foreground">No workload data yet.</p>;
  }

  const maxHours = Math.max(...bars.map((bar) => bar.hours), 1);

  return (
    <div className="space-y-2">
      {bars.map((bar, index) => (
        <div key={`${bar.label}-${index}`} className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{bar.label}</span>
            <span>{bar.hours} hours</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.min(100, (bar.hours / maxHours) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
