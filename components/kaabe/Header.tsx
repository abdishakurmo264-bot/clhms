"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Layers,
  Sparkles,
  Radio,
  Clock,
  Crown,
  BookOpen,
  UserCheck,
  Wrench,
} from "lucide-react";
import { UserAccount, ShiftWindow } from "@/types/kaabe";

interface HeaderProps {
  currentUser: UserAccount;
  activeShift: ShiftWindow;
  onShiftChange: (shift: ShiftWindow) => void;
  onNavigate: (viewName: string) => void;
  onLogout: () => void;
  onToggleMobileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeShift,
  onShiftChange,
  onNavigate,
  onLogout,
  onToggleMobileDrawer,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 font-sans">
      {/* Brand & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileDrawer}
          className="lg:hidden p-2 rounded-xl bg-slate-800/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          onClick={() => onNavigate("overview")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-950/60 text-lg group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-base tracking-tight text-white">
              <span>KAABE</span>
              <span className="text-cyan-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/40">
                PORTAL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">College Lab & Academic Operations</p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search courses, instructors, hardware assets..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-3">
        {/* Shift Selector */}
        <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-0.5 text-[11px] font-medium">
          <button
            onClick={() => onShiftChange("MORNING")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeShift === "MORNING"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Morning (07:00 AM)
          </button>
          <button
            onClick={() => onShiftChange("AFTERNOON")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeShift === "AFTERNOON"
                ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Afternoon (04:00 PM)
          </button>
        </div>

        {/* User Profile Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-white transition-all cursor-pointer"
          >
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
              {currentUser.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-xs leading-none">{currentUser.fullName.split(" ")[0]}</div>
              <div className="text-[9px] text-cyan-400 font-mono mt-0.5">{currentUser.role.replace("_", " ")}</div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="p-3 border-b border-slate-800 space-y-0.5">
                <div className="font-bold text-white">{currentUser.fullName}</div>
                <div className="font-mono text-[10px] text-slate-400">{currentUser.email}</div>
                <div className="text-[10px] text-cyan-300 font-mono">{currentUser.employeeId}</div>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    onNavigate("profile");
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  <span>My Profile & Settings</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate("overview");
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
