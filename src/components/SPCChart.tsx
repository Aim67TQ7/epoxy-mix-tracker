import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface EpoxyMixRecord {
  UUID: string;
  Timestamp: string | null;
  Ratio: string | null;
  Employee: number | null;
}

interface SPCChartProps {
  data: EpoxyMixRecord[];
}

const LOWER_LIMIT = 11.878;
const UPPER_LIMIT = 12.362;
const CENTER_LINE = 12.12;

export function SPCChart({ data }: SPCChartProps) {
  const chartData = data
    .filter((d) => d.Ratio && d.Timestamp)
    .map((d) => {
      const ratio = parseFloat(d.Ratio!);
      return {
        timestamp: d.Timestamp,
        ratio,
        formattedDate: format(new Date(d.Timestamp!), "MM/dd HH:mm"),
        inRange: ratio >= LOWER_LIMIT && ratio <= UPPER_LIMIT,
      };
    })
    .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No ratio data available
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[11.5, 12.8]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--popover-foreground))",
            }}
            formatter={(value: number) => [value.toFixed(3), "Ratio"]}
          />
          <ReferenceLine
            y={UPPER_LIMIT}
            stroke="hsl(var(--destructive))"
            strokeDasharray="5 5"
            label={{ value: "UCL", fill: "hsl(var(--destructive))", fontSize: 10, position: "right" }}
          />
          <ReferenceLine
            y={CENTER_LINE}
            stroke="hsl(var(--primary))"
            strokeDasharray="3 3"
            label={{ value: "CL", fill: "hsl(var(--primary))", fontSize: 10, position: "right" }}
          />
          <ReferenceLine
            y={LOWER_LIMIT}
            stroke="hsl(var(--destructive))"
            strokeDasharray="5 5"
            label={{ value: "LCL", fill: "hsl(var(--destructive))", fontSize: 10, position: "right" }}
          />
          <Line
            type="monotone"
            dataKey="ratio"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => (
              <circle
                cx={cx}
                cy={cy}
                r={5}
                fill={payload.inRange ? "hsl(142.1 76.2% 36.3%)" : "hsl(var(--destructive))"}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            )}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-green-600" /> In Range
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-destructive" /> Out of Range
        </span>
        <span>UCL: {UPPER_LIMIT} | CL: {CENTER_LINE} | LCL: {LOWER_LIMIT}</span>
      </div>
    </div>
  );
}
