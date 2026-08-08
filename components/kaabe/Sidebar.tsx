"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  ClipboardCheck,
  Cpu,
  Bell,
  User,
  Shield,
  Layers,
  FileSpreadsheet,
  FolderPlus,
  Sliders,
} from "lucide-react";
import { KaabeRole } from "@/types/kaabe";

interface SidebarProps {
  currentRole: KaabeRole;
  activeTab: string;
  onNavigate: (viewName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onNavigate,
}) => {
  const navItems = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: LayoutDashboard,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "SUBJECT_TEACHER", "LAB_TEACHER"],
    },
    {
      id: "users",
      label: "Staff User Accounts",
      icon: Users,
      roles: ["SUPER_ADMIN"],
      badge: "Admin",
    },
    {
      id: "assignments",
      label: "Teacher Assignments",
      icon: UserCheck,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN"],
      badge: "Chairman",
    },
    {
      id: "requests",
      label: "Publish Lab Classes",
      icon: BookOpen,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "SUBJECT_TEACHER"],
      badge: "Lecturer",
    },
    {
      id: "my-labs",
      label: "My Labs & Daily Audit",
      icon: ClipboardCheck,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "LAB_TEACHER"],
      badge: "Audits",
    },
    {
      id: "hardware",
      label: "Hardware Inventory",
      icon: Cpu,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN"],
    },
    {
      id: "categories",
      label: "Categories & Rooms",
      icon: FolderPlus,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN"],
      badge: "Config",
    },
    {
      id: "reports",
      label: "A4 Printable Reports",
      icon: FileSpreadsheet,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN"],
      badge: "Print",
    },
    {
      id: "teachers",
      label: "Staff Directory",
      icon: Users,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "SUBJECT_TEACHER", "LAB_TEACHER"],
    },
    {
      id: "announcements",
      label: "Campus Noticeboard",
      icon: Bell,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "SUBJECT_TEACHER", "LAB_TEACHER"],
    },
    {
      id: "profile",
      label: "My Profile & Account",
      icon: User,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "SUBJECT_TEACHER", "LAB_TEACHER"],
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Sliders,
      roles: ["SUPER_ADMIN"],
      badge: "Setup",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col border-r border-slate-800/80 bg-slate-900/40 w-64 transition-all duration-300 font-sans">
      <div className="p-4 flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider px-3 mb-2">
          Navigation Modules
        </div>

        {navItems.map((item) => {
          const isAllowed = item.roles.includes(currentRole);
          const isSelected = activeTab === item.id;
          const Icon = item.icon;

          if (!isAllowed) return null;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold shadow-lg shadow-orange-950/40"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-orange-400"}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-950 text-orange-300 border border-slate-800"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-300">ZIC Portal</span>
          <span className="text-orange-400 font-mono">v1.1</span>
        </div>
        <div className="text-[10px] text-slate-500">
          Zoom International College
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
