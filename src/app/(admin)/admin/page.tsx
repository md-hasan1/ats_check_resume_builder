"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  DollarSign,
  Zap,
  Activity,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Server,
} from "lucide-react";

export default function AdminPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 142,
    totalResumes: 389,
    totalReports: 512,
    totalTailored: 240,
    totalSubscriptions: 28,
    mrr: 532,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-500">
            System Admin
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl mt-2 flex items-center gap-3">
          <ShieldAlert className="h-7 w-7 text-primary-500" />
          Enterprise Admin Console
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform telemetry, active subscribers, revenue metrics, and AI token utilization.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">Total Users</span>
            <Users className="h-4 w-4 text-primary-500" />
          </div>
          <p className="text-2xl font-bold">{metrics.totalUsers}</p>
          <span className="text-[10px] text-emerald-500 font-semibold">+18% this month</span>
        </div>

        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">Active Subscribers</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold">{metrics.totalSubscriptions}</p>
          <span className="text-[10px] text-emerald-500 font-semibold">+6 Pro Plan conversions</span>
        </div>

        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">Monthly Recurring Revenue</span>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">${metrics.mrr}</p>
          <span className="text-[10px] text-emerald-500 font-semibold">Stripe Live</span>
        </div>

        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">AI Tailored Resumes</span>
            <Zap className="h-4 w-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold">{metrics.totalTailored}</p>
          <span className="text-[10px] text-muted-foreground">Gemini 2.5 Pro Active</span>
        </div>
      </div>

      {/* AI Telemetry & Logs Table */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-heading text-base font-semibold flex items-center gap-2">
          <Server className="h-4 w-4 text-primary-500" /> System Activity Logs & AI Telemetry
        </h2>
        <div className="space-y-2 text-xs font-mono text-muted-foreground bg-black/40 p-4 rounded-xl max-h-60 overflow-y-auto border border-border/50">
          <p className="text-emerald-400">[INFO] 2026-08-02 20:54:12 - Gemini 2.5 Pro generated tailored resume (Token count: 1,420)</p>
          <p className="text-emerald-400">[INFO] 2026-08-02 20:51:04 - Stripe webhook checkout.session.completed received ($19.00 Pro tier)</p>
          <p className="text-blue-400">[DEBUG] 2026-08-02 20:48:33 - Scraped job URL: careers.google.com/jobs/123 (Status: 200 OK)</p>
          <p className="text-emerald-400">[INFO] 2026-08-02 20:42:19 - User logged in via GitHub OAuth</p>
        </div>
      </div>
    </div>
  );
}
