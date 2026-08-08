"use client";

import React, { useState } from "react";
import {
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Wrench,
  Search,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
} from "lucide-react";
import { HardwareToolItem, KaabeCategory } from "@/types/kaabe";

interface HardwareInventoryViewProps {
  hardware: HardwareToolItem[];
  onAddHardware: (item: Partial<HardwareToolItem>) => void;
  onDeleteHardware: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const HardwareInventoryView: React.FC<HardwareInventoryViewProps> = ({
  hardware,
  onAddHardware,
  onDeleteHardware,
  onToggleStatus,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Form State
  const [assetName, setAssetName] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [category, setCategory] = useState<KaabeCategory>("Programming Lab");
  const [labRoom, setLabRoom] = useState<string>("LAB-101 (Programming)");
  const [notes, setNotes] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const operationalCount = hardware.filter((h) => h.status === "OPERATIONAL").length;
  const maintenanceCount = hardware.length - operationalCount;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    onAddHardware({
      assetName: assetName.trim(),
      serialNumber: serialNumber.trim() || `SN-${Date.now().toString().slice(-4)}`,
      category,
      labRoom,
      status: "OPERATIONAL",
      notes: notes.trim() || undefined,
      lastVerifiedAt: "Today",
    });

    setAssetName("");
    setSerialNumber("");
    setNotes("");
    setIsAddModalOpen(false);
    setFeedback(`Equipment asset ${assetName} successfully registered!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredHardware = hardware.filter((h) => {
    const matchesSearch =
      h.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.labRoom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || h.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Cpu className="h-4 w-4" />
            <span>Hardware & Laboratory Tools Inventory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Physical Equipment & Tool Inventory Suite
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Register workstations, Cisco routers, switches, projectors, and tools with real-time operational status toggles.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/60 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Register Equipment Asset</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold">Total Physical Assets</span>
          <div className="text-3xl font-extrabold text-white">{hardware.length} Items</div>
          <p className="text-[11px] text-slate-400">Workstations, Cisco Routers, Switches</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
          <span className="text-emerald-400 font-semibold">Operational (Active)</span>
          <div className="text-3xl font-extrabold text-emerald-400">{operationalCount}</div>
          <p className="text-[11px] text-slate-400">Ready for student classes</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1">
          <span className="text-rose-400 font-semibold">Maintenance / Damaged</span>
          <div className="text-3xl font-extrabold text-rose-400">{maintenanceCount}</div>
          <p className="text-[11px] text-slate-400">Under repair or flagged</p>
        </div>
      </div>

      {/* Search & Table Toolbar */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Asset Name, Serial Number, or Lab Room..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {["ALL", "Programming Lab", "Technical & Cisco Lab", "Multimedia Studio"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  categoryFilter === cat
                    ? "bg-cyan-600 text-white font-bold"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Hardware Assets Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/80">
                <th className="p-3.5">Asset Name</th>
                <th className="p-3.5">Serial Number</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Lab Room</th>
                <th className="p-3.5">Operational Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredHardware.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-slate-500" />
                    <span>{item.assetName}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{item.serialNumber}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px] font-mono font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300">{item.labRoom}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        item.status === "OPERATIONAL"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900"
                          : "bg-rose-950 text-rose-300 border-rose-600/40 hover:bg-rose-900 animate-pulse"
                      }`}
                    >
                      {item.status === "OPERATIONAL" ? "✓ OPERATIONAL" : "⚠ MAINTENANCE"}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onDeleteHardware(item.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Asset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Equipment */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span>Register New Laboratory Equipment Asset</span>
              </span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Catalyst 3560 Switch, Dell OptiPlex 7090"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-SW-3560-01"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Programming Lab">Programming Lab</option>
                    <option value="Technical & Cisco Lab">Technical & Cisco Lab</option>
                    <option value="Multimedia Studio">Multimedia Studio</option>
                    <option value="Cybersecurity Lab">Cybersecurity Lab</option>
                    <option value="AI & Robotics">AI & Robotics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lab Room Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LAB-101 (Programming), LAB-204 (Cisco)"
                  value={labRoom}
                  onChange={(e) => setLabRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareInventoryView;
