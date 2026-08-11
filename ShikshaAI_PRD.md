# Product Requirements Document (PRD)

## ShikshaAI — AI-Powered Multilingual Learning Assistant

**Document status:** Draft v1.0
**Prepared for:** Hack2Skill — "Meet the Builders"
**Date:** August 2026

---

## 1. Overview

ShikshaAI is a web-based, AI-powered multilingual learning assistant designed for school students who have limited access to personalized educational support. Rather than functioning as a generic Q&A chatbot, ShikshaAI acts as a **learning companion** — guiding students through a structured explain → example → practice → feedback loop, in the language they're most comfortable with.

**One-line pitch:** *Personalized, multilingual learning support for school students who don't have access to one-to-one tutoring.*

---

## 2. Problem Statement

**Problem area:** Student education and scholarships
**Primary users:** School students
**Core goal:** Improve access to learning

### Why this matters

Many students have internet access but still struggle to learn effectively because:

- Learning material is often difficult to understand as written.
- Students are more comfortable asking questions in their local/regional language.
- They don't always have someone available to explain a topic when they need it.
- Students are at different learning levels, but resources are one-size-fits-all.
- Finding the *right* study material for their level is difficult.
- Students often memorize answers instead of understanding underlying concepts.

### Core problem statement

> How can we give every student access to a personalized learning assistant, regardless of language, location, or access to private tutoring?

### Scope decision

The project will focus specifically on **school students in India**, rather than APAC broadly. This narrows the story to something concrete and testable:

> "Can generative AI make personalized, multilingual learning support accessible to school students who don't have access to one-to-one tutoring?"

---

## 3. Goals & Non-Goals

### Goals (Phase 1 — MVP)
- Let students ask questions and receive level-appropriate, easy-to-understand explanations.
- Support multilingual interaction (e.g., English, Hindi, Marathi).
- Move students from "getting an answer" to "understanding a concept" via a structured learning flow.
- Generate practice questions and give feedback.
- Track basic progress and highlight weak topics.

### Non-Goals (Phase 1)
- Scholarship discovery and eligibility guidance (deferred to Phase 2).
- Voice-based questions, image-based questions.
- Parent/teacher dashboards.
- Offline-friendly content delivery.
- Full personalized learning-path engine (diagnostic quiz → adaptive path) — stretch goal if time permits.

---

## 4. Target Users

| Persona | Description | Needs |
|---|---|---|
| School student (primary) | Class 6–10 student, may have inconsistent access to private tutoring | Simple explanations, native-language support, judgment-free practice |
| Self-learner | Student comfortable with self-study but lacking guidance on gaps | Diagnostic feedback, structured path, progress tracking |

---

## 5. User Journey (Core Loop)

Instead of a single-shot answer, every interaction follows a guided flow:

```
Question
   ↓
Simple explanation
   ↓
Example
   ↓
Visual / analogy
   ↓
Practice question
   ↓
Feedback
```

**Example interaction:**
- Student asks: *"Explain photosynthesis in Marathi."*
- AI responds with a simplified, level-appropriate explanation in Marathi, followed by an example, an analogy, a practice question, and feedback on the student's answer.

**Multilingual example:**
- *"What is Newton's third law?"* → English response
- *"Newton cha third law soppa karun samjhav"* → Marathi response

---

## 6. Features

### 6.1 MVP — Phase 1 (5 core features)

| Feature | Purpose |
|---|---|
| 👤 Student Profile | Capture class, subjects, and preferred language |
| 🤖 AI Tutor | Ask questions and receive guided explanations |
| 📖 Concept Explainer | Simple, level-appropriate explanations of topics |
| 📝 AI Quiz | Generate practice questions tied to the topic discussed |
| 📊 Progress Tracker | Track what's been learned and flag weak topics |

### 6.2 Stretch Features (post-MVP, if time permits)

- Voice-based questions
- Image-based questions (e.g., photo of a textbook problem)
- Personalized AI Learning Path (see 6.3)
- Parent/teacher dashboard
- Scholarship information (Phase 2)
- Offline-friendly content
- Expanded language support (Hindi, Marathi, English at minimum)

### 6.3 Differentiator Feature — AI Learning Path

Rather than students randomly asking questions, ShikshaAI can proactively diagnose gaps:

```
Student
  ↓
Selects: Class 8
  ↓
Selects: Science
  ↓
Selects: Force & Pressure
  ↓
Short diagnostic quiz
  ↓
AI identifies weak concepts
  ↓
Personalized learning path
  ↓
Learn → Practice → Test
```

**Sample AI output:**
> Your current level: Basic
> Strong topic: Force
> Needs improvement: Pressure
> Recommended: 15-minute lesson + 5 practice questions

This is the feature intended to differentiate ShikshaAI from a generic AI chatbot wrapper.

---

## 7. Phased Roadmap

### Phase 1 — AI-Powered Learning Accessibility
Core MVP: student profile, AI tutor, concept explainer, quiz generation, progress tracking, multilingual support.

### Phase 2 — Scholarship Discovery
Once learning accessibility is solid, extend ShikshaAI to help students discover and understand scholarships.

**Example future interaction:**
> *"Which scholarships can I apply for?"*
> The AI explains eligibility, required documents, deadlines, and application steps.

Rationale: this connects **education + opportunity**, strengthening the overall project narrative without diluting the Phase 1 focus.

---

## 8. Proposed Architecture

```
                SHIKSHAAI
                    │
            React Web Application
                    │
                    ▼
              Node.js Backend
                    │
                    ▼
               Gemini API
            ┌───────┼────────┐
            │       │        │
         Explain  Quiz    Learning
          Topic   Gen.      Path
            │       │        │
            └───────┼────────┘
                    ▼
                Supabase
         ┌──────────┼─────────┐
         │          │         │
      Students    Progress   Results
```

**Stack:**
- **Frontend:** React
- **Backend:** Node.js
- **AI layer:** Gemini API (explanation generation, quiz generation, learning path logic)
- **Data layer:** Supabase (student profiles, progress, results)

*Note: exact Google AI tooling to be finalized against current Hack2Skill requirements and available Google AI offerings.*

---

## 9. Success Metrics (Phase 1)

Suggested metrics to validate the MVP (to be refined with the team):

- Number of concepts successfully explained per student session
- Quiz completion rate after an explanation
- Reduction in "weak topic" flags over repeated sessions
- Language distribution of queries (validates multilingual demand)
- Qualitative feedback from student testing (Step 9 below)

---

## 10. Risks & Open Questions

- **Accuracy of AI explanations** across languages, especially regional languages like Marathi — needs review/validation process.
- **Scope creep** — MVP must stay to the 5 core features; stretch features should not be started early.
- **Google AI tool selection** — needs confirmation against current Hack2Skill requirements before backend build begins.
- **Data privacy** for student profiles and progress data stored in Supabase.
- **Diagnostic quiz design** for the Learning Path feature — needs subject-matter input to be credible, not just AI-generated guesswork.

---

## 11. Build Plan

| Step | Description | Status |
|---|---|---|
| 1 | Choose problem area and users (Education → School students → Improve learning access) | ✅ Completed |
| 2 | Define the exact problem statement | Next |
| 3 | Define project name, one-line pitch, target students, user journey, unique features | Pending |
| 4 | Design the UI/UX | Pending |
| 5 | Set up React, Node.js, Gemini API, Supabase | Pending |
| 6 | Build the AI tutor | Pending |
| 7 | Add quiz + personalized learning | Pending |
| 8 | Add multilingual support | Pending |
| 9 | Test with students and collect feedback | Pending |
| 10 | Prepare "Meet the Builders" submission/story and demo | Pending |

---

## 12. Narrative / Positioning

**Not this:** "We created an AI chatbot."

**Instead:** "We are using generative AI to make personalized learning more accessible to school students who may not have access to individualized academic support."

The builder story should focus on the local problem, the students the team designed for, and what the team learned while building it — not the underlying model alone.
