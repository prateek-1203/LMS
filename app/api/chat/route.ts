import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Fetch course titles from DB
    const courses = await db.course.findMany({
      where: { isPublished: true },
      select: { title: true },
    });

    const courseList = courses.length > 0
      ? courses.map((c, i) => `${i + 1}. ${c.title}`).join("\n")
      : "No published courses available at the moment.";

    //  System Prompt with actual LMS context
    const messages = [
      {
        role: "system",
        content: `
You are an AI assistant built into a real Learning Management System (LMS).

Your job is to assist users only with LMS-specific features and information.

### LMS Features:
- Authentication (via Clerk)
- Course Creation (title, description, image, price, category, attachments)
- Chapter Creation (with videos using Mux)
- Course & Chapter Editing and Publishing
- Video Player with HLS Support
- Reordering Chapters
- Chapter Progress Tracking
- Stripe-based Payment Integration
- Student Dashboard
- Teacher Analytics Dashboard
- Student Review System
- Ask AI Assistant (You)

### Available Courses:
${courseList}

❗ DO NOT mention or invent any features like quizzes, certifications, assignments, or exams unless they are listed above.

Only reply based on the context and data provided above. Be short, friendly, and helpful in tone.
`.trim(),
      },
      {
        role: "user",
        content: prompt,
      },
    ];

//   Call OpenRouter API
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-lms-domain.com", // update with real domain
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free", // or other supported model
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

