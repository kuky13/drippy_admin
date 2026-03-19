interface Props {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  warning?: boolean;
}

export default function StatusBar({ label, value, max = 100, unit = "%", warning }: Props) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between font-label text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className={warning ? "text-destructive" : "text-foreground"}>
          {value}{unit}
        </span>
      </div>
      <div className="h-2 bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            warning ? "bg-destructive" : "bg-primary"
          } ${warning ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
