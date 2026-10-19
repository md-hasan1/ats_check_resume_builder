"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import {
  FileSearch,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "ATS Checker", href: "/ats-checker" },
    { title: "How It Works", href: "/#how-it-works" },
    { title: "Features", href: "/#features" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <FileSearch className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            ATS<span className="gradient-text">Checker</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.title}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? "text-primary-500 font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <Link
                href="/ats-checker"
                className="inline-flex h-9 items-center gap-2 rounded-xl gradient-bg px-4 text-xs font-semibold text-white shadow-md shadow-primary-500/25 hover:scale-105 transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Check Resume
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </Link>
              <Link
                href="/ats-checker"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl gradient-bg px-4 text-xs font-semibold text-white shadow-md shadow-primary-500/25 hover:scale-105 transition-all"
              >
                Check My Resume
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-border/40 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3"
          >
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-border/40 flex flex-col gap-2">
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border/60 text-xs font-semibold"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/ats-checker"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl gradient-bg text-xs font-semibold text-white shadow-md"
                  >
                    Check Resume
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-border text-xs font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/ats-checker"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl gradient-bg text-xs font-semibold text-white shadow-md"
                  >
                    Check My Resume
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
