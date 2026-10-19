"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { FileSearch, Lock, ArrowLeft, ArrowRight, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { toast, showAlert } from "@/lib/sweetalert";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await (authClient as unknown as { resetPassword: (opts: { newPassword: string }) => Promise<{ error?: { message?: string } }> }).resetPassword({
        newPassword,
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to reset password. Link may be expired.");
      } else {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
      toast.error("Failed to reset password. The link might be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg text-white">
            <FileSearch className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold">
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        {success ? (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="font-heading text-2xl font-bold">Password Reset Complete</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully updated. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center gap-2 rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-md"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold">Set New Password</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 pr-10 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Repeat new password"
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl gradient-bg text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
