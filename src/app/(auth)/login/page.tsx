"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [needsVerification, setNeedsVerification] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setNeedsVerification(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      let data: any = {};
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        if (res.status === 404) {
          throw new Error("Login API endpoint not found (404). Please check server logs.");
        }
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        if (res.status === 403 && data.error && data.error.includes("verified")) {
          setNeedsVerification(true);
        }
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setMessage("Sending verification email...");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Verification email sent! Check your inbox.");
      setNeedsVerification(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to send email");
    }
  };

  return (
    <>
      <div className="mb-10 animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-4xl font-extrabold text-primary mb-3 tracking-tight">Welcome Back</h1>
        <p className="text-secondary text-lg">Modern security for your professional documents.</p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-DEFAULT animate-[fadeIn_0.3s_ease-out]">
          {error}
        </div>
      )}
      
      {message && (
        <div className="p-4 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-DEFAULT animate-[fadeIn_0.3s_ease-out]">
          {message}
        </div>
      )}

      {needsVerification && (
         <button 
           type="button" 
           onClick={handleResendVerification}
           className="w-full mb-8 px-4 py-3 text-sm font-bold text-accent bg-gold-light border border-accent rounded-DEFAULT transition-all hover:bg-gold-muted/20"
         >
           Resend Verification Email
         </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-primary" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="w-full px-5 py-3.5 bg-muted/30 border border-border rounded-DEFAULT text-[0.9375rem] transition-all focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 placeholder:text-secondary/40"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-primary" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className="w-full px-5 py-3.5 bg-muted/30 border border-border rounded-DEFAULT text-[0.9375rem] transition-all focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 placeholder:text-secondary/40"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full mt-4 px-6 py-4 bg-primary text-white font-extrabold rounded-DEFAULT transition-all hover:bg-primary/90 hover:shadow-lg focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md" 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : "Sign in to Dashboard"}
        </button>
      </form>
    </>
  );
}
