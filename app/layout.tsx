import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ShikshaAI — Your AI Learning Companion",
  description:
    "Personalized, multilingual AI tutoring for Indian school students (Class 6–10). Learn concepts, practice quizzes, and track your progress in English, Hindi, or Marathi.",
  keywords: "AI tutor, multilingual learning, school students, India, Gemini AI, personalized education",
  openGraph: {
    title: "ShikshaAI",
    description: "AI-powered learning for every student, in every language.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="page-wrapper">{children}</div>
      </body>
    </html>
  );
}
