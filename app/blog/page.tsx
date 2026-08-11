import Link from "next/link";
import "./blog.css";
const blogs = [
  {
    id: 1,
    title: "Shiksha AI: Making Quality Education More Accessible with Artificial Intelligence",
    description:
      "Discover how Shiksha AI uses artificial intelligence to help students learn, practice, and discover educational opportunities.",
    category: "AI in Education",
    date: "August 11, 2026",
    readTime: "5 min read",
    slug: "shiksha-ai-education",
  },
];

export default function BlogPage() {
  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-content">
          <span className="blog-badge">Shiksha AI Blog</span>

          <h1>
            Learn. Explore.
            <span> Grow.</span>
          </h1>

          <p>
            Discover ideas, technology, and stories about how AI can make
            education more accessible and personalized for students.
          </p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-container">
          <div className="section-heading">
            <span>Latest Article</span>
            <h2>Insights from Shiksha AI</h2>
          </div>

          <div className="blog-grid">
            {blogs.map((blog) => (
              <article className="blog-card" key={blog.id}>
                <div className="blog-card-image">
                  <div className="image-content">
                    <span>AI</span>
                    <strong>Education</strong>
                  </div>
                </div>

                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span>{blog.category}</span>
                    <span>{blog.date}</span>
                  </div>

                  <h3>{blog.title}</h3>

                  <p>{blog.description}</p>

                  <div className="blog-footer">
                    <span>{blog.readTime}</span>

                    <Link href={`/blog/${blog.slug}`}>
                      Read Article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}