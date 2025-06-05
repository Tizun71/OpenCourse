"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Users,
  BookOpen,
  Code,
  Award,
  Calendar,
  Mic,
  ChevronRight,
  Globe,
  CheckCircle,
  Briefcase,
  Monitor,
  Brush,
  Microscope,
  Calculator,
} from "lucide-react";

import FeatureCourse from "./FeatureCourse";
import HomepageHeroSection from "@/app/components/user/HomepageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const categories = [
    {
      label: "Lập trình",
      icon: Code,
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      label: "Ngoại ngữ",
      icon: Globe,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Thiết kế",
      icon: Brush,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      label: "Kỹ năng mềm",
      icon: BookOpen,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Toán học",
      icon: Calculator,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Khoa học",
      icon: Microscope,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const CategorySearch = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/course?category=" + category.label)}
            >
              <CardContent className="p-6">
                <div
                  className={`${category.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-8 h-8 ${category.iconColor}`} />
                </div>
                <h3 className="font-semibold">{category.label}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <HomepageHeroSection />

      {/* Featured Courses */}
      <section className="py-16 bg-white p-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            DANH MỤC KHÓA HỌC
          </h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Khám phá đa dạng các lĩnh vực học tập để phát triển kỹ năng và mở
            rộng kiến thức của bạn
          </p>
        </div>

        <div className="">{CategorySearch()}</div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              <span className="relative">
                Khóa học mới nhất
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-cyan-500"></span>
              </span>
            </h2>
            <Button
              onClick={() => router.push("/course")}
              variant="outline"
              className="hidden md:flex items-center gap-2"
            >
              Xem tất cả <ChevronRight size={16} />
            </Button>
          </div>
          <FeatureCourse />
          <div className="flex justify-center mt-8 md:hidden">
            <Button variant="outline" className="flex items-center gap-2">
              Xem tất cả <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 w-full">
                <Image
                  src="/study.png"
                  alt="Khóa học chuyên nghiệp"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full">
                      CHƯƠNG TRÌNH ĐÀO TẠO
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  KHÓA HỌC CHUYÊN NGHIỆP
                </h3>
                <p className="text-gray-600 mb-6">
                  Nền tảng đào tạo hàng đầu với đa dạng khóa học từ lập trình,
                  thiết kế, kinh doanh đến AI và blockchain. Chương trình của
                  chúng tôi được công nhận bởi các nhà tuyển dụng hàng đầu, giúp
                  học viên mở rộng cơ hội nghề nghiệp trong nhiều lĩnh vực.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">50K+</p>
                    <p className="text-gray-600 text-sm">Học viên</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">500+</p>
                    <p className="text-gray-600 text-sm">Khóa học</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Code className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">300+</p>
                    <p className="text-gray-600 text-sm">Dự án thực tế</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 w-full">
                <Image
                  src="/cer.png"
                  alt="Chứng chỉ chuyên nghiệp"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full">
                      CHỨNG CHỈ
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  CHỨNG CHỈ CHUYÊN NGHIỆP
                </h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Globe className="w-5 h-5 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Chứng chỉ được công nhận toàn cầu
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Đa dạng lĩnh vực: IT, Thiết kế, Kinh doanh, AI...
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Briefcase className="w-5 h-5 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Kết nối trực tiếp với mạng lưới nhà tuyển dụng
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Monitor className="w-5 h-5 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Học linh hoạt - Chứng chỉ uy tín
                    </span>
                  </li>
                </ul>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Award className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">100+</p>
                    <p className="text-gray-600 text-sm">Kỳ thi</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">25K+</p>
                    <p className="text-gray-600 text-sm">Thí sinh</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">95%</p>
                    <p className="text-gray-600 text-sm">Tỷ lệ đậu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full mb-4 inline-block">
                  SỰ KIỆN
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  SỰ KIỆN & HỘI THẢO
                </h3>
                <p className="text-gray-600 mb-8">
                  Thành công tổ chức các sự kiện giáo dục và công nghệ hàng đầu
                  khu vực, tạo ra không gian để học viên kết nối với chuyên gia,
                  doanh nghiệp và cộng đồng trong nhiều lĩnh vực khác nhau.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-8 h-8 text-cyan-500 mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">50K+</p>
                    <p className="text-gray-600 text-sm text-center">
                      Người tham dự
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Globe className="w-8 h-8 text-cyan-500 mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">500K+</p>
                    <p className="text-gray-600 text-sm text-center">
                      Lượt tiếp cận trực tuyến
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Mic className="w-8 h-8 text-cyan-500 mb-2" />
                    <p className="text-3xl font-bold text-cyan-600">300+</p>
                    <p className="text-gray-600 text-sm text-center">
                      Diễn giả
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <Image
                  src="/seminar.png"
                  alt="Sự kiện giáo dục"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-cyan-500" />
                    <div>
                      <p className="text-xs text-gray-500">Sự kiện sắp tới</p>
                      <p className="font-semibold">
                        Hội thảo Công nghệ & Giáo dục 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình học tập của bạn?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hơn 50,000 học viên đã thành công và mở ra cơ hội nghề
            nghiệp mới trong nhiều lĩnh vực khác nhau
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="font-semibold">
              Khám phá khóa học
            </Button>
            <Button
              size="lg"
              className="bg-white text-cyan-700 hover:bg-gray-100 font-semibold"
            >
              Đăng ký tư vấn
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default dynamic(() => Promise.resolve(HomePage), { ssr: false });
