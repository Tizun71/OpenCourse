import { listPublisedCourses } from "@/services/course-service";
import { toast } from "sonner";

const assistantSystemPrompt = `Bạn là một trợ lý học tập thông minh.
Nhiệm vụ của bạn là giúp người học tìm kiếm và chọn lựa các khóa học phù hợp với mục tiêu học tập của họ.
Bạn chỉ trả lời dựa trên danh sách khóa học sau:`;

async function createPrompt(question: string) {
  let userPrompt = 'Dưới đây là danh sách các khóa học hiện có trong hệ thống của bạn: ';

  try {
    const courseResponse = await listPublisedCourses({ keyword: "" });

    if (courseResponse?.data?.courses?.length > 0) {
      userPrompt += courseResponse.data.courses
        .map((course: any) => 
          `ID: ${course.id}. ${course.courseName} ,Trình độ: ${course.courseLevel}, Danh mục: ${course.categoryName}, Số người học:${course.numberOfRegister}`
        )
        .join(' ');
    } else {
      userPrompt += 'Hiện tại chưa có khóa học nào được xuất bản.';
    }
  } catch (error) {
    toast.error('Lỗi: ' + error)
    console.error('CourseService error:', error);
    userPrompt = 'Hiện tại tôi không thể truy xuất danh sách khóa học. Bạn có thể thử lại sau hoặc liên hệ hỗ trợ.';
  }

  const fullPrompt = `${assistantSystemPrompt} ${userPrompt} 
- Nếu không có thông tin, hãy nói rằng bạn không chắc chắn và khuyên người dùng liên hệ hỗ trợ. 
- Không tự bịa ra bất kỳ thông tin khóa học nào. 
- Khi tôi hỏi thì bạn phải chắc chắn đưa ra một và chỉ một khóa học từ danh sách các khóa học hiện có cho tôi sao cho phù hợp với tôi nhất và không được hỏi lại.
- Khi trả về thì trả về dạng như sau: Giới thiệu về khóa học (chỉ hiện tên của khóa học và lý do bạn chọn khóa học này cho tôi) và đường dẫn của khóa học đó http://localhost:3000/course/id
`;

  return {
    contents: [
      {
        parts: [{ text: fullPrompt + question }]
      }
    ]
  };
}

export const coursePrompt = async (question: string) => {
  const promptData = await createPrompt(question);
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  };
};
