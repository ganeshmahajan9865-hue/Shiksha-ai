"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./progress.css";

interface ProgressEntry {
  id: string;
  topic: string;
  subject: string;
  score: number;
  total: number;
  language: string;
  completed_at: string;
}

interface TopicSummary {
  topic: string;
  attempts: number;
  bestScore: number;
  avgPct: number;
  lastAttempt: string;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name: string; id: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("shiksha_profile");
    if (stored) {
      const p = JSON.parse(stored);
      setProfile(p);
      fetchProgress(p.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProgress = async (studentId: string) => {
    try {
      const res = await fetch(`/api/progress?student_id=${studentId}`);
      const data = await res.json();
      setEntries(data.data || []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const topicSummaries: TopicSummary[] = Object.values(
    entries.reduce((acc, e) => {
      if (!acc[e.topic]) {
        acc[e.topic] = { topic: e.topic, attempts: 0, bestScore: 0, totalPct: 0, lastAttempt: e.completed_at };
      }
      const pct = Math.round((e.score / e.total) * 100);
      acc[e.topic].attempts++;
      acc[e.topic].totalPct += pct;
      if (pct > acc[e.topic].bestScore) acc[e.topic].bestScore = pct;
      return acc;
    }, {} as Record<string, { topic: string; attempts: number; bestScore: number; totalPct: number; lastAttempt: string }>)
  ).map((s: { topic: string; attempts: number; bestScore: number; totalPct: number; lastAttempt: string }) => ({
    topic: s.topic,
    attempts: s.attempts,
    bestScore: s.bestScore,
    avgPct: Math.round(s.totalPct / s.attempts),
    lastAttempt: s.lastAttempt,
  }));

  const strong = topicSummaries.filter((t) => t.bestScore >= 80);
  const weak   = topicSummaries.filter((t) => t.bestScore < 60);
  const total  = entries.length;
  const avgScore = total > 0 ? Math.round(entries.reduce((acc, e) => acc + (e.score / e.total) * 100, 0) / total) : 0;

  return (
    <main className="progress-page">
      <div className="progress-container">
        <div className="progress-header">
          <div>
            <h1 className="progress-title">
              {profile ? `${profile.name}'s Progress` : "My Progress"}
            </h1>
            <p className="progress-subtitle">Track your learning journey and see where to improve.</p>
          </div>
          <Link href="/quiz" className="btn btn-primary">📝 Take a Quiz</Link>
        </div>

        {loading ? (
          <div className="progress-loading">
            <div className="spinner" style={{ width: 36, height: 36 }} />
            <span>Loading your progress…</span>
          </div>
        ) : !profile ? (
          <div className="progress-empty">
            <div className="progress-empty-icon">📊</div>
            <h2>Set up your profile first</h2>
            <p>Create your student profile to start tracking progress.</p>
            <Link href="/onboarding" className="btn btn-primary" style={{ marginTop: 16 }}>Set Up Profile →</Link>
          </div>
        ) : entries.length === 0 ? (
          <div className="progress-empty">
            <div className="progress-empty-icon">📚</div>
            <h2>No quizzes yet!</h2>
            <p>Complete your first quiz to see your progress tracked here.</p>
            <Link href="/quiz" className="btn btn-primary" style={{ marginTop: 16 }}>Take Your First Quiz →</Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-card-icon">🎯</div>
                <div className="stat-card-value">{total}</div>
                <div className="stat-card-label">Total Quizzes</div>
              </div>
              <div className="stat-card card">
                <div className="stat-card-icon">⭐</div>
                <div className="stat-card-value" style={{ color: avgScore >= 80 ? "var(--success)" : avgScore >= 60 ? "var(--warning)" : "var(--accent)" }}>
                  {avgScore}%
                </div>
                <div className="stat-card-label">Avg. Score</div>
              </div>
              <div className="stat-card card">
                <div className="stat-card-icon">💪</div>
                <div className="stat-card-value" style={{ color: "var(--success)" }}>{strong.length}</div>
                <div className="stat-card-label">Strong Topics</div>
              </div>
              <div className="stat-card card">
                <div className="stat-card-icon">📖</div>
                <div className="stat-card-value" style={{ color: "var(--accent)" }}>{weak.length}</div>
                <div className="stat-card-label">Needs Work</div>
              </div>
            </div>

            {/* Weak topics */}
            {weak.length > 0 && (
              <div className="topic-section">
                <div className="topic-section-header">
                  <h2 className="topic-section-title">📖 Needs Improvement</h2>
                  <span className="badge badge-accent">Score &lt; 60%</span>
                </div>
                <div className="topic-cards">
                  {weak.map((t, i) => (
                    <div key={i} className="topic-card topic-card-weak card">
                      <div className="topic-card-header">
                        <span className="topic-name">{t.topic}</span>
                        <span className="badge badge-accent">{t.bestScore}% best</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill danger" style={{ width: `${t.bestScore}%` }} />
                      </div>
                      <div className="topic-meta">
                        <span>{t.attempts} attempt{t.attempts > 1 ? "s" : ""}</span>
                        <Link href={`/quiz?topic=${encodeURIComponent(t.topic)}`} className="btn btn-secondary btn-sm">
                          Practice Again →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strong topics */}
            {strong.length > 0 && (
              <div className="topic-section">
                <div className="topic-section-header">
                  <h2 className="topic-section-title">🌟 Strong Topics</h2>
                  <span className="badge badge-success">Score ≥ 80%</span>
                </div>
                <div className="topic-cards">
                  {strong.map((t, i) => (
                    <div key={i} className="topic-card topic-card-strong card">
                      <div className="topic-card-header">
                        <span className="topic-name">{t.topic}</span>
                        <span className="badge badge-success">{t.bestScore}% best</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill success" style={{ width: `${t.bestScore}%` }} />
                      </div>
                      <div className="topic-meta">
                        <span>{t.attempts} attempt{t.attempts > 1 ? "s" : ""}</span>
                        <span className="topic-avg">Avg: {t.avgPct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            <div className="topic-section">
              <h2 className="topic-section-title">📋 Recent Activity</h2>
              <div className="history-table">
                {entries.slice(0, 10).map((e, i) => (
                  <div key={i} className="history-row">
                    <div className="history-topic">{e.topic}</div>
                    <div className="history-lang">
                      <span className="badge badge-primary">{e.language}</span>
                    </div>
                    <div className="history-score">
                      <span className={`history-score-val ${(e.score / e.total) >= 0.8 ? "strong" : (e.score / e.total) >= 0.6 ? "mid" : "weak"}`}>
                        {e.score}/{e.total}
                      </span>
                    </div>
                    <div className="history-date">
                      {new Date(e.completed_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
