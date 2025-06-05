import { commonPrompt } from "@/app/api/chat/template/common";
import { coursePrompt } from "@/app/api/chat/template/course";

export async function callGeminiAPI(message: string): Promise<string> {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
   let res;
  
      const searchKeywords = ["khóa học", "bài học","tìm", "tìm kiếm", "tra cứu", "xem", "cho tôi xem", "lấy thông tin", "muốn biết", "giới thiệu", "cải thiện"];
  
      const messageLower = message.toLowerCase();
  
      const isSearching = searchKeywords.some(keyword => messageLower.includes(keyword));
  
      if (isSearching) {
        const prompt = await coursePrompt(message);
        res = await fetch(GEMINI_URL, prompt);
      } else {
        res = await fetch(GEMINI_URL, commonPrompt(message));
      }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || 'Không nhận được phản hồi từ Gemini.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Đã xảy ra lỗi khi gửi yêu cầu đến Gemini.';
  }
}
