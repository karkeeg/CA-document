"use client";

import React from "react";

interface FolderCardProps {
  name: string;
  onClick: () => void;
  isSubfolder?: boolean;
}

export function FolderCard({ name, onClick, isSubfolder }: FolderCardProps) {
  return (
    <div 
      className="group bg-white border border-border rounded-DEFAULT p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 hover:bg-muted"
      onClick={onClick}
    >
      <div className={`text-[40px] transition-all duration-200 group-hover:text-gold-muted ${isSubfolder ? 'text-secondary' : 'text-accent'}`}>
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          {isSubfolder && <line x1="12" y1="11" x2="12" y2="17"></line>}
          {isSubfolder && <line x1="9" y1="14" x2="15" y2="14"></line>}
        </svg>
      </div>
      <span className="text-sm font-semibold text-primary text-center leading-tight">
        {name}
      </span>
    </div>
  );
}
