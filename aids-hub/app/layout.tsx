import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI&DS Hub — Student Portal",
  description: "An AI-powered academic hub for Artificial Intelligence and Data Science students.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
