"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./learning-path.css";

interface DiagnosticQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  concept: string;
}

interface PathRecommendation {
  title: string;
  desc: string;
  type: string;
  param: string;
}

interface EvaluationResult {
  level: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: PathRecommendation[];
}

const TOPICS = {
  Science: [
    "Force and Pressure",
    "Cell Structure and Functions",
    "Light and Reflection",
    "Chemical Effects of Electric Current",
    "Metals and Non-metals",
  ],
  Mathematics: [
    "Rational Numbers",
    "Linear Equations in One Variable",
    "Understanding Quadrilaterals",
    "Trigonometry Basics",
    "Algebraic Expressions",
  ],
};

export default function LearningPathPage() {
  const [profile, setProfile] = useState<{ name: string; class_level: string; preferred_language: string; id: string } | null>(null);
  const [subject, setSubject] = useState<"Science" | "Mathematics">("Science");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("shiksha_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const selectedTopic = topic === "custom" ? customTopic : topic;

  const startDiagnostic = async () => {
    if (!selectedTopic.trim()) return;
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setEvalResult(null);

    try {
      const res = await fetch("/api/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          topic: selectedTopic,
          classLevel: profile?.class_level || "8",
          language: profile?.preferred_language || "English",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.questions);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load diagnostic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (idx: number) => {
    setSelected(idx);
  };

  const nextQuestion = () => {
    if (selected === null) return;
    const updatedAnswers = [...answers, selected];
    setAnswers(updatedAnswers);
    setSelected(null);

    if (current + 1 >= questions.length) {
      evaluateResults(updatedAnswers);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const evaluateResults = async (finalAnswers: number[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          topic: selectedTopic,
          classLevel: profile?.class_level || "8",
          language: profile?.preferred_language || "English",
          quizData: questions,
          studentAnswers: finalAnswers,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEvalResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to evaluate results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="lp-page">
      <div className="lp-container">
        
        {/* Step 1: Selection Form */}
        {questions.length === 0 && !loading && !evalResult && (
          <div className="lp-setup card card-glow">
            <div className="lp-icon-header">🛣️</div>
            <h1 className="lp-title">AI Learning Path</h1>
            <p className="lp-subtitle">
              Diagnose your gaps and get a step-by-step personalized roadmap to master any topic.
            </p>

            <div className="lp-form">
              <div className="lp-form-row">
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <select
                    className="input-field"
                    value={subject}
                    onChange={(e) => {
                      const val = e.target.value as "Science" | "Mathematics";
                      setSubject(val);
                      setTopic("");
                    }}
                  >
                    <option value="Science">🔬 Science</option>
                    <option value="Mathematics">📐 Mathematics</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Topic</label>
                  <select
                    className="input-field"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="">-- Select a Topic --</option>
                    {TOPICS[subject].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="custom">✏️ Enter Custom Topic</option>
                  </select>
                </div>
              </div>

              {topic === "custom" && (
                <div className="input-group">
                  <label className="input-label">Custom Topic Name</label>
                  <input
                    className="input-field"
                    placeholder="Enter any topic from your school syllabus..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                  />
                </div>
              )}

              {error && <div className="alert alert-error">{error}</div>}

              <button
                className="btn btn-primary btn-lg"
                style={{ width: "100%", marginTop: 12 }}
                disabled={!selectedTopic.trim()}
                onClick={startDiagnostic}
              >
                Start Diagnostic Quiz →
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="lp-loading card">
            <div className="spinner" style={{ width: 42, height: 42 }} />
            <h2>{evalResult ? "Analyzing quiz results…" : "Generating custom diagnostic quiz…"}</h2>
            <p>Evaluating concepts against Class {profile?.class_level || "8"} standards…</p>
          </div>
        )}

        {/* Step 2: Diagnostic Quiz */}
        {questions.length > 0 && !evalResult && !loading && (
          <div className="lp-quiz card">
            <div className="lp-quiz-header">
              <span className="badge badge-primary">⚡ Diagnostic Test: {selectedTopic}</span>
              <span className="badge badge-primary">Q {current + 1} / {questions.length}</span>
            </div>

            <div className="progress-bar-track" style={{ margin: "12px 0 28px" }}>
              <div className="progress-bar-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
            </div>

            <h2 className="lp-question">{questions[current].question}</h2>
            
            <div className="lp-options">
              {questions[current].options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`lp-option ${selected === idx ? "selected" : ""}`}
                  onClick={() => selectOption(idx)}
                >
                  <span className="lp-option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                disabled={selected === null}
                onClick={nextQuestion}
              >
                {current + 1 >= questions.length ? "Finish & Evaluate 🎉" : "Next Question →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Learning Path Roadmap */}
        {evalResult && !loading && (
          <div className="lp-roadmap-view">
            <div className="roadmap-header card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h1 className="lp-title">Your Learning Path</h1>
                  <p className="lp-subtitle" style={{ marginTop: 4 }}>
                    Roadmap for: <strong>{selectedTopic}</strong>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="badge badge-warning" style={{ fontSize: "0.9rem", padding: "6px 14px" }}>
                    Level: {evalResult.level}
                  </span>
                </div>
              </div>

              <div className="diagnostics-summary">
                <div className="summary-block strengths-block">
                  <h3>✅ Strengths</h3>
                  <ul>
                    {evalResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    {evalResult.strengths.length === 0 && <li>Good foundation in the topic</li>}
                  </ul>
                </div>
                <div className="summary-block weaknesses-block">
                  <h3>🎯 Focus Areas</h3>
                  <ul>
                    {evalResult.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    {evalResult.weaknesses.length === 0 && <li>No specific weak areas found</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline nodes */}
            <div className="roadmap-timeline">
              <h2 className="timeline-title">🎯 Recommended Steps</h2>
              <div className="timeline-nodes">
                {evalResult.recommendations.map((rec, idx) => (
                  <div key={idx} className="timeline-node card">
                    <div className="node-number">{idx + 1}</div>
                    <div className="node-content">
                      <div className="node-badge-row">
                        <span className={`badge ${rec.type === "learn" ? "badge-primary" : "badge-success"}`}>
                          {rec.type === "learn" ? "💡 Learn" : "📝 Practice"}
                        </span>
                      </div>
                      <h3 className="node-title">{rec.title}</h3>
                      <p className="node-desc">{rec.desc}</p>
                      
                      <div className="node-action">
                        {rec.type === "learn" ? (
                          <Link
                            href={`/tutor?topic=${encodeURIComponent(rec.param || selectedTopic)}`}
                            className="btn btn-primary btn-sm"
                          >
                            Start Lesson 🤖
                          </Link>
                        ) : (
                          <Link
                            href={`/quiz?topic=${encodeURIComponent(rec.param || selectedTopic)}`}
                            className="btn btn-success btn-sm"
                          >
                            Take Quiz 📝
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
              <button
                className="btn btn-secondary"
                onClick={() => { setEvalResult(null); setQuestions([]); setTopic(""); }}
              >
                🔄 Build Another Path
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
