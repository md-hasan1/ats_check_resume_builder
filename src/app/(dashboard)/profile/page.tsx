"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast, showAlert } from "@/lib/sweetalert";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Loader2,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState(session?.user?.name || "");
  const [email] = useState(session?.user?.email || "");
  const [savingName, setSavingName] = useState(false);

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSavingName(true);
    try {
      const res = await (authClient as unknown as { updateUser: (opts: { name: string }) => Promise<{ error?: { message?: string } }> }).updateUser({ name });
      if (res?.error) {
        toast.error(res.error.message || "Failed to update name");
      } else {
        toast.success("Name updated successfully!");
      }
    } catch {
      toast.error("Failed to update profile name");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await (authClient as unknown as { changePassword: (opts: { currentPassword: string; newPassword: string }) => Promise<{ error?: { message?: string } }> }).changePassword({
        currentPassword,
        newPassword,
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error("Failed to change password. Ensure current password is correct.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">User Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your account information and credentials.</p>
      </motion.div>

      {/* Account Info Card */}
      <motion.div variants={item} className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-border/40 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg text-2xl font-bold text-white shadow-md">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              userInitial
            )}
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold">{session?.user?.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>

        {/* Basic Details Form */}
        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary-500" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary-500" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Email is tied to your login provider and cannot be changed directly.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingName}
              className="inline-flex items-center gap-2 rounded-xl gradient-bg px-4 py-2 text-xs font-semibold text-white shadow-md hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {savingName ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password Card */}
      <motion.div variants={item} className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-border/40 pb-4">
          <Lock className="h-5 w-5 text-primary-500" />
          <h2 className="font-heading text-lg font-semibold">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="h-10 w-full rounded-xl border border-border bg-background px-3 pr-10 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Repeat new password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              {changingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Update Password
            </button>
          </div>
        </form>
      </motion.div>

      {/* Logout Action */}
      <motion.div variants={item} className="glass rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Sign Out</h3>
          <p className="text-xs text-muted-foreground">Sign out of your account on this browser session.</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log Out
        </button>
      </motion.div>
    </motion.div>
  );
}
