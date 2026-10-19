import {
  LayoutDashboard,
  Upload,
  FileText,
  Settings,
  CreditCard,
  BarChart3,
  Users,
  Shield,
  Sparkles,
  Eye,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const dashboardNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "ATS Checker", href: "/ats-checker", icon: Upload },
  { title: "Resume Builder", href: "/resume-builder", icon: Sparkles },
  { title: "My Resumes", href: "/my-resumes", icon: FileText },
  { title: "History", href: "/history", icon: BarChart3 },
];

export const adminNav: NavItem[] = [
  { title: "Admin Console", href: "/admin", icon: BarChart3 },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Reports", href: "/admin/reports", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Shield },
];

export const marketingNav = [
  { title: "Features", href: "/#features" },
  { title: "How It Works", href: "/#how-it-works" },
  { title: "Pricing", href: "/#pricing" },
  { title: "FAQ", href: "/#faq" },
] as const;
