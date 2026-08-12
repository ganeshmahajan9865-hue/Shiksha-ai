"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./scholarships.css";

interface ScholarshipMatch {
  name: string;
  award: string;
  eligibility: string;
  documents: string[];
  application_steps: string[];
  deadline: string;
}

interface ScholarshipResponse {
  matches: ScholarshipMatch[];
  advice: string;
}

export default function ScholarshipsPage() {
  const [profile, setProfile] = useState<{ name: string; class_level: string; preferred_language: string; id: string } | null>(null);
  
  // Custom filters
  const [gender, setGender] = useState("All");
  const [income, setIncome] = useState("Under ₹1.5 Lakhs");
  const [category, setCategory] = useState("General");
  const [state, setState] = useState("Maharashtra");
  
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScholarshipResponse | null>(null);
  const [error, setError] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("shiksha_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const findScholarships = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setExpandedIndex(null);

    const studentProfileDetails = {
      class_level: profile?.class_level || "8",
      gender,
      family_income: income,
      category,
      state,
    };

    try {
      const res = await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentProfile: studentProfileDetails,
          query: query || "What scholarships do I qualify for?",
          language: profile?.preferred_language || "English",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to find scholarships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sc-page">
      <div className="sc-container">
        
        {/* Header */}
        <div className="sc-header card">
          <div className="sc-header-icon">🎓</div>
          <h1 className="sc-title">Scholarship Finder</h1>
          <p className="sc-subtitle">
            Find and apply for state, national, and private scholarships in India matching your profile.
          </p>
        </div>

        {/* Profile Details Form */}
        <div className="sc-filters-card card">
          <h2>👤 My Scholarship Profile</h2>
          <p className="filters-subtitle">Verify details to get the most accurate matches.</p>
          
          <div className="filters-grid">
            <div className="input-group">
              <label className="input-label">Class</label>
              <select 
                className="input-field" 
                value={profile?.class_level || "8"}
                onChange={(e) => profile && setProfile({...profile, class_level: e.target.value})}
              >
                {["6","7","8","9","10"].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Gender</label>
              <select className="input-field" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="All">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Family Income</label>
              <select className="input-field" value={income} onChange={(e) => setIncome(e.target.value)}>
                <option value="Under ₹1.5 Lakhs">Under ₹1.5 Lakhs</option>
                <option value="₹1.5 - ₹3 Lakhs">₹1.5 - ₹3 Lakhs</option>
                <option value="₹3 - ₹6 Lakhs">₹3 - ₹6 Lakhs</option>
                <option value="Above ₹6 Lakhs">Above ₹6 Lakhs</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General">General / Open</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="Minority">Minority Communities</option>
              </select>
            </div>

            <div className="input-group" style={{ gridColumn: "span 2" }}>
              <label className="input-label">State of Residence</label>
              <input 
                className="input-field" 
                placeholder="e.g. Maharashtra, Uttar Pradesh, Bihar…" 
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: 20 }}>
            <label className="input-label">Custom Questions (Optional)</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="e.g. Tell me specifically about scholarships for girls in Maharashtra, or details about NMMSS exam details…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: 24 }}
            disabled={loading}
            onClick={findScholarships}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18 }} /> Finding Scholarships…</>
            ) : (
              "🔍 Search Matching Scholarships"
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="sc-results">
            <h2 className="results-heading">🎯 Matching Scholarships found for you</h2>
            
            <div className="matches-list">
              {result.matches.map((match, idx) => (
                <div key={idx} className="match-card card">
                  <div className="match-header" onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}>
                    <div style={{ flex: 1 }}>
                      <h3 className="match-name">{match.name}</h3>
                      <div className="match-award-row">
                        <span className="badge badge-success">🏆 Award: {match.award}</span>
                        <span className="badge badge-warning">📅 Deadline: {match.deadline}</span>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-sm expand-btn">
                      {expandedIndex === idx ? "Collapse ▲" : "Details ▼"}
                    </button>
                  </div>

                  {expandedIndex === idx && (
                    <div className="match-details">
                      <div className="detail-section">
                        <h4>🎯 Eligibility</h4>
                        <p>{match.eligibility}</p>
                      </div>

                      <div className="detail-section">
                        <h4>📋 Required Documents</h4>
                        <ul>
                          {match.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                        </ul>
                      </div>

                      <div className="detail-section">
                        <h4>🛤️ Steps to Apply</h4>
                        <ol>
                          {match.application_steps.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {result.matches.length === 0 && (
                <div className="card" style={{ textAlign: "center", padding: 40 }}>
                  <p style={{ color: "var(--text-secondary)" }}>No direct scholarships matched. Try altering search queries or category filters.</p>
                </div>
              )}
            </div>

            {result.advice && (
              <div className="alert alert-info sc-advice">
                <h4>💡 AI Advisor Notes</h4>
                <p>{result.advice}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
