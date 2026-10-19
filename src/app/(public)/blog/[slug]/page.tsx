import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = {
    title: "10 ATS Resume Rules You Must Follow to Land Interviews in 2026",
    slug,
    content: `
      <h2>1. Avoid Tables and Complex Multi-Column Layouts</h2>
      <p>Applicant Tracking Systems (ATS) use simple text parsers. Complex tables, floating text boxes, and side-by-side columns often cause content to be read out of sequence or completely dropped.</p>

      <h2>2. Use Standard Headings</h2>
      <p>Stick to universal section titles like "Work Experience", "Education", and "Skills" instead of creative names like "Where I've Been".</p>

      <h2>3. Incorporate Exact Job Description Keywords</h2>
      <p>Match the exact phrasing used in the target job posting. For instance, if the post lists "TypeScript", ensure your resume includes "TypeScript" rather than just "JS".</p>

      <h2>4. Choose ATS-Safe Fonts</h2>
      <p>Use standard web fonts such as Arial, Calibri, Helvetica, or Inter. Avoid non-standard decorative fonts that are not embedded in PDF documents.</p>

      <h2>5. Quantify Achievements</h2>
      <p>Structure your experience using action verbs followed by measurable results. Frame achievements around performance metrics, latency reductions, or revenue impacts.</p>
    `,
    date: "August 2, 2026",
    readingTime: "5 min read",
    author: "Career AI Team",
    category: "ATS Tips",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    datePublished: "2026-08-02",
    description: "10 essential rules to optimize your resume for Applicant Tracking Systems.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-3xl space-y-8">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Articles
      </Link>

      <div className="space-y-4">
        <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">
          {post.category}
        </span>
        <h1 className="font-heading text-3xl font-extrabold sm:text-4xl leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-border/50 pb-4">
          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime}</span>
        </div>
      </div>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
