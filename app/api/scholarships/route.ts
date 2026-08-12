import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.API_Key || process.env.API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { studentProfile, query, language } = await req.json();

    const classLevel = studentProfile?.class_level || "8";
    const prefLanguage = language || "English";

    const prompt = `You are ShikshaAI Scholarship Finder. Help a Class ${classLevel} student in India find scholarships they are eligible for.

Here is the student's profile details:
${JSON.stringify(studentProfile || {})}

Additional student details/search query: "${query || "List all matching scholarships for me."}"

Match their profile against major government and private school scholarships in India (e.g. National Means Cum Merit Scholarship (NMMSS), Pre-Matric Minority Scholarship, Vidyasaarathi, HDFC Parivartan, PM Yasasvi, etc.).

Select 2-3 of the best matching scholarships. For each, explain:
1. Eligibility Criteria
2. Award Benefits/Amount
3. Required Documents
4. Application Steps
5. Tentative Deadlines

Provide your response ENTIRELY in ${prefLanguage}. Return ONLY a valid JSON object (no markdown, no code fences):
{
  "matches": [
    {
      "name": "Full Scholarship Name",
      "award": "e.g. ₹12,000 per year",
      "eligibility": "clear list of eligibility requirements",
      "documents": ["list", "of", "required", "documents"],
      "application_steps": ["step 1", "step 2", "step 3"],
      "deadline": "tentative deadline description"
    }
  ],
  "advice": "General advice or encouraging comments on what documents they should prepare first."
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text ?? "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return NextResponse.json(JSON.parse(cleaned));
  } catch (error: unknown) {
    console.error("Scholarship API error:", error);
    const message = error instanceof Error ? error.message : "AI service error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
