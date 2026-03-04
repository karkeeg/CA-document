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
    <>
      <div className="auth-header">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a reset link</p>
      </div>

      {message && (
        <div className={status === "error" ? "error-message" : "success-message"}>
          {message}
        </div>
      )}

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
            disabled={status === "loading" || status === "success"}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={status === "loading" || status === "success"} 
          style={{ marginTop: "1.5rem" }}
        >
          {status === "loading" ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="auth-footer">
        Remember your password?{" "}
        <Link href="/">
          Back to Login
        </Link>
      </div>
    </>
  );
}
