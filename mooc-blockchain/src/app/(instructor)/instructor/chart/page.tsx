"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust path based on your setup

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AnalyticsDashboard: React.FC = () => {
  // Data for the chart (simulating monthly revenue)
  const chartData = [
    { month: "T1", revenue: 0.1 },
    { month: "T2", revenue: 1 },
    { month: "T3", revenue: 2 },
    { month: "T4", revenue: 1 },
    { month: "T5", revenue: 1 },
    { month: "T6", revenue: 1 },
    { month: "T7", revenue: 1 },
    { month: "T8", revenue: 5 },
    { month: "T9", revenue: 1 },
    { month: "T10", revenue: 1 },
    { month: "T11", revenue: 1 },
    { month: "T12", revenue: 1 },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              792.5K <span className="text-green-500">↑</span>
            </p>
            <p className="text-sm text-muted-foreground">
              202.5K more than usual
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Watch time (hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              202.7K <span className="text-green-500">↑</span>
            </p>
            <p className="text-sm text-muted-foreground">
              84.7K more than usual
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              +8.9K <span className="text-green-500">↑</span>
            </p>
            <p className="text-sm text-muted-foreground">616 more than usual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Estimated revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              $14,889.85 <span className="text-green-500">↑</span>
            </p>
            <p className="text-sm text-muted-foreground">
              $4,598.95 more than usual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="mt-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold mb-3">Triệu đồng</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    `${value.toLocaleString()} triệu đồng`
                  }
                />
                <Tooltip
                  formatter={(value: number) =>
                    `${value.toLocaleString()} triệu đồng`
                  }
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
