import { NextRequest, NextResponse } from 'next/server';
import { coursePrompt } from './template/course';
import { commonPrompt } from './template/common';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Thiếu message của user' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY chưa được cấu hình' }, { status: 500 });
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

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

    if (!res.ok) {
      throw new Error(`Gemini API responded with status ${res.status}`);
    }

    const data = await res.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      return NextResponse.json({
        reply: 'Lỗi API Key.\n'
      }, { status: 200 });
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Lỗi Server', details: error.message },
      { status: 500 }
    );
  }
}