"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is an ATS and why does it matter?",
    answer:
      "An Applicant Tracking System (ATS) is software used by over 98% of Fortune 500 companies to filter and rank resumes. If your resume isn't ATS-friendly, it may be automatically rejected before a human ever sees it. Our tool checks your resume against these systems to ensure it passes through.",
  },
  {
    question: "How accurate is the ATS score?",
    answer:
      "Our AI-powered scoring engine analyzes your resume across 12+ dimensions including keyword matching, formatting, grammar, skills alignment, and ATS compatibility. While no tool can guarantee a specific outcome, our analysis is based on extensive research into how major ATS systems process resumes.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support PDF, DOCX, and DOC file formats up to 10MB. For best results, we recommend uploading a PDF or DOCX file. Scanned images and image-based PDFs may have limited analysis capabilities.",
  },
  {
    question: "Is my resume data secure?",
    answer:
      "Absolutely. Your resume data is encrypted in transit and at rest. We never share your information with third parties. Files are processed securely and you can delete your data at any time from your account settings.",
  },
  {
    question: "How is this different from other ATS checkers?",
    answer:
      "Unlike basic keyword matchers, ResumeAI uses advanced AI to provide contextual analysis. We don't just count keywords — we analyze placement, density, experience relevance, and provide AI-powered rewrites for your bullet points. Our formatting analysis checks for 20+ ATS compatibility factors.",
  },
  {
    question: "Can I use it for multiple job applications?",
    answer:
      "Yes! Free users get 3 resume checks per month. Pro users get unlimited checks, which is ideal if you're applying to multiple positions. Each check can be against a different job description, so you can tailor your resume for every application.",
  },
  {
    question: "What AI technology powers the analysis?",
    answer:
      "We use state-of-the-art large language models (LLMs) combined with custom-built analysis algorithms for keyword extraction, formatting validation, and ATS simulation. The AI suggestions are contextually aware and tailored to your specific resume and target job.",
  },
  {
    question: "Can I download my analysis report?",
    answer:
      "Pro and Business users can download their full analysis reports as PDF documents. Reports include all scores, keyword analysis, suggestions, and improvement recommendations. You can also share reports via a secure link.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Everything you need to know about ResumeAI.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
