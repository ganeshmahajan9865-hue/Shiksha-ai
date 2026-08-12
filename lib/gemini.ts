import { GoogleGenAI } from "@google/genai";

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.API_Key ||
  process.env.API_KEY ||
  "";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({ apiKey });

const MODEL = "gemini-3.6-flash";

async function generateWithRetry(prompt: string) {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

      return response;
    } catch (error: any) {
      const status = error?.status ?? error?.code;

      console.error(
        `Gemini request failed. Attempt ${attempt + 1}/${maxRetries}`,
        error
      );

      // Retry temporary service errors
      if (
        (status === 503 ||
          status === 429 ||
          error?.message?.includes("high demand") ||
          error?.message?.includes("UNAVAILABLE")) &&
        attempt < maxRetries - 1
      ) {
        const delay = 1000 * Math.pow(2, attempt);

        console.log(`Retrying Gemini in ${delay}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delay));

        continue;
      }

      throw error;
    }
  }

  throw new Error("Gemini service is temporarily unavailable");
}

function cleanJson(text: string) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

export async function generateExplanation(
  question: string,
  classLevel: string,
  language: string
): Promise<{
  explanation: string;
  example: string;
  analogy: string;
  practice_question: string;
  topic: string;
}> {
  const prompt = `You are ShikshaAI, a friendly and encouraging tutor for Class ${classLevel} Indian school students.

A student has asked:
"${question}"

Respond ENTIRELY in ${language}.

Use simple, age-appropriate language suitable for Class ${classLevel}.

Return ONLY a valid JSON object with these exact keys:

{
  "topic": "the main topic name in one line",
  "explanation": "a clear, simple explanation in 3-4 sentences",
  "example": "one real-world or relatable example that a Class ${classLevel} student in India would understand",
  "analogy": "a creative analogy or visual description to make this concept stick",
  "practice_question": "one simple practice question to test understanding (not multiple choice)"
}`;

  const response = await generateWithRetry(prompt);

  const text = response.text ?? "";
  const cleaned = cleanJson(text);

  return JSON.parse(cleaned);
}

export async function generateQuiz(
  topic: string,
  classLevel: string,
  language: string
): Promise<
  Array<{
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  }>
> {
  const prompt = `You are ShikshaAI.

Generate a quiz for Class ${classLevel} students about "${topic}".

Respond ENTIRELY in ${language}.

Return ONLY a valid JSON array of exactly 5 multiple choice questions.

Each question object must have:

{
  "question": "the question text",
  "options": ["option A", "option B", "option C", "option D"],
  "correct_answer": 0,
  "explanation": "brief explanation of why the answer is correct"
}

The "correct_answer" field must be the index (0, 1, 2, or 3) of the correct option.

Make sure questions are appropriate for Class ${classLevel} Indian school curriculum.`;

  const response = await generateWithRetry(prompt);

  const text = response.text ?? "";
  const cleaned = cleanJson(text);

  return JSON.parse(cleaned);
}

export async function generateDiagnosticQuiz(
  topic: string,
  classLevel: string,
  language: string
): Promise<
  Array<{
    question: string;
    options: string[];
    correct_answer: number;
    concept: string;
  }>
> {
  const prompt = `You are ShikshaAI.

Generate a short diagnostic quiz of exactly 3 multiple choice questions for Class ${classLevel} students about "${topic}".

Respond ENTIRELY in ${language}.

Return ONLY a valid JSON array of exactly 3 questions.

Each question must test a specific sub-concept or skill of "${topic}".

JSON structure:

{
  "question": "the question text",
  "options": ["A", "B", "C", "D"],
  "correct_answer": 0,
  "concept": "the specific sub-concept tested"
}`;

  const response = await generateWithRetry(prompt);

  const text = response.text ?? "";
  const cleaned = cleanJson(text);

  return JSON.parse(cleaned);
}

export async function evaluateDiagnosticQuiz(
  topic: string,
  classLevel: string,
  language: string,
  quizData: Array<{
    question: string;
    concept: string;
    correct_answer: number;
  }>,
  studentAnswers: number[]
): Promise<{
  level: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    title: string;
    desc: string;
    type: string;
    param: string;
  }>;
}> {
  const prompt = `You are ShikshaAI.

Evaluate a Class ${classLevel} student's diagnostic test on "${topic}".

Here are the questions, concepts they tested, and the student's choices:

${JSON.stringify(
  quizData.map((q, idx) => ({
    question: q.question,
    concept: q.concept,
    correct:
      q.correct_answer === studentAnswers[idx]
        ? "Correct"
        : "Incorrect",
  }))
)}

Determine their skill level:

- Basic
- Intermediate
- Advanced

List their strengths and weaknesses and recommend exactly 3 next steps.

Provide the response ENTIRELY in ${language}.

Return ONLY a valid JSON object:

{
  "level": "Basic or Intermediate or Advanced",
  "strengths": ["list of strengths"],
  "weaknesses": ["list of weaknesses"],
  "recommendations": [
    {
      "title": "Short title",
      "desc": "Actionable description on what to do next",
      "type": "learn or quiz",
      "param": "the topic or concept name to pass to tutor/quiz"
    }
  ]
}`;

  const response = await generateWithRetry(prompt);

  const text = response.text ?? "";
  const cleaned = cleanJson(text);

  return JSON.parse(cleaned);
}