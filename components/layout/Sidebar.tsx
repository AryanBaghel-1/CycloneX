"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Radar,
  AlertTriangle,
  ScanSearch,
  History,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Cyclones", href: ROUTES.CYCLONES, icon: Radar },
  { label: "Alerts", href: ROUTES.ALERTS, icon: AlertTriangle },
  { label: "Analysis", href: ROUTES.ANALYSIS, icon: ScanSearch },
  { label: "History", href: ROUTES.HISTORY, icon: History },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
  { label: "About", href: ROUTES.ABOUT, icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[var(--border-subtle)] px-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
            <Radar className="h-4 w-4 text-amber-400" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-wider text-[var(--text-primary)] whitespace-nowrap">
              CYCLONE
            </span>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)] border border-transparent"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-amber-400" : "text-[var(--text-muted)]"
                )}
              />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="border-t border-[var(--border-subtle)] px-2 py-3 space-y-0.5">
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)] border border-transparent"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-amber-400" : "text-[var(--text-muted)]"
                )}
              />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-secondary)] transition-all duration-150 border border-transparent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
