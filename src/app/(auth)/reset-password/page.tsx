"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "error" && message) {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus("idle");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [status, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      setStatus("success");
      setMessage("Password reset successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Reset failed");
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="p-3 mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-DEFAULT">Invalid Link (Missing Token)</p>
        <Link href="/forgot-password" className="text-sm font-bold text-primary hover:text-accent transition-colors">Request new link</Link>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-primary mb-3 tracking-tight">Security Update</h1>
        <p className="text-secondary text-lg">Define a strong new password to protect your account.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 text-sm font-semibold rounded-DEFAULT animate-[fadeIn_0.3s_ease-out] border ${
          status === "error" 
            ? "text-red-600 bg-red-50 border-red-100" 
            : "text-blue-700 bg-blue-50 border-blue-100"
        }`}>
          {message}
        </div>
      )}

      {status !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary" htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-5 py-3.5 bg-muted/30 border border-border rounded-DEFAULT text-[0.9375rem] transition-all focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 placeholder:text-secondary/40"
              placeholder="Min. 12 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={12}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-5 py-3.5 bg-muted/30 border border-border rounded-DEFAULT text-[0.9375rem] transition-all focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 placeholder:text-secondary/40"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={12}
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 px-6 py-4 bg-primary text-white font-extrabold rounded-DEFAULT transition-all hover:bg-primary/90 hover:shadow-lg focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md" 
            disabled={status === "loading"}
          >
            {status === "loading" ? "Updating Access..." : "Update Password"}
          </button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-border/60 text-center">
        <Link href="/login" className="font-bold text-primary hover:text-accent transition-colors">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
