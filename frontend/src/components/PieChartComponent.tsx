"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart";
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
  { browser: "xyz", visitors: 90, fill: "var(--color-xyz)" },
  { browser: "xyzk", visitors: 90, fill: "var(--color-xyzk)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Mass",
    color: "oklch(0.398 0.195 277.366)",
  },
  safari: {
    label: "Wedding",
    color: "oklch(0.623 0.214 259.815)",
  },
  firefox: {
    label: "Baptism",
    color: "oklch(0.511 0.262 276.966)",
  },
  edge: {
    label: "Funeral",
    color: "oklch(0.707 0.165 254.624)",
  },
  other: {
    label: "Confession",
    color: "oklch(0.673 0.182 276.935)",
  },
  xyz: {
    label: "Meeting",
    color: "oklch(0.828 0.111 230.318)",
  },
  xyzk: {
    label: "Others",
    color: "oklch(0.685 0.169 237.323)", 
  },
} satisfies ChartConfig;

const PieChartComponent = () => {
  return (
    <Card className="flex flex-col w-full shadow-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieChartComponent;
