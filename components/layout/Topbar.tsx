"use client";

import { useState, useEffect } from "react";
import { Bell, Signal, Clock } from "lucide-react";

export default function Topbar() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short",
        })
      );
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-[var(--sidebar-width)] z-30 flex h-14 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md px-5 transition-all duration-300">
      {/* Left: System status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-emerald-400 tracking-wide">
            SYSTEM ONLINE
          </span>
        </div>
        <div className="h-4 w-px bg-[var(--border-subtle)]" />
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Signal className="h-3 w-3" />
          <span>4 Active Cyclones</span>
        </div>
      </div>

      {/* Right: Time + Notifications */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-mono">
          <Clock className="h-3 w-3 text-[var(--text-muted)]" />
          <span>{currentTime || "Loading..."}</span>
        </div>
        <div className="h-4 w-px bg-[var(--border-subtle)]" />
        <button className="relative rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-secondary)] transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
