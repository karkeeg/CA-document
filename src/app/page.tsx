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

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error.includes("verified")) {
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
      setMessage("Verification email sent! Check your inbox (or server console).");
      setNeedsVerification(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to send email");
    }
  };

  return (
    <main className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Please enter your details to sign in</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div style={{ padding: "0.75rem", background: "#f0f9ff", color: "#0369a1", borderRadius: "0.5rem", marginBottom: "1rem" }}>{message}</div>}

        {needsVerification && (
           <button 
             type="button" 
             onClick={handleResendVerification}
             className="btn-secondary-outline"
             style={{ width: "100%", marginBottom: "1.5rem" }}
           >
             Resend Verification Email
           </button>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group" style={{ marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="input-label" htmlFor="password">Password</label>
              <Link href="/forgot-password" style={{ fontSize: "0.875rem" }}>
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1.5rem" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link href="/signup">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
