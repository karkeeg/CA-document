"use client";

import React from "react";

interface FolderCardProps {
  name: string;
  onClick: () => void;
  isSubfolder?: boolean;
}

export function FolderCard({ name, onClick, isSubfolder }: FolderCardProps) {
  return (
    <div className="folder-card" onClick={onClick}>
      <div className="folder-icon">
        <svg
          viewBox="0 0 24 24"
          width="48"
          height="48"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          {isSubfolder && <line x1="12" y1="11" x2="12" y2="17"></line>}
          {isSubfolder && <line x1="9" y1="14" x2="15" y2="14"></line>}
        </svg>
      </div>
      <h3 className="folder-name">{name}</h3>
    </div>
  );
}
