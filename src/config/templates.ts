export interface ResumeTemplateDefinition {
  id: string;
  name: string;
  category: "ats-optimized" | "modern" | "executive" | "creative" | "academic";
  filterCategories: string[];
  description: string;
  layout:
    | "single-column"
    | "left-sidebar-dark"
    | "right-sidebar"
    | "top-hero-banner"
    | "split-header-classic"
    | "compact-grid"
    | "serif-academic-classic"
    | "executive-gold-frame"
    | "creative-pill-modern"
    | "minimal-linear-ats"
    | "timeline-modern";
  primaryColor: string;
  fontFamily?: string;
  accentStyle?: "minimal" | "badges" | "cards" | "lines" | "pills";
  headerStyle: "centered" | "left-bold" | "hero-banner" | "sidebar" | "minimal";
  atsScore: number;
  atsFriendly: boolean;
  isPremium: boolean;
  pages: "one-page" | "two-page";
  popular?: boolean;
  tags: string[];
}

export const TEMPLATE_CATEGORIES = [
  "All",
  "ATS Friendly",
  "Modern",
  "Professional",
  "Minimal",
  "Creative",
  "Corporate",
  "Executive",
  "Developer",
  "Designer",
  "Marketing",
  "Finance",
  "Student",
  "Academic",
  "One Page",
  "Two Page",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

const categoryNames: Record<ResumeTemplateDefinition["category"], string[]> = {
  "ats-optimized": [
    "Harvard Classic ATS", "Stanford Standard ATS", "Clean Chronological ATS", "Executive Plain Text",
    "Minimal Single Column", "Plain Corporate ATS", "Ultra-Clean ATS", "Federal Resume Format",
    "Simple Linear ATS", "Standard Recruiter Format", "Compact 1-Page ATS", "ATS Proof Double Column",
    "High-Density ATS", "Corporate Compliance ATS", "Plain Text Minimal", "Ivy League Standard",
    "Traditional Executive", "Modern Monospace ATS", "Clear Header ATS", "Standard Academic ATS",
    "Direct Scan ATS", "No-Table Minimalist ATS", "Structured Tech ATS", "Universal Job Match ATS", "Bilingual ATS"
  ],
  "modern": [
    "Silicon Valley Modern", "NextGen Developer", "Dark Glassmorphism", "Tech Minimalist",
    "Gradient Accent Modern", "Cyber Edge Developer", "Full-Stack Modern", "Vite Clean Tech",
    "Modern Dual-Tone", "Minimalist Tech", "SaaS Product Engineer", "Modern Sidebar Light",
    "React Native Specialist", "DevOps Cloud Modern", "Data Engineer Clean", "AI Researcher Modern",
    "Frontend Specialist", "Backend Systems Modern", "Mobile Developer Edge", "Cloud Architect Modern"
  ],
  "executive": [
    "Fortune 500 Director", "C-Suite Gold Leadership", "Navy Executive Corporate", "VP Operations Classic",
    "Crimson Executive", "Board Member Elite", "Managing Director Serif", "Corporate Finance Executive",
    "Global Strategy Partner", "Enterprise Architect Gold", "Senior Partner Executive", "Chief Officer Elegance",
    "Executive Leadership Dark", "Corporate VP Minimal", "Strategic Director", "Principal Consultant",
    "General Manager Prestige", "Executive Chairman Classic", "Global Operations Executive", "Turnaround Director"
  ],
  "creative": [
    "UI/UX Portfolio Creative", "Vibrant Designer Grid", "Minimalist Art Director", "Studio Craft Modern",
    "Editorial Serif Creative", "Pastel Aesthetic Designer", "Creative Sidebar Accent", "Brand Manager Bold",
    "Digital Marketer Vibrant", "Content Strategist Modern", "Visual Designer Clean", "Copywriter Editorial",
    "Media Producer Bold", "Interactive Architect", "Graphic Designer Minimal", "Creative Lead Studio",
    "3D Artist Portfolio", "Product Designer Clean", "Fashion & Luxury Creative", "Motion Designer Edge"
  ],
  "academic": [
    "University Scholar Classic", "Clinical Medical CV", "Legal Partner Classic", "Research Fellow Academic",
    "Scientific Journal CV", "Publication Focus CV", "Professor Emeritus Classic", "Postdoc Researcher CV",
    "Biomedical Scientist CV", "Ph.D. Candidate Format", "University Lecturer CV", "Humanities Scholar",
    "International Law CV", "Medical Resident Format", "Data Scientist CV"
  ]
};

const allDistinctLayouts: ResumeTemplateDefinition["layout"][] = [
  "minimal-linear-ats",
  "left-sidebar-dark",
  "right-sidebar",
  "top-hero-banner",
  "split-header-classic",
  "compact-grid",
  "serif-academic-classic",
  "executive-gold-frame",
  "creative-pill-modern",
  "timeline-modern"
];

const colors = [
  "#2563eb", "#0d9488", "#4f46e5", "#b45309", "#be123c",
  "#0369a1", "#059669", "#7c3aed", "#9333ea", "#334155"
];

// Curated font pairings according to role/category
const fontsByCat: Record<ResumeTemplateDefinition["category"], string[]> = {
  "ats-optimized": ["Arial, sans-serif", "Calibri, sans-serif", "Inter, sans-serif", "'Times New Roman', serif"],
  "modern": ["Inter, sans-serif", "'Roboto', sans-serif", "'Outfit', sans-serif", "system-ui, sans-serif"],
  "executive": ["'Georgia', serif", "'Times New Roman', serif", "Inter, sans-serif", "'Merriweather', serif"],
  "creative": ["'Outfit', sans-serif", "Inter, sans-serif", "'Georgia', serif", "'Roboto', sans-serif"],
  "academic": ["'Georgia', serif", "'Times New Roman', serif", "'Merriweather', serif", "serif"]
};

// Priority layout rotation tailored per category so each section feels uniquely styled
const layoutsByCat: Record<ResumeTemplateDefinition["category"], ResumeTemplateDefinition["layout"][]> = {
  "ats-optimized": ["minimal-linear-ats", "split-header-classic", "compact-grid", "right-sidebar", "serif-academic-classic"],
  "modern": ["left-sidebar-dark", "creative-pill-modern", "timeline-modern", "top-hero-banner", "compact-grid"],
  "executive": ["executive-gold-frame", "split-header-classic", "top-hero-banner", "serif-academic-classic", "minimal-linear-ats"],
  "creative": ["creative-pill-modern", "left-sidebar-dark", "top-hero-banner", "right-sidebar", "compact-grid"],
  "academic": ["serif-academic-classic", "minimal-linear-ats", "split-header-classic", "compact-grid", "timeline-modern"]
};

function determineFilterCategories(name: string, cat: string, i: number): string[] {
  const cats = new Set<string>(["All"]);

  if (cat === "ats-optimized" || i % 2 === 0) {
    cats.add("ATS Friendly");
    cats.add("Professional");
  }
  if (cat === "modern") {
    cats.add("Modern");
    cats.add("Developer");
  }
  if (cat === "executive") {
    cats.add("Executive");
    cats.add("Corporate");
    cats.add("Finance");
  }
  if (cat === "creative") {
    cats.add("Creative");
    cats.add("Designer");
    cats.add("Marketing");
  }
  if (cat === "academic") {
    cats.add("Academic");
    cats.add("Student");
    cats.add("Professional");
  }

  // Name-specific inferences
  const lower = name.toLowerCase();
  if (lower.includes("minimal") || lower.includes("clean") || lower.includes("plain")) cats.add("Minimal");
  if (lower.includes("developer") || lower.includes("tech") || lower.includes("systems") || lower.includes("cloud")) cats.add("Developer");
  if (lower.includes("designer") || lower.includes("creative") || lower.includes("art") || lower.includes("ui/ux")) cats.add("Designer");
  if (lower.includes("finance") || lower.includes("corporate") || lower.includes("director")) cats.add("Finance");
  if (lower.includes("marketing") || lower.includes("content") || lower.includes("brand")) cats.add("Marketing");
  if (lower.includes("student") || lower.includes("ph.d") || lower.includes("candidate") || lower.includes("graduate")) cats.add("Student");

  // Page split
  if (i % 2 === 0) {
    cats.add("One Page");
  } else {
    cats.add("Two Page");
  }

  return Array.from(cats);
}

export const TEMPLATES_100_CATALOG: ResumeTemplateDefinition[] = Object.entries(categoryNames).flatMap(
  ([cat, names]) =>
    names.map((name, i) => {
      const category = cat as ResumeTemplateDefinition["category"];
      const id = `${category}_${i + 1}`;
      const catLayouts = layoutsByCat[category];
      const layout = catLayouts[i % catLayouts.length];
      const catFonts = fontsByCat[category];
      const fontFamily = catFonts[i % catFonts.length];
      const primaryColor = colors[(i * 3 + cat.length) % colors.length];
      const atsScore = category === "ats-optimized" ? 98 - (i % 3) : 92 - (i % 5);
      const isPremium = i % 4 === 0;
      const pages: "one-page" | "two-page" = i % 2 === 0 ? "one-page" : "two-page";
      const filterCategories = determineFilterCategories(name, category, i);

      return {
        id,
        name,
        category,
        filterCategories,
        description: `Professional ${layout.replace(/-/g, " ")} format curated for top recruiter engagement.`,
        layout,
        primaryColor,
        fontFamily,
        accentStyle: (i % 3 === 0 ? "pills" : i % 3 === 1 ? "lines" : "badges") as any,
        headerStyle: i % 2 === 0 ? "left-bold" : "centered",
        atsScore,
        atsFriendly: atsScore >= 90,
        isPremium,
        pages,
        popular: i < 3,
        tags: [category, layout.replace(/-/g, " "), `ATS ${atsScore}%`],
      };
    })
);
