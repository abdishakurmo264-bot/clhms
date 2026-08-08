"use client";

import React, { useState } from "react";
import {
  Wrench,
  Cpu,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Scan,
  Search,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";
import { EquipmentTool } from "@/types/clhms";

interface InventoryOfficerDashboardProps {
  hardware: EquipmentTool[];
  onAddHardware: (item: Partial<EquipmentTool>) => void;
  onDeleteHardware: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const InventoryOfficerDashboard: React.FC<InventoryOfficerDashboardProps> = ({
  hardware,
  onAddHardware,
  onDeleteHardware,
  onToggleStatus,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [selectedAssetForTransfer, setSelectedAssetForTransfer] = useState<EquipmentTool | null>(null);
  const [targetRoom, setTargetRoom] = useState<string>("LAB-204 (Cisco Networks)");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Form State
  const [assetName, setAssetName] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [category, setCategory] = useState<string>("Programming");
  const [labRoom, setLabRoom] = useState<string>("LAB-101 (Programming)");
  const [feedback, setFeedback] = useState<string | null>(null);

  const operational = hardware.filter((h) => h.isOperational);
  const maintenance = hardware.filter((h) => !h.isOperational);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    onAddHardware({
      name: assetName.trim(),
      serialNumber: serialNumber.trim() || `SN-${Date.now().toString().slice(-4)}`,
      category,
      labRoom,
      isOperational: true,
      lastInspected: "Hadda",
    });

    setAssetName("");
    setSerialNumber("");
    setIsAddModalOpen(false);
    setFeedback(`Qalabka ${assetName} si toos ah ayaa loogu daray inventory-ga!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForTransfer) return;

    setFeedback(`Qalabka ${selectedAssetForTransfer.name} waxaa loo wareejiyay ${targetRoom}!`);
    setIsTransferModalOpen(false);
    setSelectedAssetForTransfer(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredHardware = hardware.filter((h) => {
    const matchesSearch =
      (h.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.labRoom || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.serialNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || (h.category || "").includes(categoryFilter);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Wrench className="h-4 w-4" />
            <span>PRD Section 23: Inventory Officer Hardware Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Kormeerka Qalabka, Tools-ka & Wareejinta Qolalka
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Diiwaangeli qalab cusub, kormeer xaaladda kombuyuutarada iyo routers-ka, u wareeji qolalka, oo fuli Daily Inventory Verification.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/60 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Diiwaangeli Qalab Cusub</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold">Total Hardware Assets</span>
          <div className="text-3xl font-extrabold text-white">{hardware.length}</div>
          <p className="text-[11px] text-slate-400">Workstations, Routers, Switches</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
          <span className="text-emerald-400 font-semibold">Operational (Shaqaynaya)</span>
          <div className="text-3xl font-extrabold text-emerald-400">{operational.length}</div>
          <p className="text-[11px] text-slate-400">Ready for student classes</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1">
          <span className="text-rose-400 font-semibold">Maintenance / Damaged</span>
          <div className="text-3xl font-extrabold text-rose-400">{maintenance.length}</div>
          <p className="text-[11px] text-slate-400">Ciladaysan ama dayactir ku jira</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
          <span className="text-cyan-400 font-semibold">Daily Verification</span>
          <div className="text-3xl font-extrabold text-cyan-400">100%</div>
          <p className="text-[11px] text-slate-400">Signed off today</p>
        </div>
      </div>

      {/* Hardware Table & Controls */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Asset Name, Serial Number, or Lab Room..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {["ALL", "Programming", "Technical", "Multimedia"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  categoryFilter === cat
                    ? "bg-amber-600 text-white font-bold"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/80">
                <th className="p-3.5">Asset Name</th>
                <th className="p-3.5">Serial Number</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Lab Room</th>
                <th className="p-3.5">Condition Status</th>
                <th className="p-3.5 text-right">Actions & Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredHardware.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-slate-500" />
                    <span>{item.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{item.serialNumber || "—"}</td>
                  <td className="p-3.5 font-mono text-cyan-300">{item.category}</td>
                  <td className="p-3.5 text-slate-300">{item.labRoom}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        item.isOperational
                          ? "bg-emerald-950 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900"
                          : "bg-rose-950 text-rose-300 border-rose-600/40 hover:bg-rose-900 animate-pulse"
                      }`}
                    >
                      {item.isOperational ? "✓ OPERATIONAL" : "⚠ MAINTENANCE"}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAssetForTransfer(item);
                          setIsTransferModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Wareeji Qol Kale (Transfer)"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                        <span>Transfer</span>
                      </button>

                      <button
                        onClick={() => onDeleteHardware(item.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Asset"
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

      {/* Modal: Register Asset */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span>Diiwaangeli Qalab Cusub (Inventory Registration)</span>
              </span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Magaca Qalabka (Asset Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco 2901 ISR Router, Dell OptiPlex 7090"
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
                    placeholder="e.g. SN-CISCO-04"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Programming">Programming Lab</option>
                    <option value="Technical">Technical / Cisco Lab</option>
                    <option value="Multimedia">Multimedia Studio</option>
                    <option value="Cybersecurity">Cybersecurity Lab</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Qolka Lab-ka (Lab Room) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LAB-101, LAB-204"
                  value={labRoom}
                  onChange={(e) => setLabRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-2 text-slate-400">Ka noqo</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold">
                  Diiwaangeli
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Asset */}
      {isTransferModalOpen && selectedAssetForTransfer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <ArrowRightLeft className="h-4 w-4" />
                <span>Wareeji Qalabka (Hardware Room Transfer)</span>
              </span>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white">{selectedAssetForTransfer.name}</div>
                <div className="text-[10px] text-slate-400">Qolka Hadda: <strong className="text-cyan-300">{selectedAssetForTransfer.labRoom}</strong></div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">U Wareeji Qolka Cusub (Target Lab Room) *</label>
                <select
                  value={targetRoom}
                  onChange={(e) => setTargetRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="LAB-101 (Programming Lab)">LAB-101 (Programming Lab)</option>
                  <option value="LAB-204 (Cisco Networks)">LAB-204 (Cisco Networks)</option>
                  <option value="Multimedia Studio A">Multimedia Studio A</option>
                  <option value="Hardware Repair Workshop">Hardware Repair Workshop</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="px-3 py-2 text-slate-400">Ka noqo</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Xaqiiji Wareejinta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryOfficerDashboard;
