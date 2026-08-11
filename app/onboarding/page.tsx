"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./onboarding.css";

const CLASSES = ["6", "7", "8", "9", "10"];
const SUBJECTS = ["Mathematics", "Science", "History", "Geography", "English", "Computer Science"];
const LANGUAGES = [
  { value: "English", label: "🇬🇧 English" },
  { value: "Hindi",   label: "🇮🇳 हिंदी" },
  { value: "Marathi", label: "🟠 मराठी" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [language, setLanguage] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleSubject = (sub: string) => {
    setSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const saveProfile = async () => {
    setSaving(true);
    const profile = { name, class_level: classLevel, subjects, preferred_language: language, id: Date.now().toString() };
    localStorage.setItem("shiksha_profile", JSON.stringify(profile));
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.push("/tutor");
  };

  return (
    <main className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress steps */}
        <div className="onboarding-steps">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`ob-step ${step >= s ? "active" : ""} ${step > s ? "done" : ""}`}>
              <div className="ob-step-circle">{step > s ? "✓" : s}</div>
              {s < 4 && <div className="ob-step-line" />}
            </div>
          ))}
        </div>

        <div className="onboarding-card card card-glow">
          {step === 1 && (
            <div className="ob-panel">
              <div className="ob-emoji">👋</div>
              <h1 className="ob-title">Welcome to ShikshaAI!</h1>
              <p className="ob-subtitle">Let's set up your learning profile in under a minute.</p>
              <div className="input-group" style={{ marginTop: 32 }}>
                <label className="input-label">Your Name</label>
                <input
                  id="student-name"
                  className="input-field"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button
                id="step1-next"
                className="btn btn-primary btn-lg"
                style={{ marginTop: 28, width: "100%" }}
                disabled={!name.trim()}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="ob-panel">
              <div className="ob-emoji">🎓</div>
              <h2 className="ob-title">Which class are you in, {name}?</h2>
              <p className="ob-subtitle">I'll tailor explanations to your exact level.</p>
              <div className="chip-group" style={{ marginTop: 32, justifyContent: "center" }}>
                {CLASSES.map((c) => (
                  <button
                    key={c}
                    id={`class-${c}`}
                    className={`chip ${classLevel === c ? "selected" : ""}`}
                    onClick={() => setClassLevel(c)}
                  >
                    Class {c}
                  </button>
                ))}
              </div>
              <div className="ob-btn-row">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button
                  id="step2-next"
                  className="btn btn-primary"
                  disabled={!classLevel}
                  onClick={() => setStep(3)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="ob-panel">
              <div className="ob-emoji">📚</div>
              <h2 className="ob-title">What do you study?</h2>
              <p className="ob-subtitle">Select all the subjects you want help with.</p>
              <div className="chip-group" style={{ marginTop: 32, justifyContent: "center" }}>
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    id={`subject-${s.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`chip ${subjects.includes(s) ? "selected" : ""}`}
                    onClick={() => toggleSubject(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="ob-btn-row">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button
                  id="step3-next"
                  className="btn btn-primary"
                  disabled={subjects.length === 0}
                  onClick={() => setStep(4)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="ob-panel">
              <div className="ob-emoji">🌐</div>
              <h2 className="ob-title">Which language do you prefer?</h2>
              <p className="ob-subtitle">ShikshaAI will respond in your chosen language by default.</p>
              <div className="lang-options" style={{ marginTop: 32 }}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    id={`lang-${l.value.toLowerCase()}`}
                    className={`lang-option ${language === l.value ? "selected" : ""}`}
                    onClick={() => setLanguage(l.value)}
                  >
                    <span className="lang-option-label">{l.label}</span>
                    {language === l.value && <span className="lang-check">✓</span>}
                  </button>
                ))}
              </div>
              <div className="ob-btn-row">
                <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
                <button
                  id="save-profile"
                  className="btn btn-primary"
                  disabled={!language || saving}
                  onClick={saveProfile}
                >
                  {saving ? (
                    <><div className="spinner" style={{ width: 18, height: 18 }} /> Saving…</>
                  ) : (
                    "🚀 Start Learning!"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary preview (step 4) */}
        {step === 4 && (
          <div className="ob-summary card">
            <div className="ob-summary-title">Your Profile</div>
            <div className="ob-summary-row">
              <span>👤 Name</span><span>{name}</span>
            </div>
            <div className="ob-summary-row">
              <span>🎓 Class</span><span>Class {classLevel}</span>
            </div>
            <div className="ob-summary-row">
              <span>📚 Subjects</span>
              <span>{subjects.join(", ")}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
