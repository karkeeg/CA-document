import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zero Trust Auth",
  description: "Secure Authentication System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
