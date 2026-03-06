"use client";

import React from 'react';

interface BreadcrumbItem {
  name: string;
  onClick: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
      {items.map((item, index) => (
        <React.Fragment key={item.name}>
          <button 
            onClick={item.onClick}
            className={`transition-colors border-none bg-transparent cursor-pointer p-0 ${index === items.length - 1 ? 'text-accent font-bold cursor-default' : 'text-secondary hover:text-primary'}`}
          >
            {item.name}
          </button>
          {index < items.length - 1 && (
            <span className="text-border">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
