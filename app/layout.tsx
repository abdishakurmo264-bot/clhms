import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLHMS - College Lab & Hardware Management System",
  description: "Enterprise-grade College Laboratory & Hardware Management System with Zero-Host SaaS Free Tier Strategy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
