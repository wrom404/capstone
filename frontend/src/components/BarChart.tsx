import { useState, useEffect, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/src/components/ui/chart";
import { Event } from "@/types/types";

// Define payload structure for tooltip
interface Payload {
  payload: {
    category: string;
    count: number;
    displayCount: number;
  };
}

// Define the category data structure
interface CategoryData {
  category: string;
  count: number;
  // This is used for rendering zero values with a minimum height
  displayCount: number;
}

const chartConfig: ChartConfig = {
  desktop: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
};

// Define all expected categories - order them as shown in the screenshot
const allCategories = [
  "Wedding",
  "Others",
  "Baptism",
  "Mass",
  "Meeting",
  "Funeral",
  "Confession",
];

interface BarChartComponentProps {
  fetchedEvents?: Event[];
}

function BarChartComponent({ fetchedEvents }: BarChartComponentProps) {
  // State to store processed data
  const [chartData, setChartData] = useState<CategoryData[]>([]);

  // Memoize the events data and formatted data to prevent unnecessary re-renders
  const events = useMemo(() => {
    return fetchedEvents?.length ? fetchedEvents : [];
  }, [fetchedEvents]);

  const formattedData = useMemo(() => {
    const categoryCountMap: Record<string, number> = {};

    // Initialize all categories with 0 count
    allCategories.forEach((category) => {
      categoryCountMap[category] = 0;
    });

    // Count events by normalized category
    events.forEach((event) => {
      if (!event.event_type) return;

      // Normalize case for matching
      const normalizedType = event.event_type.trim();

      // Find the matching category (case-insensitive)
      const matchedCategory = allCategories.find(
        (cat) => cat.toLowerCase() === normalizedType.toLowerCase()
      );

      if (matchedCategory) {
        categoryCountMap[matchedCategory]++;
      } else {
        // If no match, add to Others
        categoryCountMap["Others"]++;
      }
    });

    console.log("Category counts:", categoryCountMap);

    // Convert to array format for the chart and include displayCount
    return allCategories.map((category) => ({
      category,
      count: categoryCountMap[category] || 0,
      displayCount:
        categoryCountMap[category] === 0
          ? 0.5
          : categoryCountMap[category] <= 1
          ? 1
          : categoryCountMap[category],
    }));
  }, [events]); // Depend on 'events'

  useEffect(() => {
    setChartData(formattedData);
  }, [formattedData]);

  // Custom tooltip that shows the actual count
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Payload[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 shadow rounded border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {data.category}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-200 shadow-xs h-full dark:bg-zinc-900 dark:border-gray-800">
      <CardHeader className="mt-4">
        <CardTitle className="dark:text-gray-300">
          Event Category Count
        </CardTitle>
        <CardDescription className="text-sm dark:text-gray-400">
          Showing total events category this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            className="mt-4"
            accessibilityLayer
            data={chartData}
            barGap={20}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Bar dataKey="displayCount" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="oklch(51.1% 0.262 276.966)" // Strong blue color matching the screenshot
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground dark:text-gray-400">
          Event Category
        </div>
      </CardFooter>
    </Card>
  );
}

export default BarChartComponent;
