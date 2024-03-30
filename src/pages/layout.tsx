import "../styles/globals.css";
import BottomNav from "@/components/BottomNav";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">{children}</div>

      <footer className="bg-white shadow px-2">
        <BottomNav />
      </footer>
    </div>
    // </html>
  );
}
