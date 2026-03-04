"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      if (data.requiresVerification) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Join CA-Document for zero-trust protection</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">Email Address</label>
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
        <div className="input-group">
          <label className="input-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input-field"
            placeholder="Min. 12 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={12}
          />
          <p className="input-helper">
            Use at least 12 characters with a mix of letters and symbols.
          </p>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1.5rem" }}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{" "}
        <Link href="/login">
          Sign in
        </Link>
      </div>
    </>
  );
}
