"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [token, setToken] = useState(tokenFromUrl || "");
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

  useEffect(() => {
    if (tokenFromUrl) {
      handleVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleVerify = async (tokenToVerify: string) => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setStatus("success");
      setMessage("Email verified successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Verification failed");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(token);
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-primary mb-3 tracking-tight">Identity Check</h1>
        <p className="text-secondary text-lg">Validate your account to enable full access.</p>
      </div>

      {status === "success" ? (
        <div className="p-4 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-DEFAULT text-center animate-pulse">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="p-4 mb-6 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-DEFAULT">
              {message}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-primary" htmlFor="token">Verification Token</label>
            <input
              id="token"
              type="text"
              className="w-full px-5 py-3.5 bg-muted/30 border border-border rounded-DEFAULT text-[0.9375rem] transition-all focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 placeholder:text-secondary/40"
              placeholder="Paste token from email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 px-6 py-4 bg-primary text-white font-extrabold rounded-DEFAULT transition-all hover:bg-primary/90 hover:shadow-lg focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md" 
            disabled={status === "loading"}
          >
            {status === "loading" ? "Validating..." : "Verify Identity"}
          </button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-border/60 text-center">
        <p className="text-[0.9375rem] text-secondary font-medium">
          Need help? Contact support or{" "}
          <Link href="/login" className="font-bold text-primary hover:text-accent transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-secondary font-medium">Loading Identity Page...</div>}>
       <VerifyEmailContent />
    </Suspense>
  );
}
