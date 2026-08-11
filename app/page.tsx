import Link from "next/link";
import type { Metadata } from "next";
import "./landing.css";

export const metadata: Metadata = {
  title: "ShikshaAI — AI-Powered Multilingual Learning for Indian Students",
  description:
    "Free AI tutor for Class 6–10 students. Get personalized explanations, practice quizzes, and track your progress in English, Hindi, or Marathi.",
};

const features = [
  {
    icon: "🤖",
    title: "AI Tutor",
    desc: "Ask any question and get a clear, step-by-step explanation tailored to your class level — in your language.",
    color: "var(--primary)",
  },
  {
    icon: "📖",
    title: "Concept Explainer",
    desc: "Every answer follows: Explanation → Example → Analogy → Practice. You actually understand, not just memorize.",
    color: "#9b93ff",
  },
  {
    icon: "📝",
    title: "AI Quiz",
    desc: "Generate a 5-question quiz on any topic. Get instant feedback and explanations for every answer.",
    color: "var(--success)",
  },
  {
    icon: "📊",
    title: "Progress Tracker",
    desc: "See your strong and weak topics at a glance. Track your improvement over every session.",
    color: "var(--warning)",
  },
  {
    icon: "🌐",
    title: "Multilingual",
    desc: "Study in English, Hindi, or Marathi. ShikshaAI responds in the language you're most comfortable with.",
    color: "var(--accent)",
  },
  {
    icon: "🎯",
    title: "Level-Appropriate",
    desc: "From Class 6 to Class 10 — explanations are always calibrated to your exact class level.",
    color: "#ff9de0",
  },
];

const subjects = ["📐 Maths", "🔬 Science", "📜 History", "🌍 Geography", "📗 English", "💻 Computer"];

export default function LandingPage() {
  return (
    <main className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge badge-primary">✨ AI-Powered Learning</span>
            <span className="badge badge-primary">🇮🇳 Made for India</span>
          </div>

          <h1 className="hero-title">
            Your Personal AI Tutor,<br />
            <span className="gradient-text">In Your Language</span>
          </h1>

          <p className="hero-subtitle">
            ShikshaAI gives every Class 6–10 student access to personalized, one-on-one learning support —
            in English, Hindi, or Marathi. Ask anything. Understand everything.
          </p>

          <div className="hero-cta-group">
            <Link href="/onboarding" className="btn btn-primary btn-lg">
              🚀 Start Learning Free
            </Link>
            <Link href="/tutor" className="btn btn-ghost btn-lg">
              Try AI Tutor →
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number gradient-text">5</span>
              <span className="stat-label">Core Features</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number gradient-text">3</span>
              <span className="stat-label">Languages</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number gradient-text">6</span>
              <span className="stat-label">Subjects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number gradient-text">Class 6–10</span>
              <span className="stat-label">Students</span>
            </div>
          </div>
        </div>

        {/* Hero Demo Card */}
        <div className="hero-demo">
          <div className="demo-card card card-glow">
            <div className="demo-header">
              <div className="demo-avatar">🤖</div>
              <div>
                <div className="demo-name">ShikshaAI</div>
                <div className="demo-status">
                  <span className="status-dot" /> Online
                </div>
              </div>
              <span className="badge badge-success" style={{ marginLeft: "auto" }}>Live</span>
            </div>
            <div className="demo-messages">
              <div className="demo-msg user">प्रकाश संश्लेषण क्या है? (Class 8)</div>
              <div className="demo-msg ai">
                <strong>📖 Explanation:</strong><br />
                प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे सूर्य के प्रकाश की सहायता से पानी और CO₂ से अपना भोजन बनाते हैं।
                <br /><br />
                <strong>🌿 Example:</strong> आपके घर का पौधा धूप में रखने पर बढ़ता है क्योंकि वह भोजन बना रहा है।
                <br /><br />
                <strong>🎯 Practice:</strong> प्रकाश संश्लेषण के लिए कौन सी तीन चीज़ें ज़रूरी हैं?
              </div>
            </div>
            <div className="demo-footer">
              <div className="demo-input-bar">
                <span>Ask in Hindi, Marathi, or English…</span>
                <button className="btn btn-primary btn-sm">Send ✦</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-tag">⚡ How It Works</div>
          <h2 className="section-title">
            Learning that actually <span className="gradient-text">sticks</span>
          </h2>
          <p className="section-subtitle">
            ShikshaAI doesn't just give answers — it guides you through a proven 4-step learning loop.
          </p>
          <div className="flow-steps">
            {[
              { step: "01", icon: "❓", label: "Ask a Question", desc: "In any language, on any topic from your syllabus" },
              { step: "02", icon: "💡", label: "Get Explanation", desc: "Simple, class-level appropriate answer + real example" },
              { step: "03", icon: "🧩", label: "See an Analogy", desc: "Creative visual or analogy to make the concept memorable" },
              { step: "04", icon: "✅", label: "Practice & Track", desc: "AI quiz + instant feedback + progress saved automatically" },
            ].map((item, i) => (
              <div key={i} className="flow-step">
                <div className="flow-step-num">{item.step}</div>
                <div className="flow-step-icon">{item.icon}</div>
                <div className="flow-step-label">{item.label}</div>
                <div className="flow-step-desc">{item.desc}</div>
                {i < 3 && <div className="flow-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-tag">🚀 Features</div>
          <h2 className="section-title">Everything you need to <span className="gradient-text">excel</span></h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon" style={{ color: f.color }}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="subjects-section">
        <div className="container">
          <div className="section-tag">📚 Subjects Covered</div>
          <h2 className="section-title">Ask about <span className="gradient-text">any subject</span></h2>
          <div className="subjects-grid">
            {subjects.map((s, i) => (
              <div key={i} className="subject-chip">{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="lang-section">
        <div className="container">
          <div className="lang-card card card-glow">
            <div className="lang-content">
              <div className="section-tag">🌐 Multilingual</div>
              <h2 className="section-title">Learn in <span className="gradient-text">your language</span></h2>
              <p className="section-subtitle">
                ShikshaAI understands and responds in English, Hindi, and Marathi — whichever you're most comfortable with.
              </p>
              <Link href="/onboarding" className="btn btn-primary" style={{ marginTop: 24 }}>
                Set Your Language →
              </Link>
            </div>
            <div className="lang-pills">
              <div className="lang-pill active">🇬🇧 English</div>
              <div className="lang-pill">🇮🇳 हिंदी</div>
              <div className="lang-pill">🟠 मराठी</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="orb orb-cta-1" />
            <div className="orb orb-cta-2" />
            <h2 className="cta-title">Ready to learn smarter?</h2>
            <p className="cta-subtitle">
              Set up your student profile in under a minute and start your first AI-powered lesson.
            </p>
            <div className="hero-cta-group">
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                🎓 Start Learning — It's Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="navbar-logo" style={{ fontSize: "1rem" }}>
              Shiksha<span style={{ color: "var(--primary)" }}>AI</span>
            </span>
            <span className="footer-text">
              Built with ❤️ for Hack2Skill — Meet the Builders 2026
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
