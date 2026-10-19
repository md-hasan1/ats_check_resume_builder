"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, MapPin, TrendingUp, Award, Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/lib/sweetalert";

import type { SalaryInsightResult } from "@/lib/ai/provider";

export default function SalaryCalculatorPage() {
  const [role, setRole] = useState("Senior Frontend Engineer");
  const [location, setLocation] = useState("San Francisco, CA");
  const [experience, setExperience] = useState("Senior (5-8 yrs)");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SalaryInsightResult | null>({
    role: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    experience: "Senior (5-8 yrs)",
    averageSalary: 165000,
    medianSalary: 160000,
    top10Percent: 210000,
    marketDemand: "Very High",
    growthPotential: "Strong (+14% YoY)",
    topPayingSkills: ["System Architecture", "React 19", "GraphQL", "Performance Engineering"],
    benefitsSummary: "Includes competitive stock options (RSUs), 401(k) match, and flexible remote work options.",
  });

  const handleCalculate = async () => {
    if (!role || !location) {
      toast.error("Please enter role and location.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, location, experience }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error("Failed to estimate salary");
      } else {
        setResult(data.data);
        toast.success("Salary estimate updated!");
      }
    } catch {
      toast.error("Failed to estimate salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl flex items-center gap-3">
          <DollarSign className="h-7 w-7 text-primary-500" />
          Interactive Salary Calculator & Market Insights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimate competitive market salary bands by role, location, experience, and top-paying skills.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Target Role *</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">City / Country *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary-500 focus:outline-none"
            >
              <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
              <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
              <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
              <option value="Lead / Staff (8+ yrs)">Lead / Staff (8+ yrs)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading}
          className="inline-flex h-10 px-6 items-center justify-center gap-2 rounded-xl gradient-bg text-xs font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Calculate Market Salary</>}
        </button>
      </div>

      {/* Salary Results */}
      {result && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Average Salary</p>
              <p className="text-3xl font-bold text-emerald-500 mt-1">${result.averageSalary?.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Annual Compensation</p>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Median Salary</p>
              <p className="text-3xl font-bold text-primary-500 mt-1">${result.medianSalary?.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">50th Percentile</p>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Top 10% Band</p>
              <p className="text-3xl font-bold text-violet-500 mt-1">${result.top10Percent?.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">90th Percentile</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Market Demand & High-Paying Skills
            </h2>
            <div className="flex items-center gap-4 flex-wrap text-xs">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-500">
                Market Demand: {result.marketDemand}
              </span>
              <span className="text-muted-foreground">{result.growthPotential}</span>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2">Top Skills Boosting Compensation</p>
              <div className="flex flex-wrap gap-1.5">
                {result.topPayingSkills?.map((skill: string) => (
                  <span key={skill} className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">
                    +{skill}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
              {result.benefitsSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
