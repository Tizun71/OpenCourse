"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { month: "January", Visitor: 186, Register: 80 },
  { month: "February", Visitor: 305, Register: 200 },
  { month: "March", Visitor: 237, Register: 120 },
  { month: "April", Visitor: 73, Register: 190 },
  { month: "May", Visitor: 209, Register: 130 },
  { month: "June", Visitor: 214, Register: 140 },
];

const chartConfig = {
  Visitor: {
    label: "Visitor",
    color: "#2563eb",
  },
  Register: {
    label: "Register",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function UserLineChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="Visitor" stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line dataKey="Register" stroke="#60a5fa" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
