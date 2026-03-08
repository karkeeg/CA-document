"use client";

import { useState } from "react";
import { FolderCard } from "@/components/ui/FolderCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

import { Sidebar } from "./Sidebar";

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

const FOLDER_LINKS: Record<string, string> = {
  "Share Lagat":
    "https://docs.google.com/spreadsheets/d/1T2xCfx0UDpJ_NDfvtK3HGCmHUBGIU8cIHeyHVX89GdM/edit?gid=1866054730#gid=1866054730",
  "Name Change":
    "https://docs.google.com/spreadsheets/d/1Dar7IKb53ZroJWCqpQfBtsf9jEPXahMpKrVQvX6I29o/edit?gid=812097579#gid=812097579",
  "Company Registration Documents":
    "https://docs.google.com/spreadsheets/d/14p0wjJoovZeUtwDwKqp183uPjTzdpOMHDKXy8tmKZJ4/edit?gid=1046074706#gid=1046074706",
  "Amendment Of Objectives":
    "https://docs.google.com/spreadsheets/d/1IUfiWhWxzTlg0uyt7s8ZMwV0smLGcVkgPwv8pPFTXdo/edit?gid=285174755#gid=285174755",
  "Address Change":
    "https://docs.google.com/spreadsheets/d/1HyfBNTRCAbYmzjEdbznN-AOnj6Tgwsnlr9JkKDS57ms/edit?gid=577051600#gid=577051600",
  "sanchalak lagat":
    "https://docs.google.com/spreadsheets/d/15yCisnchHmQZR6Klp2cBsRzHsfjx2NegJb47K6cBPGA/edit?gid=1272506669#gid=1272506669",
  "Capital Increase":
    "https://docs.google.com/spreadsheets/d/1jggENHrHibF3LgYcPFoDJ38lueL038gOo-zeSp3HUYM/edit?gid=1656603210#gid=1656603210",
  "Eakal to Bahul":
    "https://docs.google.com/spreadsheets/d/1vixNCXvs0atmAWnyZBxkOFB_dlJVbY-CLa_GrSHBVt0/edit?gid=418571013#gid=418571013",
};

const OUTPUT_LINKS: Record<string, string> = {
  "Share Lagat":
    "https://drive.google.com/drive/folders/1K02AGpV7G91YCU4Q-Sd2yASC9nHwUoy6",
  "Name Change":
    "https://drive.google.com/drive/folders/1uOuFjS5cAxDPejqEnry2IlDhPU-TzPw-",
  "Company Registration Documents":
    "https://drive.google.com/drive/folders/18lIdV79JJRxzX0Zi1j3aHobS6tDSPi9o",
  "Amendment Of Objectives":
    "https://drive.google.com/drive/folders/1AZG-9uDvWMRtEqMAjaTvhZj2aji5fVkG",
  "Address Change":
    "https://drive.google.com/drive/folders/1Rn98ay9wslTv-HTU121m7xULyoWpmmcP",
  "sanchalak lagat":
    "https://drive.google.com/drive/folders/1ef9Z5BnOf1ne5Rmf0oEDPbHQ0j8WzEka",
  "Capital Increase":
    "https://drive.google.com/drive/folders/1SFBF4KmT-RRBXtLVPhZgW6mXXwGrgzHn",
  "Eakal to Bahul":
    "https://drive.google.com/drive/folders/1bnDTLtSeTV3JTqnD6K8h1OKhoegI_7R2",
};

type ViewType = "dashboard" | "profile" | "output";

export function DashboardContent({ userEmail }: DashboardContentProps) {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // User creation state
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [creationStatus, setCreationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [creationMessage, setCreationMessage] = useState("");

  const breadcrumbs = [
    {
      name:
        activeView === "dashboard"
          ? "Dashboard"
          : activeView.charAt(0).toUpperCase() + activeView.slice(1),
      onClick: () => setCurrentFolder(null),
    },
    ...(currentFolder ? [{ name: currentFolder, onClick: () => {} }] : []),
  ];

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreationStatus("loading");
    setCreationMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
        }),
      });

      const contentType = res.headers.get("content-type");
      let data: any = {};

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON signup response:", text);
        if (res.status === 404) throw new Error("Signup API not found (404)");
        throw new Error(`Server error: ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setCreationStatus("success");
      setCreationMessage("User created successfully! They can now log in.");
      setNewUserEmail("");
      setNewUserPassword("");
    } catch (err: any) {
      setCreationStatus("error");
      if (
        err.message?.includes("P1001") ||
        err.message?.includes("database server")
      ) {
        setCreationMessage(
          "Database is temporarily unreachable. Please try again soon.",
        );
      } else {
        setCreationMessage(
          err instanceof Error ? err.message : "Failed to create user",
        );
      }
    }
  };

  const renderDashboard = () => {
    if (!currentFolder) {
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {FOLDERS.map((folder) => (
            <FolderCard
              key={folder}
              name={folder}
              onClick={() => handleFolderClick(folder)}
            />
          ))}
        </div>
      );
    }

    const excelLink = FOLDER_LINKS[currentFolder];

    return (
      <div className="max-w-3xl animate-[fadeIn_0.3s_ease-out]">
        {excelLink ? (
          <a
            href={excelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-white border border-border rounded-DEFAULT no-underline transition-all hover:bg-muted group shadow-sm hover:shadow-md"
          >
            <div className="text-4xl">📈</div>
            <div className="flex-1">
              <h4 className="m-0 text-primary font-bold text-lg">
                {currentFolder} Sheet
              </h4>
              <p className="m-1 text-secondary text-sm">
                Google Spreadsheet • Click to open in new tab
              </p>
            </div>
            <div className="text-secondary opacity-50 transition-all group-hover:opacity-100 group-hover:text-accent">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>
          </a>
        ) : (
          <div className="p-12 text-center bg-white border border-dashed border-border rounded-DEFAULT">
            <div className="text-4xl mb-4">📂</div>
            <h4 className="text-primary font-bold mb-2">No File Linked</h4>
            <p className="text-secondary text-sm">
              There is no specific spreadsheet linked for "{currentFolder}" yet.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="p-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white border border-border rounded-DEFAULT p-8 flex flex-col items-center h-fit">
          <div className="w-[120px] h-[120px] bg-gold-light text-accent border-4 border-accent rounded-full mb-6 flex items-center justify-center text-5xl font-extrabold shadow-sm">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">
            {userEmail.split("@")[0]}
          </h2>

          <div className="w-full mt-8 pt-6 border-t border-border space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                Email
              </label>
              <div className="text-sm font-medium text-primary break-all">
                {userEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Administrative Console / Add User */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-border rounded-DEFAULT p-8">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Add New User
            </h3>

            {creationMessage && (
              <div
                className={`p-4 mb-6 text-sm font-medium rounded-DEFAULT border ${
                  creationStatus === "success"
                    ? "bg-green-50 border-green-100 text-green-700"
                    : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                {creationMessage}
              </div>
            )}

            <form
              onSubmit={handleCreateUser}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-sm font-bold text-primary">
                  User Email Address
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-5 py-3 bg-muted/30 border border-border rounded-DEFAULT focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-sm placeholder:text-secondary/40 font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-primary">
                  Temporary Password
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-muted/30 border border-border rounded-DEFAULT focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-sm placeholder:text-secondary/40 font-medium"
                  placeholder="Min. 12 characters"
                  required
                  minLength={12}
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={creationStatus === "loading"}
                  className="px-8 py-3.5 bg-primary text-white font-extrabold rounded-DEFAULT hover:bg-primary/90 transition-all text-sm disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center gap-3 min-w-[160px]"
                >
                  {creationStatus === "loading" ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-border rounded-DEFAULT p-8">
            <h3 className="text-xl font-bold text-primary mb-4 pb-3 border-b border-border">
              System Info
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-secondary">
                  Account Status
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-secondary">
                  Last Login
                </span>
                <span className="text-sm font-bold text-primary">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOutput = () => {
    if (!currentFolder) {
      return (
        <div className="p-8 max-w-[1400px] mx-auto animate-[fadeIn_0.4s_ease-out]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Output Documents
            </h2>
            <p className="text-secondary text-sm">
              Select a category to view generated output links
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {FOLDERS.map((folder) => (
              <FolderCard
                key={folder}
                name={folder}
                onClick={() => handleFolderClick(folder)}
              />
            ))}
          </div>
        </div>
      );
    }

    const driveLink = OUTPUT_LINKS[currentFolder];

    return (
      <div className="p-8 max-w-[1400px] mx-auto animate-[fadeIn_0.4s_ease-out]">
        <Breadcrumbs items={breadcrumbs} />
        <div className="max-w-3xl mt-6">
          <div className="bg-white border border-border rounded-DEFAULT p-12 text-center flex flex-col items-center gap-6 shadow-sm group">
            <div className="w-20 h-20 bg-gold-light text-accent rounded-full border-2 border-accent flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
              <svg
                viewBox="0 0 24 24"
                width="36"
                height="36"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-primary m-0 tracking-tight">
              {currentFolder} Output
            </h2>
            <p className="text-secondary leading-relaxed m-0 max-w-md">
              {driveLink
                ? "The Google Drive folder containing the output documents for this category is ready."
                : "The Google Drive folder for these outputs will be linked here shortly."}
            </p>
            {driveLink ? (
              <a
                href={driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-primary text-white font-bold rounded-DEFAULT hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Open Google Drive Folder
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ) : (
              <button className="px-6 py-2.5 bg-muted text-secondary font-bold rounded-DEFAULT cursor-not-allowed text-sm">
                Link Coming Soon
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return renderProfile();
      case "output":
        return renderOutput();
      default:
        return (
          <div className="p-8 max-w-[1400px] mx-auto">
            <Breadcrumbs items={breadcrumbs} />
            {renderDashboard()}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-[73px] bg-white border-b border-border px-8 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-accent">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="text-xl font-extrabold text-primary tracking-tighter">
            CA_<span className="text-accent">DOCUMENT</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-border">
            <div className="w-9 h-9 bg-gold-light text-accent rounded-full flex items-center justify-center font-bold border border-gold-muted/30">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary leading-tight">
                {userEmail.split("@")[0]}
              </span>
              <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                Administrator
              </span>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-secondary transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200"
              title="Logout"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 bg-background">
        <Sidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            setCurrentFolder(null); // Reset folder when switching views
          }}
          isMinimized={isSidebarMinimized}
          onToggle={() => setIsSidebarMinimized(!isSidebarMinimized)}
        />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
