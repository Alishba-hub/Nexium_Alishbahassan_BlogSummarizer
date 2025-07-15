import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Blog Summariser",
  description: "Summarise any blog in Urdu",
};

// src/app/layout.tsx

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* full‑viewport gradient so NO white gaps outside main container */}
      <body className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {children}
      </body>
    </html>
  );
}
