"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./tutor.css";

interface Message {
  role: "user" | "assistant";
  content: string | TutorResponse;
  timestamp: Date;
}

interface TutorResponse {
  topic: string;
  explanation: string;
  example: string;
  analogy: string;
  practice_question: string;
}

interface StudentProfile {
  name: string;
  class_level: string;
  preferred_language: string;
}

const SUGGESTED_QUESTIONS = [
  "What is photosynthesis?",
  "Explain Newton's Third Law",
  "What is the water cycle?",
  "What is the Pythagoras theorem?",
  "What caused World War 2?",
];

export default function TutorPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("shiksha_profile");
    if (stored) {
      const p = JSON.parse(stored);
      setProfile(p);
      setLanguage(p.preferred_language || "English");
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          classLevel: profile?.class_level || "8",
          language,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCurrentTopic(data.topic);
      setMessages((prev) => [...prev, { role: "assistant", content: data, timestamp: new Date() }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: { topic: "Error", explanation: "Sorry, I couldn't process your request. Please try again.", example: "", analogy: "", practice_question: "" },
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <main className="tutor-page">
      {/* Sidebar */}
      <aside className="tutor-sidebar">
        <div className="sidebar-profile">
          {profile ? (
            <>
              <div className="profile-avatar">{profile.name?.[0]?.toUpperCase() || "S"}</div>
              <div className="profile-info">
                <div className="profile-name">{profile.name}</div>
                <div className="profile-meta">Class {profile.class_level}</div>
              </div>
            </>
          ) : (
            <Link href="/onboarding" className="btn btn-primary btn-sm">Setup Profile</Link>
          )}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Language</div>
          <select
            id="language-select"
            className="input-field"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">🇬🇧 English</option>
            <option value="Hindi">🇮🇳 Hindi</option>
            <option value="Marathi">🟠 Marathi</option>
          </select>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Try asking…</div>
          <div className="suggested-list">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                className="suggested-q"
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {currentTopic && (
          <div className="sidebar-section">
            <div className="sidebar-label">Current Topic</div>
            <div className="current-topic-chip">
              <span>📖</span>
              <span>{currentTopic}</span>
            </div>
            <Link
              href={`/quiz?topic=${encodeURIComponent(currentTopic)}&lang=${encodeURIComponent(language)}&class=${profile?.class_level || "8"}`}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 10, width: "100%" }}
            >
              📝 Quiz on this topic →
            </Link>
          </div>
        )}
      </aside>

      {/* Chat area */}
      <div className="tutor-chat">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-ai-avatar">🤖</div>
            <div>
              <div className="chat-ai-name">ShikshaAI Tutor</div>
              <div className="chat-ai-status"><span className="status-dot" style={{ width:7, height:7, background:"var(--success)", borderRadius:"50%", display:"inline-block", animation:"pulse 2s infinite" }} /> Always ready to help</div>
            </div>
          </div>
          <span className="badge badge-primary">Class {profile?.class_level || "?"} • {language}</span>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="chat-empty-icon">🎓</div>
              <h2>Hello{profile ? `, ${profile.name}` : ""}!</h2>
              <p>Ask me anything about your syllabus. I'll explain it clearly with examples and a practice question.</p>
              <div className="chat-empty-suggestions">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                  <button key={i} className="suggested-q" onClick={() => setInput(q)}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message-wrapper ${msg.role}`}>
              {msg.role === "user" ? (
                <div className="user-message">{msg.content as string}</div>
              ) : (
                <div className="ai-message">
                  {typeof msg.content === "object" && (
                    <div className="ai-response-cards">
                      <div className="response-topic-label">📚 {(msg.content as TutorResponse).topic}</div>
                      <div className="response-card explanation-card">
                        <div className="rc-header"><span className="rc-icon">💡</span> Explanation</div>
                        <p>{(msg.content as TutorResponse).explanation}</p>
                      </div>
                      {(msg.content as TutorResponse).example && (
                        <div className="response-card example-card">
                          <div className="rc-header"><span className="rc-icon">🌿</span> Example</div>
                          <p>{(msg.content as TutorResponse).example}</p>
                        </div>
                      )}
                      {(msg.content as TutorResponse).analogy && (
                        <div className="response-card analogy-card">
                          <div className="rc-header"><span className="rc-icon">🎨</span> Analogy</div>
                          <p>{(msg.content as TutorResponse).analogy}</p>
                        </div>
                      )}
                      {(msg.content as TutorResponse).practice_question && (
                        <div className="response-card practice-card">
                          <div className="rc-header"><span className="rc-icon">✏️</span> Practice</div>
                          <p>{(msg.content as TutorResponse).practice_question}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message-wrapper assistant">
              <div className="ai-message">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
                <span className="typing-label">ShikshaAI is thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            id="chat-input"
            className="input-field chat-textarea"
            placeholder={`Ask anything in ${language}… (Press Enter to send)`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <button
            id="send-btn"
            className="btn btn-primary send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : "✦ Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
