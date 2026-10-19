"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Download,
  Palette,
  Plus,
  Trash2,
  Check,
  Eye,
  ArrowRight,
  ArrowLeft,
  Award,
  FileCheck,
  Layout,
  FileText,
} from "lucide-react";
import { toast, showAlert } from "@/lib/sweetalert";
import { TemplateSelectorModal } from "@/components/optimizer/template-selector-modal";
import { TemplateRenderer } from "@/components/optimizer/template-renderer";

export default function CVBuilderPage() {
  const [step, setStep] = useState(1);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("academic_1");

  // CV State
  const [fullName, setFullName] = useState("Dr. Alex Mercer, Ph.D.");
  const [email, setEmail] = useState("a.mercer@stanford.edu");
  const [phone, setPhone] = useState("+1 (650) 555-0149");
  const [location, setLocation] = useState("Palo Alto, CA");
  const [fieldOfStudy, setFieldOfStudy] = useState("Computer Science & Computational Biology");

  const [summary, setSummary] = useState(
    "Senior Research Scientist & Academic Scholar with 8+ years leading computational genomics research, peer-reviewed publications, and university lecturing."
  );

  const [publications, setPublications] = useState([
    "Mercer, A., et al. (2025). 'Deep Learning Architectures for Genomic Sequence Alignment.' Journal of Computational Biology, 42(3), 112-128.",
    "Mercer, A. (2024). 'Scalable Neural Models for Protein Structure Prediction.' IEEE Transactions on Biomedical Engineering.",
  ]);

  const [experiences, setExperiences] = useState([
    {
      id: "1",
      role: "Lead Research Scientist",
      institution: "Stanford Artificial Intelligence Laboratory",
      dates: "2022 - Present",
      description: "Directing 12 graduate researchers on generative AI models for molecular design.",
    },
  ]);

  const [educations, setEducations] = useState([
    {
      id: "1",
      degree: "Ph.D. in Computer Science",
      institution: "Stanford University",
      dates: "2018 - 2022",
    },
  ]);

  const [awards, setAwards] = useState([
    "NSF Graduate Research Fellowship (2019)",
    "Best Paper Award — NeurIPS Computational Biology Workshop (2024)",
  ]);

  const cvData = {
    versionName: "Academic Curriculum Vitae",
    targetRole: fieldOfStudy || "Lead Research Scientist",
    diffHighlights: {
      addedKeywordsCount: 6,
      improvedBulletsCount: 5,
      estimatedScoreIncrease: 18,
    },
    contactInfo: {
      fullName: fullName || "Dr. Full Name",
      email: email || "email@university.edu",
      phone: phone || "(555) 000-0000",
      location: location || "City, State",
      linkedin: "linkedin.com/in/scholar",
    },
    summary: {
      original: summary,
      tailored: summary,
      reasoning: "",
    },
    skills: {
      matchedSkills: [fieldOfStudy, "Genomics", "Machine Learning", "Python", "Deep Learning"],
      highlightedSkills: [fieldOfStudy, "Genomics", "Machine Learning", "Python", "Deep Learning"],
      recommendedMissingSkills: [],
    },
    experience: experiences.map((exp) => ({
      company: exp.institution,
      jobTitle: exp.role,
      dates: exp.dates,
      bullets: [{ original: exp.description, tailored: exp.description, keywordsAdded: [], reason: "" }],
    })),
    education: educations.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      dates: edu.dates,
    })),
    certifications: awards,
    projects: publications.map((pub) => ({ name: "Publication", description: pub, technologies: [] })),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass rounded-2xl p-6">
        <div>
          <h1 className="font-heading text-xl font-bold sm:text-2xl flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            Professional Academic & Executive CV Builder
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Craft a comprehensive Academic CV with publications, research history, teaching experience, and awards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3.5 text-xs font-semibold text-indigo-500 hover:bg-indigo-500/20 transition-all shadow-sm"
          >
            <Layout className="h-4 w-4" /> Select CV Template
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl gradient-bg px-3.5 text-xs font-semibold text-white shadow-md hover:scale-105 transition-all"
          >
            <Download className="h-4 w-4" /> Print / Export PDF
          </button>
        </div>
      </div>

      <TemplateSelectorModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        selectedTemplateId={selectedTemplate}
        onSelectTemplate={(newId) => {
          setSelectedTemplate(newId);
          toast.success("Applied CV template!");
        }}
      />

      {/* Step Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl border border-border/50 bg-card/50 p-1 text-xs font-semibold">
        {[
          { id: 1, label: "Personal & Academic Profile", icon: User },
          { id: 2, label: "Research & Experience", icon: Briefcase },
          { id: 3, label: "Publications & Citations", icon: FileCheck },
          { id: 4, label: "Education & Awards", icon: GraduationCap },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setStep(item.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
              step === item.id ? "bg-indigo-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Builder Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Panel */}
        <div className="glass rounded-2xl p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">Academic Information</h2>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Full Name & Honorifics</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Field of Specialization</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs transition-colors focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Executive Biography / CV Summary</label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs transition-colors focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Research & Academic Appointments</h2>
              {experiences.map((exp, i) => (
                <div key={exp.id} className="rounded-xl border border-border/50 p-4 space-y-3">
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[i].role = e.target.value;
                      setExperiences(updated);
                    }}
                    placeholder="Role Title"
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={exp.institution}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[i].institution = e.target.value;
                      setExperiences(updated);
                    }}
                    placeholder="Institution / Lab"
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[i].description = e.target.value;
                      setExperiences(updated);
                    }}
                    placeholder="Key contributions & research scope"
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Peer-Reviewed Publications</h2>
              {publications.map((pub, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={2}
                    value={pub}
                    onChange={(e) => {
                      const updated = [...publications];
                      updated[i] = e.target.value;
                      setPublications(updated);
                    }}
                    className="flex-1 rounded-xl border border-border bg-background p-2.5 text-xs focus:outline-none resize-none"
                  />
                  <button
                    onClick={() => setPublications(publications.filter((_, idx) => idx !== i))}
                    className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setPublications([...publications, "New Publication Title (Year). Journal/Conference."])}
                className="inline-flex h-9 items-center gap-1 px-3 rounded-xl border border-border text-xs font-semibold hover:bg-muted/50 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Publication
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Education & Honors</h2>
              {educations.map((edu, i) => (
                <div key={edu.id} className="rounded-xl border border-border/50 p-4 space-y-3">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[i].degree = e.target.value;
                      setEducations(updated);
                    }}
                    placeholder="Degree Name"
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[i].institution = e.target.value;
                      setEducations(updated);
                    }}
                    placeholder="University"
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-border/50">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="inline-flex h-9 items-center gap-1 px-3 rounded-xl border border-border text-xs font-semibold disabled:opacity-30"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="inline-flex h-9 items-center gap-1 px-4 rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow-md hover:scale-105 transition-all"
              >
                Next <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  toast.success("CV successfully generated! Opening print preview...");
                  window.print();
                }}
                className="inline-flex h-9 items-center gap-1.5 px-4 rounded-xl gradient-bg text-xs font-semibold text-white shadow-lg hover:scale-105 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" /> Finish & Export CV →
              </button>
            )}
          </div>
        </div>

        {/* Live CV Document Preview */}
        <div className="max-h-[650px] overflow-y-auto pr-1">
          <TemplateRenderer data={cvData} template={selectedTemplate} />
        </div>
      </div>
    </div>
  );
}
