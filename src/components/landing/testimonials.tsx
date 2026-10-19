"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content:
      "ResumeAI helped me identify 15 missing keywords that I had completely overlooked. After optimizing my resume, I got callbacks from 4 out of 5 companies I applied to.",
    rating: 5,
    avatar: "SC",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Meta",
    content:
      "The AI suggestions for rewriting my bullet points were incredible. It transformed vague descriptions into impactful, metric-driven achievements. Game changer!",
    rating: 5,
    avatar: "MJ",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Priya Patel",
    role: "Data Analyst at Amazon",
    content:
      "I went from a 52% ATS score to 94% in one session. The formatting analysis caught issues I didn't even know existed. Highly recommend for any job seeker.",
    rating: 5,
    avatar: "PP",
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "Alex Rivera",
    role: "UX Designer at Spotify",
    content:
      "As a designer, my resume had too many visual elements that ATS systems couldn't parse. ResumeAI showed me exactly what to fix while keeping it professional.",
    rating: 5,
    avatar: "AR",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Emily Watson",
    role: "Marketing Director at HubSpot",
    content:
      "The keyword density and placement analysis is incredibly detailed. It doesn't just tell you what's missing — it tells you exactly where to add each keyword.",
    rating: 5,
    avatar: "EW",
    color: "from-rose-500 to-pink-500",
  },
  {
    name: "David Kim",
    role: "Full Stack Developer at Stripe",
    content:
      "I've tried 5 different ATS checkers, and ResumeAI is by far the most comprehensive. The AI-powered suggestions alone are worth the Pro subscription.",
    rating: 5,
    avatar: "DK",
    color: "from-indigo-500 to-blue-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Loved by{" "}
            <span className="gradient-text">job seekers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Join thousands of professionals who landed their dream jobs with
            ResumeAI.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg"
            >
              {/* Quote */}
              <Quote className="h-8 w-8 text-primary-500/20 mb-3" />

              {/* Rating */}
              <div className="mb-3 flex items-center gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-sm font-bold text-white`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
