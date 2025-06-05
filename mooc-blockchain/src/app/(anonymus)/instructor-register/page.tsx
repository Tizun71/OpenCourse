import InstructorRegisterForm from "@/components/organism/Form/InstructorRegisterForm";

export default function InstructorRegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng Ký Làm Giảng Viên với OpenCourse
          </h1>
          <p className="mt-3 text-gray-600">
            Chia sẻ kiến thức của bạn với hàng ngàn học viên trên nền tảng học
            trực tuyến của chúng tôi
          </p>
        </div>
        <InstructorRegisterForm />
      </div>
    </main>
  );
}
