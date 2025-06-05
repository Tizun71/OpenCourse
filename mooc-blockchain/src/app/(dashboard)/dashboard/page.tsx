"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";

import StatisticGroup from "@/components/organism/StatisticGroup/StatisticGroup";
import NotificationAdmin from "@/components/organism/Notification/NotificationAdmin";
import { useAuth } from "@/hooks/Auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground">
          Xem thống kê và hoạt động mới nhất trên nền tảng của bạn.
        </p>
      </div>

      <StatisticGroup />
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Thông báo gần đây
          </h2>

          <div className="flex items-center gap-2"></div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y overflow-auto h-100">
              {user ? <NotificationAdmin userId={user.id} /> : <div></div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
