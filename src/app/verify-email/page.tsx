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
        router.push("/");
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
    <div className="auth-card">
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.5rem" }}>
          Verify Email
        </h1>
        <p style={{ color: "var(--secondary)", fontSize: "0.875rem" }}>
          Check your email for the verification token.
        </p>
      </div>

      {status === "success" ? (
        <div style={{ 
          padding: "1rem", 
          background: "#ecfdf5", 
          color: "#047857", 
          borderRadius: "var(--radius)",
          textAlign: "center"
        }}>
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {status === "error" && (
            <div className="error-message">{message}</div>
          )}

          <div className="input-group">
            <label className="input-label" htmlFor="token">Verification Token</label>
            <input
              id="token"
              type="text"
              className="input-field"
              placeholder="Enter your token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={status === "loading"}
          >
            {status === "loading" ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--secondary)" }}>
        <Link href="/">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="auth-layout">
      <Suspense fallback={<div>Loading...</div>}>
         <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
