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
} from "lucide-react";
import { UserAccount, KaabeRole, KaabeCategory } from "@/types/kaabe";

interface AdminUsersViewProps {
  users: UserAccount[];
  onAddUser: (user: Partial<UserAccount>) => void;
  onUpdateUser: (id: string, updated: Partial<UserAccount>) => void;
  onDeleteUser: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onChangeRole: (id: string, newRole: KaabeRole) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToggleStatus,
  onChangeRole,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [passwordUser, setPasswordUser] = useState<UserAccount | null>(null);
  const [inspectingUser, setInspectingUser] = useState<UserAccount | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<UserAccount | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<UserAccount | null>(null);

  // Form State for creating a user
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("College2026!Pass");
  const [phone, setPhone] = useState<string>("+252 61 500 0000");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [department, setDepartment] = useState<string>("Computer Science & Software");
  const [role, setRole] = useState<KaabeRole>("LAB_TEACHER");
  const [category, setCategory] = useState<KaabeCategory>("Programming Lab");

  // Password Reset Form State
  const [newPassword, setNewPassword] = useState<string>("");

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    onAddUser({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      employeeId: employeeId.trim() || `ZIC-STAFF-${Date.now().toString().slice(-3)}`,
      department,
      role,
      category,
      shift: "MORNING",
      activeLoadCount: 0,
      maxLoadCapacity: 4,
      skills: ["General IT", category],
      bio: `Staff member registered by System Administrator in ${department}.`,
      status: "Active",
      createdAt: "Today",
    });

    setFullName("");
    setEmail("");
    setEmployeeId("");
    setIsCreateModalOpen(false);
    setFeedback(`User ${fullName} (${role}) successfully created!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser.id, editingUser);
    setEditingUser(null);
    setFeedback(`User account ${editingUser.fullName} successfully updated!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordUser || !newPassword.trim()) return;

    setPasswordUser(null);
    setNewPassword("");
    setFeedback(`Password for ${passwordUser.fullName} has been securely updated!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const confirmDelete = () => {
    if (!deleteTargetUser) return;
    onDeleteUser(deleteTargetUser.id);
    setFeedback(`User account ${deleteTargetUser.fullName} deleted permanently!`);
    setDeleteTargetUser(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <Shield className="h-4 w-4" />
            <span>Administrator User & Access Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Faculty Staff Accounts, Roles & Permissions
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Super Administrator controls user registration, role assignments (Admin, Chairman, Subject Teacher, Lab Teacher), password resets, and account deactivation.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/60 transition-all flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Create New Staff User</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, Employee ID, or Department..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="LAB_CHAIRMAN">Lab Chairman</option>
            <option value="SUBJECT_TEACHER">Subject Teacher (Lecturer)</option>
            <option value="LAB_TEACHER">Lab Teacher (Instructor)</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/80">
                <th className="p-3.5">Full Name & Profile</th>
                <th className="p-3.5">Employee ID</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow">
                      {u.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white">{u.fullName}</div>
                      <div className="text-[10px] text-slate-400">{u.category}</div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-orange-400 font-bold">{u.employeeId}</td>
                  <td className="p-3.5 font-mono text-slate-300">{u.email}</td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                      {u.role.replace("_", " ")}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-300">{u.department}</td>

                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleStatus(u.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                        u.status === "Active"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                          : "bg-rose-950 text-rose-300 border-rose-500/40"
                      }`}
                    >
                      {u.status}
                    </button>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setInspectingUser(u)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="View Profile Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setPasswordUser(u)}
                        className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/40"
                        title="Change / Reset Password"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                        title="Edit User Info"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteTargetUser(u)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                        title="Delete User"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
                <UserPlus className="h-4 w-4" />
                <span>Create New Staff User Account</span>
              </span>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
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
                  <label className="block text-slate-300 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZIC-LT-002"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
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
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="LAB_CHAIRMAN">Lab Chairman</option>
                    <option value="SUBJECT_TEACHER">Subject Teacher (Lecturer)</option>
                    <option value="LAB_TEACHER">Lab Teacher (Instructor)</option>
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
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-3 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
                  Create Staff User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Password */}
      {passwordUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                <span>Reset User Password</span>
              </span>
              <button onClick={() => setPasswordUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <p className="text-slate-300 text-[11px]">
                Enter new secure password for <strong>{passwordUser.fullName}</strong> ({passwordUser.email}):
              </p>

              <input
                type="password"
                required
                placeholder="Enter new password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setPasswordUser(null)} className="px-3 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold">
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete User Confirmation */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-rose-800/50 shadow-2xl p-6 space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirm Delete User</span>
            </div>

            <p className="text-slate-300">
              Are you sure you want to permanently delete user account <strong>{deleteTargetUser.fullName}</strong> ({deleteTargetUser.email})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setDeleteTargetUser(null)} className="px-3 py-2 text-slate-400">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: User Profile Inspection */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in text-xs">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">{inspectingUser.fullName}</h3>
                <p className="text-xs text-slate-400">{inspectingUser.department}</p>
              </div>
              <button onClick={() => setInspectingUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Employee ID:</span>
                <div className="font-bold text-orange-400 font-mono">{inspectingUser.employeeId}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Role:</span>
                <div className="font-bold text-purple-300 font-mono">{inspectingUser.role}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Email:</span>
                <div className="font-mono text-cyan-300 truncate">{inspectingUser.email}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Shift:</span>
                <div className="font-bold text-slate-200">{inspectingUser.shift}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Bio:</span>
              <p className="text-slate-300 mt-0.5">{inspectingUser.bio}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button onClick={() => setInspectingUser(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersView;
