
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Fetch course titles from DB
    const courses = await db.course.findMany({
      select: { title: true },
    });

    const courseNames = courses.map((c, i) => `${i + 1}. ${c.title}`).join("\n");

    const messages = [
      {
        role: "system",
        content: `
You are a smart, friendly AI assistant for a Learning Management System (LMS).

 LMS Context:
- You help users with courses, dashboard, progress, quizzes, and general study help.
- You must **only mention courses from the actual list** below.
- Do NOT make up or assume any course names not present here.

 Available Courses:
${courseNames || "No courses available at the moment."}

If users ask about available courses, show only this list. If they ask about progress, quizzes, or LMS features, guide them clearly.

Be short, helpful, and friendly in responses.
      `.trim(),
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-lms-domain.com", 
      },
      body: JSON.stringify({
        model: "qwen/qwen3-coder:free",
        messages,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chatbot Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

