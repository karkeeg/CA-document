"use client";

import React from "react";

interface SidebarProps {
  activeView: "dashboard" | "profile" | "output";
  onViewChange: (view: "dashboard" | "profile" | "output") => void;
  isMinimized: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeView, onViewChange, isMinimized, onToggle }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      id: "profile" as const,
      label: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      id: "output" as const,
      label: "Output",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <polyline points="16 16 12 12 8 16"></polyline>
          <line x1="12" y1="12" x2="12" y2="21"></line>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
          <polyline points="16 16 12 12 8 16"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <aside className={`bg-white border-r border-border flex flex-col relative transition-all duration-300 ease-in-out py-6 px-3 shrink-0 ${isMinimized ? "w-[72px]" : "w-[240px]"}`}>
      <button 
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center cursor-pointer text-secondary z-10 transition-all duration-200 hover:text-accent hover:bg-gold-light hover:border-accent shadow-sm" 
        onClick={onToggle} 
        title={isMinimized ? "Expand" : "Minimize"}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
          {isMinimized ? (
            <path d="M9 18l6-6-6-6"></path>
          ) : (
            <path d="M15 18l-6-6 6-6"></path>
          )}
        </svg>
      </button>

      <nav className="flex flex-col gap-2 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center gap-3 p-3 bg-transparent border-none rounded-DEFAULT cursor-pointer transition-all duration-200 w-full text-left font-sans font-medium text-[0.9375rem] 
              ${activeView === item.id 
                ? "bg-gold-light text-accent font-semibold" 
                : "text-secondary hover:bg-muted hover:text-primary"}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <span className="flex items-center justify-center w-6 h-6 shrink-0">{item.icon}</span>
            {!isMinimized && <span className="whitespace-nowrap overflow-hidden transition-opacity duration-300">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
