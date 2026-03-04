"use client";

import React from "react";

interface BreadcrumbItem {
  name: string;
  onClick: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <button
            onClick={item.onClick}
            className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
            disabled={index === items.length - 1}
          >
            {item.name}
          </button>
          {index < items.length - 1 && <span className="breadcrumb-separator">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
