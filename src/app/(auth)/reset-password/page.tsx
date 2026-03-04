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
        router.push("/");
      }, 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Reset failed");
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <p className="error-message">Invalid Link (Missing Token)</p>
        <Link href="/forgot-password">Request new link</Link>
      </div>
    );
  }

  return (
    <>
      <div className="auth-header">
        <h1>Reset Password</h1>
        <p>Enter your new password below</p>
      </div>

      {message && (
        <div className={status === "error" ? "error-message" : "success-message"}>
          {message}
        </div>
      )}

      {status !== "success" && (
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="password">New Password</label>
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
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="input-field"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={12}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={status === "loading"} 
            style={{ marginTop: "1.5rem" }}
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <div className="auth-footer">
        <Link href="/">
          Back to Login
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
