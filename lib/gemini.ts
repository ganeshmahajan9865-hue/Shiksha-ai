import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateExplanation(
  question: string,
  classLevel: string,
  language: string
): Promise<{ explanation: string; example: string; analogy: string; practice_question: string; topic: string }> {
  const prompt = `You are ShikshaAI, a friendly and encouraging tutor for Class ${classLevel} Indian school students.

A student has asked: "${question}"

Respond ENTIRELY in ${language}. Use simple, age-appropriate language suitable for Class ${classLevel}.

Return your response as a valid JSON object (no markdown, no code fences) with these exact keys:
{
  "topic": "the main topic name in one line",
  "explanation": "a clear, simple explanation in 3-4 sentences",
  "example": "one real-world or relatable example that a Class ${classLevel} student in India would understand",
  "analogy": "a creative analogy or visual description to make this concept stick",
  "practice_question": "one simple practice question to test understanding (not multiple choice)"
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text ?? "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateQuiz(
  topic: string,
  classLevel: string,
  language: string
): Promise<Array<{ question: string; options: string[]; correct_answer: number; explanation: string }>> {
  const prompt = `You are ShikshaAI. Generate a quiz for Class ${classLevel} students about "${topic}".

Respond ENTIRELY in ${language}. Return ONLY a valid JSON array (no markdown, no code fences) of exactly 5 multiple choice questions.

Each question object must have:
{
  "question": "the question text",
  "options": ["option A", "option B", "option C", "option D"],
  "correct_answer": 0,
  "explanation": "brief explanation of why the answer is correct"
}

The "correct_answer" field must be the index (0, 1, 2, or 3) of the correct option in the "options" array.
Make sure questions are appropriate for Class ${classLevel} Indian school curriculum.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text ?? "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
