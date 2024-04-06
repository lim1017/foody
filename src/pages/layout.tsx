import "../styles/globals.css";
import BottomNav from "@/components/BottomNav";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-hidden">{children}</div>

      <footer className="bg-white shadow px-2">
        <BottomNav />
      </footer>
    </div>
  );
}
