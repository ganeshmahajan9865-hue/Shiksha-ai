import { NextRequest, NextResponse } from "next/server";
import { generateDiagnosticQuiz, evaluateDiagnosticQuiz } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, topic, classLevel, language } = body;

    if (!action || !topic || !classLevel || !language) {
      return NextResponse.json(
        { error: "action, topic, classLevel, and language are required" },
        { status: 400 }
      );
    }

    if (action === "generate") {
      const questions = await generateDiagnosticQuiz(topic, classLevel, language);
      return NextResponse.json({ questions });
    } else if (action === "evaluate") {
      const { quizData, studentAnswers } = body;
      if (!quizData || !studentAnswers) {
        return NextResponse.json(
          { error: "quizData and studentAnswers are required for evaluation" },
          { status: 400 }
        );
      }
      const evaluation = await evaluateDiagnosticQuiz(topic, classLevel, language, quizData, studentAnswers);
      return NextResponse.json(evaluation);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("Learning Path API error:", error);
    const message = error instanceof Error ? error.message : "AI service error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
