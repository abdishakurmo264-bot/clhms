"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Shield,
  UserCheck,
  BookOpen,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";
import { InstructorProfile, UserRole, LabCategory, ShiftType } from "@/types/clhms";

interface UserManagementModalProps {
  onRegisterUser: (user: Partial<InstructorProfile>) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  onRegisterUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole>("ROLE_LAB_TEACHER");
  const [category, setCategory] = useState<LabCategory>("Programming");
  const [shift, setShift] = useState<ShiftType>("MORNING");
  const [department, setDepartment] = useState<string>("Computer Science & Software");
  const [skills, setSkills] = useState<string>("HTML, CSS, SQL, C++");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    onRegisterUser({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      category,
      shift,
      department,
      skills: skills.split(",").map((s) => s.trim()),
      activeLoadCount: 0,
      maxLoadCount: 4,
      bio: `Instructor specializing in ${category} labs.`,
      isOnDuty: true,
    });

    setFullName("");
    setEmail("");
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <UserPlus className="h-4 w-4 text-cyan-400" />
        <span>Diiwaangeli Macallin Cusub</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <UserPlus className="h-4 w-4" />
                <span>Diiwaangeli Macallin Cusub (Register Staff)</span>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Magaca Buuxa (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Jaamac Xasan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jama.hassan@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Doorka (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="ROLE_LAB_TEACHER">Lab Instructor / Teacher</option>
                    <option value="ROLE_LECTURER">Academic Lecturer</option>
                    <option value="ROLE_LAB_HEAD">Director of Labs (Lab Head)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category-ga Lab-ka *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Programming">Programming Lab</option>
                    <option value="Technical">Technical / Cisco Lab</option>
                    <option value="Multimedia">Multimedia & Studio</option>
                    <option value="Cybersecurity">Cybersecurity Lab</option>
                    <option value="AI & Robotics">AI & Robotics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Shift-ka *</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="MORNING">Morning Shift (Subax)</option>
                    <option value="AFTERNOON">Afternoon Shift (Galab)</option>
                    <option value="BOTH">Dual Shift (Labada Shift)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Xirfadaha & Qalabka (Skills - comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Cisco BGP, OSPF, Wireshark, Patch Cabling"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-slate-400">Ka noqo</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Diiwaangeli Macallinka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementModal;
