"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { useUIStore } from "@/stores/ui-store";
import { useTheme } from "next-themes";
import {
  FileSearch,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  Menu,
  User,
} from "lucide-react";
import { dashboardNav } from "@/config/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<string>("Free");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/subscription")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.subscription?.plan) {
            const p = data.subscription.plan;
            setPlan(p.charAt(0).toUpperCase() + p.slice(1));
          }
        })
        .catch(() => {});
    }
  }, [session?.user]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/50 bg-card/95 backdrop-blur-xl transition-all duration-300 lg:relative lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarCollapsed ? "w-[68px]" : "w-64"}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-white">
                <FileSearch className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-bold">
                Resume<span className="gradient-text">AI</span>
              </span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-white">
              <FileSearch className="h-4 w-4" />
            </div>
          )}
          <button
            onClick={toggleSidebarCollapsed}
            className="hidden h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground lg:inline-flex"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {dashboardNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary-500/10 text-primary-500 shadow-sm"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                    title={sidebarCollapsed ? item.title : undefined}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary-500" : ""}`} />
                    {!sidebarCollapsed && item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="border-t border-border/50 p-3 space-y-1">
          <Link
            href="/profile"
            onClick={() => setSidebarOpen(false)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/profile"
                ? "bg-primary-500/10 text-primary-500 shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            } ${sidebarCollapsed ? "justify-center" : ""}`}
            title={sidebarCollapsed ? "Profile" : undefined}
          >
            <User className="h-5 w-5" />
            {!sidebarCollapsed && "Profile"}
          </Link>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Toggle theme" : undefined}
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:block" />
            {!sidebarCollapsed && (
              <span suppressHydrationWarning>
                {mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : "Mode"}
              </span>
            )}
          </button>

          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Sign out" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && "Sign Out"}
          </button>

          {/* User Info */}
          {session?.user && !sidebarCollapsed && (
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-muted/30 px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg text-xs font-bold text-white">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-sm font-medium">{session.user.name}</span>
                  <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-semibold text-primary-500">
                    {plan}
                  </span>
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
