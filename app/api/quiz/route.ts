import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { topic, classLevel, language } = await req.json();

    if (!topic || !classLevel || !language) {
      return NextResponse.json(
        { error: "topic, classLevel, and language are required" },
        { status: 400 }
      );
    }

    const questions = await generateQuiz(topic, classLevel, language);
    return NextResponse.json({ questions, topic, language });
  } catch (error: unknown) {
    console.error("Quiz API error:", error);
    const message = error instanceof Error ? error.message : "AI service error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
