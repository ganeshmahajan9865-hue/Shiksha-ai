"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="rgba(108,99,255,0.15)" />
          <path d="M8 10h12M8 14h8M8 18h10" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="18" r="4" fill="#6c63ff" />
          <path d="M20 16v4M18 18h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Shiksha<span>AI</span>
        <span className="logo-badge">Beta</span>
      </Link>

      <div className="navbar-links">
        <Link
          href="/tutor"
          className={`nav-link${pathname === "/tutor" ? " active" : ""}`}
        >
          🤖 AI Tutor
        </Link>
        <Link
          href="/quiz"
          className={`nav-link${pathname === "/quiz" ? " active" : ""}`}
        >
          📝 Quiz
        </Link>
        <Link
          href="/learning-path"
          className={`nav-link${pathname === "/learning-path" ? " active" : ""}`}
        >
          🛣️ Learning Path
        </Link>
        <Link
          href="/scholarships"
          className={`nav-link${pathname === "/scholarships" ? " active" : ""}`}
        >
          🎓 Scholarships
        </Link>
        <Link
          href="/progress"
          className={`nav-link${pathname === "/progress" ? " active" : ""}`}
        >
          📊 Progress
        </Link>
        <Link
          href="/blog"
          className={`nav-link${pathname === "/blog" ? " active" : ""}`}
        >
          Blog
        </Link>
        <Link href="/onboarding" className="nav-link nav-cta">
          Get Started
        </Link>

      </div>
    </nav>
  );
}
