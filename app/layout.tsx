import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homeschool Dashboard",
  description: "A family homeschool planner — tasks, curriculum tracking, and worksheets.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
