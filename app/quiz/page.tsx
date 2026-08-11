"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import "./quiz.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicParam = searchParams.get("topic") || "";
  const langParam  = searchParams.get("lang") || "English";
  const classParam = searchParams.get("class") || "8";

  const [topic, setTopic]         = useState(topicParam);
  const [language, setLanguage]   = useState(langParam);
  const [classLevel, setClass]    = useState(classParam);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [answers, setAnswers]     = useState<number[]>([]);
  const [revealed, setRevealed]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [finished, setFinished]   = useState(false);
  const [error, setError]         = useState("");
  const [topicInput, setTopicInput] = useState(topicParam);

  useEffect(() => {
    if (topicParam) startQuiz();
  }, []);

  const startQuiz = async () => {
    const t = topicInput || topic;
    if (!t.trim()) return;
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setFinished(false);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, classLevel, language }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTopic(t);
      setQuestions(data.questions);
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "") || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const confirmAnswer = () => {
    if (selected === null) return;
    setRevealed(true);
    setAnswers((prev) => [...prev, selected]);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      saveProgress();
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const saveProgress = async () => {
    const profile = JSON.parse(localStorage.getItem("shiksha_profile") || "{}");
    if (!profile.id) return;
    const score = answers.filter((a, i) => a === questions[i]?.correct_answer).length;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: profile.id,
        topic,
        subject: "General",
        score,
        total: questions.length,
        language,
      }),
    }).catch(() => {});
  };

  const score = answers.filter((a, i) => a === questions[i]?.correct_answer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (finished) {
    return (
      <div className="quiz-result">
        <div className="result-emoji">{pct >= 80 ? "🌟" : pct >= 60 ? "👍" : "💪"}</div>
        <h2 className="result-title">Quiz Complete!</h2>
        <div className="result-score">
          <span className="result-number" style={{ color: pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--accent)" }}>
            {score}/{questions.length}
          </span>
          <span className="result-pct">{pct}%</span>
        </div>
        <p className="result-message">
          {pct >= 80 ? "Excellent! You really understand this topic!" : pct >= 60 ? "Good job! Keep practising to improve further." : "Keep going! Review the topic and try again."}
        </p>
        <div className="result-breakdown">
          {questions.map((q, i) => (
            <div key={i} className={`result-item ${answers[i] === q.correct_answer ? "correct" : "wrong"}`}>
              <span className="result-item-icon">{answers[i] === q.correct_answer ? "✓" : "✗"}</span>
              <span className="result-item-q">Q{i + 1}: {q.question.substring(0, 60)}…</span>
            </div>
          ))}
        </div>
        <div className="result-actions">
          <button className="btn btn-secondary" onClick={() => { setFinished(false); setTopicInput(topic); startQuiz(); }}>🔄 Try Again</button>
          <Link href="/progress" className="btn btn-primary">📊 View Progress →</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Topic setup */}
      {questions.length === 0 && (
        <div className="quiz-setup">
          <div className="quiz-setup-inner card card-glow">
            <div className="quiz-setup-emoji">📝</div>
            <h1 className="quiz-setup-title">AI Quiz Generator</h1>
            <p className="quiz-setup-subtitle">Enter a topic and I'll generate 5 personalised practice questions.</p>
            <div className="quiz-setup-form">
              <div className="input-group">
                <label className="input-label">Topic</label>
                <input
                  id="quiz-topic-input"
                  className="input-field"
                  placeholder="e.g. Photosynthesis, Newton's Laws, French Revolution…"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startQuiz()}
                />
              </div>
              <div className="quiz-setup-row">
                <div className="input-group">
                  <label className="input-label">Class</label>
                  <select id="quiz-class" className="input-field" value={classLevel} onChange={(e) => setClass(e.target.value)}>
                    {["6","7","8","9","10"].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Language</label>
                  <select id="quiz-lang" className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="English">🇬🇧 English</option>
                    <option value="Hindi">🇮🇳 Hindi</option>
                    <option value="Marathi">🟠 Marathi</option>
                  </select>
                </div>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button
                id="start-quiz-btn"
                className="btn btn-primary btn-lg"
                onClick={startQuiz}
                disabled={!topicInput.trim() || loading}
                style={{ width: "100%" }}
              >
                {loading ? <><div className="spinner" style={{ width:20,height:20 }} /> Generating Quiz…</> : "🚀 Generate Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active quiz */}
      {questions.length > 0 && !finished && (
        <div className="quiz-active">
          <div className="quiz-meta">
            <span className="badge badge-primary">📚 {topic}</span>
            <span className="badge badge-primary">Q {current + 1} / {questions.length}</span>
          </div>
          <div className="progress-bar-track" style={{ margin: "8px 0 28px" }}>
            <div className="progress-bar-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
          </div>

          <div className="quiz-card card">
            <h2 className="quiz-question">{questions[current].question}</h2>
            <div className="quiz-options">
              {questions[current].options.map((opt, idx) => (
                <button
                  key={idx}
                  id={`option-${idx}`}
                  className={`quiz-option ${selected === idx ? "selected" : ""} ${
                    revealed ? (idx === questions[current].correct_answer ? "correct" : selected === idx ? "wrong" : "") : ""
                  }`}
                  onClick={() => selectOption(idx)}
                >
                  <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {revealed && (
              <div className={`quiz-feedback ${selected === questions[current].correct_answer ? "feedback-correct" : "feedback-wrong"}`}>
                <div className="feedback-icon">
                  {selected === questions[current].correct_answer ? "✅ Correct!" : `❌ Incorrect. Correct answer: ${questions[current].options[questions[current].correct_answer]}`}
                </div>
                <div className="feedback-explanation">{questions[current].explanation}</div>
              </div>
            )}

            <div className="quiz-actions">
              {!revealed ? (
                <button id="confirm-answer-btn" className="btn btn-primary" disabled={selected === null} onClick={confirmAnswer}>
                  Confirm Answer
                </button>
              ) : (
                <button id="next-question-btn" className="btn btn-primary" onClick={nextQuestion}>
                  {current + 1 >= questions.length ? "See Results 🎉" : "Next Question →"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function QuizPage() {
  return (
    <main className="quiz-page">
      <Suspense fallback={<div style={{ padding: 40, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>Loading quiz…</div>}>
        <QuizContent />
      </Suspense>
    </main>
  );
}
