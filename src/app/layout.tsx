import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CA Document",
  description: "CA Document",
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
