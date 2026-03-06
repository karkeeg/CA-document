"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-primary mb-3 tracking-tight">Access Control</h1>
        <p className="text-secondary text-lg">This is a private administrative system.</p>
      </div>

      <div className="p-8 bg-muted/30 border border-dashed border-border rounded-DEFAULT text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-primary font-bold mb-2 text-lg">Restricted Access</h3>
        <p className="text-secondary text-sm leading-relaxed mb-6">
          Account creation is managed by system administrators. If you need access, please contact your administrator.
        </p>
        <Link 
          href="/login" 
          className="inline-block px-8 py-3 bg-primary text-white font-extrabold rounded-DEFAULT hover:shadow-lg transition-all"
        >
          Return to Login
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-border/60 text-center">
        <span className="text-xs font-bold text-secondary/40 uppercase tracking-widest">
          Secure System Access Group
        </span>
      </div>
    </div>
  );
}
