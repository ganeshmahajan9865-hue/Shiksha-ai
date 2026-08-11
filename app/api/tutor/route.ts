import { NextRequest, NextResponse } from "next/server";
import { generateExplanation } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question, classLevel, language } = await req.json();

    if (!question || !classLevel || !language) {
      return NextResponse.json(
        { error: "question, classLevel, and language are required" },
        { status: 400 }
      );
    }

    const result = await generateExplanation(question, classLevel, language);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Tutor API error:", error);
    const message = error instanceof Error ? error.message : "AI service error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
