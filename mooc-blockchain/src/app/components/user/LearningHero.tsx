"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

interface Tab {
  label: string;
  value: string;
  href: string;
}

const tabs: Tab[] = [
  { label: "Danh sách của tôi", value: "all", href: "/learning/all" },
  { label: "Chứng chỉ", value: "certificates", href: "/learning/certificates" },
  { label: "Thời khóa biểu", value: "timetable", href: "/learning/timetable" },
];

export default function LearningHero() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("all");

  // Tối ưu việc tìm tab hiện tại với useMemo
  const currentTab = useMemo(() => {
    return tabs.find((tab) => pathname.includes(tab.value)) || tabs[0];
  }, [pathname]);

  // Cập nhật activeTab khi currentTab thay đổi
  useEffect(() => {
    setActiveTab(currentTab.value);
  }, [currentTab]);

  const handleTabChange = (value: string) => {
    const tab = tabs.find((t) => t.value === value);
    if (tab) {
      router.push(tab.href);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#0d0d14] to-[#1a1a2e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-tight transition-all duration-300">
          Học tập
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
          aria-label="Chuyển đổi giữa các danh mục học tập"
        >
          <TabsList className="bg-transparent flex flex-nowrap gap-2 sm:gap-4 p-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative flex-shrink-0 px-4 py-2 text-sm sm:text-base font-semibold text-gray-300 rounded-md
                  transition-all duration-300 ease-in-out
                  hover:bg-white/10 hover:text-white
                  data-[state=active]:text-white
                  data-[state=active]:bg-white/10
                  focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {tab.label}
                <span
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-white
                    transition-opacity duration-300
                    data-[state=active]:opacity-100 opacity-0"
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
}
