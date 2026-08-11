import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { student_id, topic, subject, score, total, language } = body;

    const { data, error } = await supabase.from("progress").insert([
      {
        student_id,
        topic,
        subject,
        score,
        total,
        language,
        completed_at: new Date().toISOString(),
      },
    ]).select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");

    if (!studentId) {
      return NextResponse.json({ error: "student_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("student_id", studentId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
