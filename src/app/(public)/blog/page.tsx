"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Clock, ArrowRight, Bookmark, Sparkles } from "lucide-react";

const mockPosts = [
  {
    id: "1",
    title: "10 ATS Resume Rules You Must Follow to Land Interviews in 2026",
    slug: "ats-resume-rules-2026",
    excerpt: "Learn how modern Applicant Tracking Systems parse PDF and DOCX files, extract keywords, and rank resumes.",
    category: "ATS Tips",
    readingTime: "5 min read",
    date: "August 2, 2026",
  },
  {
    id: "2",
    title: "How to Answer 'Tell Me About Yourself' Using the STAR Framework",
    slug: "answer-tell-me-about-yourself-star-method",
    excerpt: "A step-by-step guide to structuring your behavioral interview answers to impress technical hiring managers.",
    category: "Interview Prep",
    readingTime: "7 min read",
    date: "July 28, 2026",
  },
  {
    id: "3",
    title: "Top 10 High-Paying Software Engineering Skills in 2026",
    slug: "top-paying-software-skills-2026",
    excerpt: "Discover which skills—from System Architecture to Next.js 15—command the highest market salaries.",
    category: "Career Insights",
    readingTime: "6 min read",
    date: "July 24, 2026",
  },
];

export default function BlogListingPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const categories = ["All", "ATS Tips", "Interview Prep", "Career Insights", "Remote Jobs"];

  const filtered = mockPosts.filter((post) => {
    const matchCat = activeCat === "All" || post.category === activeCat;
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-500">
          <BookOpen className="h-3.5 w-3.5" /> Career AI Knowledge Hub
        </span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">
          Career Blog & ATS Insights
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Actionable guides on resume optimization, technical interview strategies, and salary negotiations.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-xs focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeCat === cat
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <article key={post.id} className="glass rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-border transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-primary-500">{post.category}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime}</span>
              </div>
              <h2 className="font-heading text-base font-bold leading-snug hover:text-primary-500 transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <span className="text-[11px] text-muted-foreground">{post.date}</span>
              <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 font-semibold text-primary-500 hover:text-primary-400">
                Read Article <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
