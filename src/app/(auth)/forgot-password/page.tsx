"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "error" || status === "success") {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus("idle");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message || "If an account exists, a reset link has been sent.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to send reset link");
    }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-primary mb-3 tracking-tight">Recover Access</h1>
        <p className="text-secondary text-lg">Enter your email to receive a secure reset link.</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-primary" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="w-full px-5 py-3.5 bg-muted/30 border border-border rounded-DEFAULT text-[0.9375rem] transition-all focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 placeholder:text-secondary/40 disabled:opacity-50"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading" || status === "success"}
          />
        </div>

        <button 
          type="submit" 
          className="w-full mt-4 px-6 py-4 bg-primary text-white font-extrabold rounded-DEFAULT transition-all hover:bg-primary/90 hover:shadow-lg focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md" 
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Sending Link..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-border/60 text-center">
        <p className="text-[0.9375rem] text-secondary font-medium">
          Remember your password?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-accent transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
