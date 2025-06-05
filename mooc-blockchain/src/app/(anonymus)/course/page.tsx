"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CourseCard from "@/components/molecules/Card/CourseCard";
import { useLoading } from "@/provider/Loading";
import { listPublisedCourses } from "@/services/course-service";
import CategoryService from "@/services/Backend-api/category-service";

const LEVELS = ["Tất cả", "BEGINNER", "INTERMEDIATE", "ADVANCED"];
const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "popular", label: "Phổ biến nhất" },
  { value: "name", label: "Tên A-Z" },
  { value: "level", label: "Theo cấp độ" },
];
const LEVEL_LABELS = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung bình",
  ADVANCED: "Nâng cao",
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoading } = useLoading();
  const [courses, setCourses] = useState([]);

  const searchQuery = searchParams.get("search") || "";
  const [categories, setcategories] = useState<string[]>([]);

  const selectedCategory = searchParams.get("category") || "Tất cả";
  const selectedLevel = searchParams.get("level") || "Tất cả";
  const sortBy = searchParams.get("sort") || "newest";

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "Tất cả" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("?");
  };

  const fetchcategories = useCallback(async () => {
    try {
      const res = await CategoryService.list();
      const dynamiccategories =
        res?.data?.map((cat: any) => cat.categoryName) || [];
      setcategories(["Tất cả", ...dynamiccategories]);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  }, []);

  const LEVEL_LABELS = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
  } as const;
  type CourseLevel = keyof typeof LEVEL_LABELS;

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listPublisedCourses({
        keyword: "",
        sort: "desc",
        page: 1,
        size: 100,
      });
      setCourses(res?.data?.courses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchCourses();
    fetchcategories();
  }, [fetchCourses, fetchcategories]);

  const filteredCourses = useMemo(() => {
    const filtered = courses.filter(
      ({
        courseName,
        description,
        instructorName,
        categoryName,
        courseLevel,
      }) => {
        const matchesSearch = [courseName, description, instructorName].some(
          (text: string) =>
            text.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesCategory =
          selectedCategory === "Tất cả" || categoryName === selectedCategory;
        const matchesLevel =
          selectedLevel === "Tất cả" || courseLevel === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
      }
    );

    type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

    switch (sortBy) {
      case "popular":
        filtered.sort(
          (a: any, b: any) =>
            (b.numberOfRegister || 0) - (a.numberOfRegister || 0)
        );
        break;
      case "name":
        filtered.sort((a: any, b: any) =>
          a.courseName.localeCompare(b.courseName)
        );
        break;
      case "level":
        const levelOrder: Record<CourseLevel, number> = {
          BEGINNER: 1,
          INTERMEDIATE: 2,
          ADVANCED: 3,
        };
        filtered.sort((a: any, b: any) => {
          const levelA = levelOrder[a.courseLevel as CourseLevel] ?? 0;
          const levelB = levelOrder[b.courseLevel as CourseLevel] ?? 0;
          return levelA - levelB;
        });
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLevel, sortBy, courses]);

  const activeFiltersCount = [
    selectedCategory !== "Tất cả",
    selectedLevel !== "Tất cả",
    searchQuery !== "",
  ].filter(Boolean).length;

  const renderSelect = (
    label: string,
    value: string,
    keyName: string,
    options: string[],
    labelMap: Record<string, string> | null = null,
    className = ""
  ) => (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(val) => updateSearchParams(keyName, val)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {labelMap ? labelMap[opt] || opt : opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tìm kiếm khóa học
          </h1>
          <p className="text-gray-600">
            Khám phá hàng nghìn khóa học chất lượng cao
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm khóa học, giảng viên..."
                defaultValue={searchQuery}
                onChange={(e) => updateSearchParams("search", e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <div className="hidden lg:flex gap-4">
              {renderSelect(
                "Danh mục",
                selectedCategory,
                "category",
                categories
              )}
              {renderSelect(
                "Cấp độ",
                selectedLevel,
                "level",
                LEVELS,
                LEVEL_LABELS
              )}
              {renderSelect(
                "Sắp xếp theo",
                sortBy,
                "sort",
                SORT_OPTIONS.map((o) => o.value),
                Object.fromEntries(SORT_OPTIONS.map((o) => [o.value, o.label]))
              )}
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden relative">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Bộ lọc
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                  <SheetDescription>
                    Tùy chỉnh kết quả tìm kiếm theo ý muốn
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {renderSelect(
                    "Danh mục",
                    selectedCategory,
                    "category",
                    categories
                  )}
                  {renderSelect(
                    "Cấp độ",
                    selectedLevel,
                    "level",
                    LEVELS,
                    LEVEL_LABELS
                  )}
                  {renderSelect(
                    "Sắp xếp theo",
                    sortBy,
                    "sort",
                    SORT_OPTIONS.map((o) => o.value),
                    Object.fromEntries(
                      SORT_OPTIONS.map((o) => [o.value, o.label])
                    )
                  )}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" /> Xóa bộ lọc (
                      {activeFiltersCount})
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Tìm kiếm: {searchQuery}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateSearchParams("search", "")}
                  />
                </Badge>
              )}
              {selectedCategory !== "Tất cả" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Danh mục: {selectedCategory}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateSearchParams("category", "Tất cả")}
                  />
                </Badge>
              )}

              {selectedLevel !== "Tất cả" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Cấp độ:{" "}
                  {LEVEL_LABELS[selectedLevel as CourseLevel] ?? selectedLevel}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateSearchParams("level", "Tất cả")}
                  />
                </Badge>
              )}
            </div>
          )}
        </section>

        <section className="mb-6">
          <p className="text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold">{filteredCourses.length}</span> khóa
            học
          </p>
        </section>

        <section>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy khóa học
              </h3>
              <p className="text-gray-500 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
