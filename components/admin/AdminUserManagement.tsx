"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Eye,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  History,
  Check,
  X,
  Sparkles,
  Sliders,
  ChevronDown,
  Layers,
} from "lucide-react";
import { InstructorProfile, UserRole } from "@/types/clhms";

export interface AuditLogItem {
  id: string;
  actorName: string;
  action: string;
  entityType: string;
  description: string;
  timestamp: string;
}

interface AdminUserManagementProps {
  users: InstructorProfile[];
  auditLogs: AuditLogItem[];
  onAddUser: (user: Partial<InstructorProfile>) => void;
  onUpdateUser: (id: string, updated: Partial<InstructorProfile>) => void;
  onDeactivateUser: (id: string) => void;
  onReactivateUser: (id: string) => void;
  onChangeRole: (id: string, newRole: UserRole) => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  users,
  auditLogs,
  onAddUser,
  onUpdateUser,
  onDeactivateUser,
  onReactivateUser,
  onChangeRole,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<InstructorProfile | null>(null);
  const [inspectingUser, setInspectingUser] = useState<InstructorProfile | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<InstructorProfile | null>(null);
  const [isAuditLogsModalOpen, setIsAuditLogsModalOpen] = useState<boolean>(false);

  // Form State for creating a user (PRD Section 13)
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("College2026!Pass");
  const [phone, setPhone] = useState<string>("+252 61 500 0000");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [department, setDepartment] = useState<string>("Computer Science & Software");
  const [role, setRole] = useState<UserRole>("ROLE_LAB_TEACHER");
  const [accountStatus, setAccountStatus] = useState<string>("Active");
  const [specialization, setSpecialization] = useState<string>("Programming");

  const [feedback, setFeedback] = useState<string | null>(null);

  // Submit Create User
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !employeeId.trim()) return;

    onAddUser({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      employee_id: employeeId.trim(),
      department,
      role,
      category: specialization as any,
      activeLoadCount: 0,
      maxLoadCount: 4,
      skills: ["General IT", specialization],
      bio: `Staff member registered by System Admin in ${department}.`,
      isOnDuty: true,
    });

    setFullName("");
    setEmail("");
    setEmployeeId("");
    setIsCreateModalOpen(false);
    setFeedback(`User ${fullName} (${role}) si guul leh ayaa loo abuuray!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Submit Edit User
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser.id, editingUser);
    setEditingUser(null);
    setFeedback(`Xogta ${editingUser.fullName} waa la cusbooneysiiyay!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Role permissions catalog based on PRD Section 7 & 8
  const getRolePermissions = (r: UserRole) => {
    const all = [
      { name: "users.create", module: "Users", allowed: r === "ROLE_ADMIN" },
      { name: "users.read", module: "Users", allowed: true },
      { name: "users.update", module: "Users", allowed: r === "ROLE_ADMIN" },
      { name: "users.delete", module: "Users", allowed: r === "ROLE_ADMIN" },
      { name: "roles.manage", module: "Users", allowed: r === "ROLE_ADMIN" },
      { name: "labs.create", module: "Labs", allowed: r === "ROLE_ADMIN" || r === "ROLE_LECTURER" || (r as string) === "SUBJECT_TEACHER" || r === "ROLE_LAB_HEAD" || (r as string) === "LAB_CHAIRMAN" },
      { name: "labs.approve", module: "Labs", allowed: r === "ROLE_ADMIN" || r === "ROLE_LAB_HEAD" || (r as string) === "LAB_CHAIRMAN" },
      { name: "labs.assign", module: "Labs", allowed: r === "ROLE_ADMIN" || r === "ROLE_LAB_HEAD" || (r as string) === "LAB_CHAIRMAN" },
      { name: "labs.complete", module: "Labs", allowed: r === "ROLE_ADMIN" || r === "ROLE_LAB_TEACHER" || (r as string) === "LAB_TEACHER" || r === "ROLE_LAB_HEAD" },
      { name: "hardware.create", module: "Hardware", allowed: r === "ROLE_ADMIN" || (r as string) === "INVENTORY_OFFICER" || r === "ROLE_LAB_HEAD" },
      { name: "hardware.verify", module: "Hardware", allowed: r === "ROLE_ADMIN" || (r as string) === "INVENTORY_OFFICER" || r === "ROLE_LAB_TEACHER" },
      { name: "hardware.transfer", module: "Hardware", allowed: r === "ROLE_ADMIN" || (r as string) === "INVENTORY_OFFICER" },
      { name: "reports.export", module: "Reports", allowed: r === "ROLE_ADMIN" || (r as string) === "COLLEGE_MANAGEMENT" || r === "ROLE_LAB_HEAD" },
    ];
    return all;
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.fullName || u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.employee_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || (u.isOnDuty ? "Active" : "Inactive") === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <Shield className="h-4 w-4" />
            <span>PRD Section 12: Admin User & Role Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Maamulka Akoonnada Shaqaalaha & Xeerarka (RBAC)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Admin-ku wuxuu halkan ka abuuraa user kasta, ku meeleeyaa Role-ka, maamulaa permissions-ka, oo la socdaa Activity Audit Logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAuditLogsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <History className="h-4 w-4 text-cyan-400" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Abuur User Cusub (Create User)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search & Filter Toolbar (PRD Section 12) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, Employee ID (LT-001, CHM-001), Department..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Role Filter Dropdown */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="ROLE_ADMIN">System Admin</option>
              <option value="ROLE_LAB_HEAD">Lab Chairman</option>
              <option value="ROLE_LAB_TEACHER">Lab Teacher</option>
              <option value="ROLE_LECTURER">Subject Teacher</option>
              <option value="INVENTORY_OFFICER">Inventory Officer</option>
              <option value="COLLEGE_MANAGEMENT">College Management</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive / Suspended</option>
            </select>
          </div>
        </div>

        {/* User Management Table (PRD Section 34) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/80">
                <th className="p-3.5">User Profile & Name</th>
                <th className="p-3.5">Employee ID</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((u) => {
                const name = u.fullName || u.full_name || "Staff Member";
                const empId = u.employee_id || u.phone || "EMP-000";
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name & Avatar */}
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                        {name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white">{name}</div>
                        <div className="text-[10px] text-slate-400">{u.specialization || "General IT"}</div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="p-3.5 font-mono text-cyan-300 font-bold">{empId}</td>

                    {/* Email */}
                    <td className="p-3.5 font-mono text-slate-300">{u.email}</td>

                    {/* Role Badge */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                        {u.role.replace("ROLE_", "")}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="p-3.5 text-slate-300">{u.department}</td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.isOnDuty !== false
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                            : "bg-rose-950 text-rose-300 border-rose-500/40"
                        }`}
                      >
                        {u.isOnDuty !== false ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingUser(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="View Profile Details (/admin/users/[id])"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => setPermissionsUser(u)}
                          className="p-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/40"
                          title="Inspect Role Permissions"
                        >
                          <Lock className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                          title="Edit User & Change Role"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {u.isOnDuty !== false ? (
                          <button
                            onClick={() => onDeactivateUser(u.id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                            title="Deactivate / Suspend User"
                          >
                            <Unlock className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onReactivateUser(u.id)}
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40"
                            title="Reactivate User"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CREATE USER (PRD Section 13) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
                <UserPlus className="h-4 w-4" />
                <span>Create User Account (PRD Section 13)</span>
              </span>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                1. Account Information
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmed Mohamed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="ahmed@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider pt-2 border-t border-slate-800">
                2. Employee & Access Control
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LT-002, CHM-002"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Assign Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="ROLE_ADMIN">System Admin</option>
                    <option value="ROLE_LAB_HEAD">Lab Chairman</option>
                    <option value="ROLE_LAB_TEACHER">Lab Teacher</option>
                    <option value="ROLE_LECTURER">Subject Teacher</option>
                    <option value="INVENTORY_OFFICER">Inventory Officer</option>
                    <option value="COLLEGE_MANAGEMENT">College Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Computer Science & Software">Computer Science</option>
                    <option value="Networking & Telecommunications">Networking & Cisco</option>
                    <option value="Multimedia & Digital Media">Multimedia Studio</option>
                    <option value="Cybersecurity & Forensics">Cybersecurity</option>
                    <option value="Technical & Hardware Repair">Technical Repair</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-3 py-2 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
                  Create User (Supabase Auth & Profile)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER & ROLE CHANGE WITH AUDIT (PRD Section 14, 16) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <Edit3 className="h-4 w-4" />
                <span>Edit User & Change Role (Audit Trail)</span>
              </span>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName || editingUser.full_name}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Change Role (PRD Section 16)</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => {
                    const newR = e.target.value as UserRole;
                    setEditingUser({ ...editingUser, role: newR });
                    onChangeRole(editingUser.id, newR);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="ROLE_ADMIN">System Admin</option>
                  <option value="ROLE_LAB_HEAD">Lab Chairman</option>
                  <option value="ROLE_LAB_TEACHER">Lab Teacher</option>
                  <option value="ROLE_LECTURER">Subject Teacher</option>
                  <option value="INVENTORY_OFFICER">Inventory Officer</option>
                  <option value="COLLEGE_MANAGEMENT">College Management</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setEditingUser(null)} className="px-3 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PERMISSIONS MATRIX VIEW (PRD Section 36) */}
      {permissionsUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-800/50 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Permissions Matrix: {permissionsUser.fullName || permissionsUser.full_name}
                </h3>
                <p className="text-[11px] text-purple-300 font-mono">Role: {permissionsUser.role.replace("ROLE_", "")}</p>
              </div>
              <button onClick={() => setPermissionsUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 text-xs">
              {getRolePermissions(permissionsUser.role).map((p, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    p.allowed
                      ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-500 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[11px]">{p.allowed ? "✓" : "✗"}</span>
                    <span className="font-mono text-xs">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-900">
                    {p.module}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>Admin manages permissions via Role assignment.</span>
              <button onClick={() => setPermissionsUser(null)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: AUDIT LOGS TRAIL (PRD Section 31, 32) */}
      {isAuditLogsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <History className="h-4 w-4" />
                <span>System User Activity & Audit Logs (PRD Section 31)</span>
              </span>
              <button onClick={() => setIsAuditLogsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-300 text-[11px]">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{log.description}</p>
                  <div className="text-[10px] text-slate-400">Actor: <strong className="text-white">{log.actorName}</strong></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: USER PROFILE DETAIL PAGE (/admin/users/[userId] - PRD Section 35) */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-600 flex items-center justify-center font-bold text-white text-base shadow-lg">
                  {(inspectingUser.fullName || inspectingUser.full_name || "ST").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{inspectingUser.fullName || inspectingUser.full_name}</h3>
                  <p className="text-xs text-slate-400">{inspectingUser.department}</p>
                </div>
              </div>
              <button onClick={() => setInspectingUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400">Employee ID:</span>
                <div className="font-bold text-cyan-300 font-mono">{inspectingUser.employee_id || "ADM-001"}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400">Role Assigned:</span>
                <div className="font-bold text-purple-300 font-mono">{inspectingUser.role.replace("ROLE_", "")}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400">Email:</span>
                <div className="font-mono text-slate-200 truncate">{inspectingUser.email}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400">Active Load Count:</span>
                <div className="font-bold text-emerald-300 font-mono">{inspectingUser.activeLoadCount || 0} / 4 Classes</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Professional Bio & Specialization:</span>
              <p className="text-slate-300 leading-relaxed">{inspectingUser.bio || "Staff member active in lab operations."}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button onClick={() => setInspectingUser(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
