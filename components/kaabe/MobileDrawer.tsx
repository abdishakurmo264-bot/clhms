"use client";

import React from "react";
import {
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  ClipboardCheck,
  Cpu,
  Bell,
  User,
  LogOut,
  FolderPlus,
  FileSpreadsheet,
  Sliders,
} from "lucide-react";
import { KaabeRole, UserAccount } from "@/types/kaabe";

interface MobileDrawerProps {
  isOpen: boolean;
  currentUser: UserAccount;
  activeTab: string;
  onNavigate: (viewName: string) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  currentUser,
  activeTab,
  onNavigate,
  onClose,
  onLogout,
}) => {
  if (!isOpen) return null;

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
    },
    {
      id: "assignments",
      label: "Teacher Assignments",
      icon: UserCheck,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN"],
    },
    {
      id: "requests",
      label: "Publish Lab Classes",
      icon: BookOpen,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "SUBJECT_TEACHER"],
    },
    {
      id: "my-labs",
      label: "My Labs & Daily Audit",
      icon: ClipboardCheck,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN", "LAB_TEACHER"],
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
    },
    {
      id: "reports",
      label: "A4 Printable Reports",
      icon: FileSpreadsheet,
      roles: ["SUPER_ADMIN", "LAB_CHAIRMAN"],
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
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in flex">
      <div className="w-72 bg-slate-900 border-r border-slate-800 h-full p-5 flex flex-col justify-between shadow-2xl overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/zoom_college_logo.jpg"
                alt="ZIC Logo"
                className="h-8 w-8 object-contain rounded-full ring-2 ring-orange-500 bg-white"
                onError={(e) => {
                  (e.currentTarget as any).style.display = "none";
                }}
              />
              <span className="font-extrabold text-sm text-white">ZIC Portal</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isAllowed = item.roles.includes(currentUser.role);
              const isSelected = activeTab === item.id;
              const Icon = item.icon;

              if (!isAllowed) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition-all ${
                    isSelected
                      ? "bg-orange-600 text-white font-bold shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-orange-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400">
            Role: <strong className="text-orange-400">{currentUser.role.replace("_", " ")}</strong>
          </div>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

export default MobileDrawer;
