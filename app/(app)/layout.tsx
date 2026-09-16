"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col" style={{ marginLeft: "var(--sidebar-width)" }}>
        <Topbar />
        <main className="relative flex-1 overflow-y-auto" style={{ marginTop: "var(--topbar-height)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
