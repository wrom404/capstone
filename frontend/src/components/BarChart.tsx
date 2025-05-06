import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart";
import { type Event } from "@/types/types";

// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
//   { month: "July", desktop: 214 },
// ];

const chartConfig = {
  desktop: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function BarChartComponent({ fetchedEvents }: { fetchedEvents: Event[] }) {
  console.log("Props passed to BarChartComponent:", fetchedEvents);

  const aggregatedData = fetchedEvents.reduce((acc, event) => {
    const eventKey = event.event_type ?? "";
    if (!acc[eventKey]) {
      acc[eventKey] = { category: eventKey, categoryCount: 1 };
    } else {
      acc[eventKey].categoryCount += 1;
    }
    return acc;
  }, {} as Record<string, { category: string; categoryCount: number }>);

  console.log("Aggregated data:", aggregatedData);

  const dailyEventCounts = Object.values(aggregatedData).sort();
  console.log("Daily event counts:", dailyEventCounts);
  return (
    <Card className="border border-gray-200 shadow-xs h-full">
      <CardHeader className="mt-4">
        <CardTitle>Event Category Count</CardTitle>
        <CardDescription>Showing total events category this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart className="mt-4" accessibilityLayer data={dailyEventCounts}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 12)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="categoryCount"
              fill="oklch(51.1% 0.262 276.966)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Event Category
        </div>
      </CardFooter>
    </Card>
  );
}

export default BarChartComponent;
