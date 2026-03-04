"use client";

import { useState } from "react";
import { FolderCard } from "@/components/ui/FolderCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface DashboardContentProps {
  userEmail: string;
}

const FOLDERS = [
  "Address Change",
  "Amendment Of Objectives",
  "Annual Docs",
  "Capital Increase",
  "Company Registration Documents",
  "Eakal to Bahul",
  "Initial Updation",
  "Name Change",
  "sanchalak lagat",
  "Share Lagat",
];

const SUBFOLDERS = ["Ekal", "Bahul"];

export function DashboardContent({ userEmail }: DashboardContentProps) {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentSubfolder, setCurrentSubfolder] = useState<string | null>(null);

  const breadcrumbs = [
    { name: "Dashboard", onClick: () => { setCurrentFolder(null); setCurrentSubfolder(null); } },
    ...(currentFolder ? [{ name: currentFolder, onClick: () => setCurrentSubfolder(null) }] : []),
    ...(currentSubfolder ? [{ name: currentSubfolder, onClick: () => {} }] : []),
  ];

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder);
  };

  const handleSubfolderClick = (subfolder: string) => {
    setCurrentSubfolder(subfolder);
  };

  const renderContent = () => {
    if (!currentFolder) {
      return (
        <div className="folder-grid">
          {FOLDERS.map((folder) => (
            <FolderCard key={folder} name={folder} onClick={() => handleFolderClick(folder)} />
          ))}
        </div>
      );
    }

    if (!currentSubfolder) {
      return (
        <div className="folder-grid">
          {SUBFOLDERS.map((sub) => (
            <FolderCard key={sub} name={sub} onClick={() => handleSubfolderClick(sub)} isSubfolder />
          ))}
        </div>
      );
    }

    // File View / Link View
    return (
      <div className="file-view">
        <div className="file-card excel">
          <div className="file-icon">📈</div>
          <div className="file-info">
            <h4>Document Tracker.xlsx</h4>
            <p>Excel Spreadsheet • Demo Link</p>
          </div>
          <a href="#" className="btn-download" onClick={(e) => e.preventDefault()}>
            Open Sheet
          </a>
        </div>
        
        <div className="file-card docx">
          <div className="file-icon">📄</div>
          <div className="file-info">
            <h4>Application Letter.docx</h4>
            <p>Word Document</p>
          </div>
          <a href="#" className="btn-download" onClick={(e) => e.preventDefault()}>
            View Document
          </a>
        </div>

      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <div className="folder-icon" style={{ color: 'var(--accent)' }}>
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="logo-text">
            CA_<span>DOCUMENT</span>
          </div>
        </div>

        <div className="user-nav">
          <div className="user-profile">
            <div className="user-avatar">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{userEmail.split('@')[0]}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="btn-logout" title="Logout">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </form>
        </div>
      </header>

      <main className="dashboard-main">
        <Breadcrumbs items={breadcrumbs} />
        {renderContent()}
      </main>

      <style jsx>{`
        .dashboard-main {
          padding: 0 2rem 4rem;
        }
      `}</style>
    </div>
  );
}
