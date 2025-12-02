import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from "date-fns";
import { Sun, ClipboardList, Moon, AlertTriangle, Check } from "lucide-react";

interface EpoxyMixRecord {
  UUID: string;
  Timestamp: string | null;
  Ratio: string | null;
  Employee: number | null;
  Startup: string | null;
  "Daily Check": string | null;
  Shutdown: string | null;
}

interface CheckLogProps {
  data: EpoxyMixRecord[];
}

interface DayChecks {
  date: Date;
  startup: EpoxyMixRecord | null;
  daily: EpoxyMixRecord | null;
  shutdown: EpoxyMixRecord | null;
}

export function CheckLog({ data }: CheckLogProps) {
  // Get date range for last 14 days
  const today = new Date();
  const twoWeeksAgo = subDays(today, 13);
  const dateRange = eachDayOfInterval({ start: twoWeeksAgo, end: today }).reverse();

  // Group records by day and check type
  const dayMap = new Map<string, DayChecks>();

  // Initialize all days
  dateRange.forEach((date) => {
    const key = format(date, "yyyy-MM-dd");
    dayMap.set(key, { date, startup: null, daily: null, shutdown: null });
  });

  // Populate with actual data
  data.forEach((record) => {
    if (!record.Timestamp) return;
    const recordDate = parseISO(record.Timestamp);
    const key = format(recordDate, "yyyy-MM-dd");
    const dayChecks = dayMap.get(key);
    if (!dayChecks) return;

    if (record.Startup) {
      dayChecks.startup = record;
    }
    if (record["Daily Check"]) {
      dayChecks.daily = record;
    }
    if (record.Shutdown) {
      dayChecks.shutdown = record;
    }
  });

  const days = Array.from(dayMap.values());

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return null;
    return format(parseISO(timestamp), "h:mm a");
  };

  const CheckItem = ({
    icon: Icon,
    label,
    record,
    showRatio = false,
  }: {
    icon: typeof Sun;
    label: string;
    record: EpoxyMixRecord | null;
    showRatio?: boolean;
  }) => {
    const isComplete = !!record;
    return (
      <div
        className={`flex items-center gap-2 rounded-md px-3 py-2 ${
          isComplete ? "bg-green-900/20" : "bg-destructive/20"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${isComplete ? "text-green-500" : "text-destructive"}`}
        />
        <span className="flex-1 text-sm font-medium">{label}</span>
        {isComplete ? (
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">
              {formatTime(record.Timestamp)}
            </span>
            <span className="text-xs text-muted-foreground">
              (#{record.Employee})
            </span>
            {showRatio && record.Ratio && (
              <span className="ml-1 rounded bg-zinc-700 px-1.5 py-0.5 text-xs">
                {record.Ratio}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>MISSED</span>
          </div>
        )}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No check data available
      </div>
    );
  }

  return (
    <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
      {days.map((day) => {
        const isToday = format(day.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
        const hasAnyCheck = day.startup || day.daily || day.shutdown;
        
        // Skip days with no checks that are not today
        if (!hasAnyCheck && !isToday) return null;

        return (
          <div key={format(day.date, "yyyy-MM-dd")} className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold">
              {format(day.date, "EEEE, MMM d, yyyy")}
              {isToday && (
                <span className="ml-2 rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  Today
                </span>
              )}
            </h3>
            <div className="space-y-2">
              <CheckItem icon={Sun} label="Startup" record={day.startup} />
              <CheckItem icon={ClipboardList} label="Daily Check" record={day.daily} showRatio />
              <CheckItem icon={Moon} label="Shutdown" record={day.shutdown} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
