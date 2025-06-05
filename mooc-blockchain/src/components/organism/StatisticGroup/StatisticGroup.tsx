"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BookOpen, FolderTree, Users } from "lucide-react";
import StatisticService from "@/services/Backend-api/statistic-service";

function StatisticCard({
  title,
  value,
  icon,
  iconColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${iconColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function StatisticGroup() {
  const [data, setData] = useState({
    totalLearners: 0,
    totalInstructors: 0,
    totalCategories: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await StatisticService.admin();
      if (res.status === 200 || res.status === 205) {
        setData(res.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Tổng số học viên"
          value={data.totalLearners.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          iconColor="bg-blue-100 text-blue-700"
        />
        <StatisticCard
          title="Tổng số giảng viên"
          value={data.totalInstructors.toLocaleString()}
          icon={<Bell className="h-5 w-5" />}
          iconColor="bg-purple-100 text-purple-700"
        />
        <StatisticCard
          title="Tổng số danh mục"
          value={data.totalCategories.toLocaleString()}
          icon={<FolderTree className="h-5 w-5" />}
          iconColor="bg-amber-100 text-amber-700"
        />
        <StatisticCard
          title="Tổng số khóa học"
          value={data.totalCourses.toLocaleString()}
          icon={<BookOpen className="h-5 w-5" />}
          iconColor="bg-green-100 text-green-700"
        />
      </div>
    </div>
  );
}
