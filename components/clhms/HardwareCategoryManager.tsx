"use client";

import React, { useState, useTransition } from "react";
import {
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  Layers,
  Sparkles,
} from "lucide-react";
import { EquipmentTool, LabCategoryItem } from "@/types/clhms";

interface HardwareCategoryManagerProps {
  hardware: EquipmentTool[];
  onAddHardware: (item: Partial<EquipmentTool>) => void;
  onDeleteHardware: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const INITIAL_CATEGORIES: LabCategoryItem[] = [
  {
    id: "cat-01",
    name: "Programming Lab",
    slug: "Programming",
    description: "Dell Workstations, Web & Software Development tools",
    icon: "Code2",
    color: "cyan",
    totalHardwareCount: 25,
  },
  {
    id: "cat-02",
    name: "Technical & Cisco Lab",
    slug: "Technical",
    description: "Cisco Routers, Catalyst Switches, Patch Cables, Crimpers",
    icon: "Network",
    color: "amber",
    totalHardwareCount: 14,
  },
  {
    id: "cat-03",
    name: "Multimedia & Studio",
    slug: "Multimedia",
    description: "4K Laser Projectors, High-end GPU PCs, Studio Mic & Cameras",
    icon: "Video",
    color: "purple",
    totalHardwareCount: 8,
  },
  {
    id: "cat-04",
    name: "Cybersecurity & Hardware Repair",
    slug: "Cybersecurity",
    description: "Soldering kits, Logic analyzers, Network Tap monitors",
    icon: "Shield",
    color: "rose",
    totalHardwareCount: 6,
  },
];

export const HardwareCategoryManager: React.FC<HardwareCategoryManagerProps> = ({
  hardware,
  onAddHardware,
  onDeleteHardware,
  onToggleStatus,
}) => {
  const [categories, setCategories] = useState<LabCategoryItem[]>(INITIAL_CATEGORIES);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("Dell");

  // Add category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>("");
  const [newCatDesc, setNewCatDesc] = useState<string>("");

  // Add hardware modal state
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState<boolean>(false);
  const [assetName, setAssetName] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Programming");
  const [labRoom, setLabRoom] = useState<string>("LAB-101 (Programming)");
  const [isOperational, setIsOperational] = useState<boolean>(true);

  const [feedback, setFeedback] = useState<string | null>(null);

  // Handle category creation
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: LabCategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.trim().replace(/\s+/g, "-"),
      description: newCatDesc.trim() || "College laboratory department category",
      icon: "Layers",
      color: "cyan",
      totalHardwareCount: 0,
    };

    setCategories([...categories, newCat]);
    setNewCatName("");
    setNewCatDesc("");
    setIsCategoryModalOpen(false);
    setFeedback(`Category cusub oo ah ${newCat.name} si guul leh ayaa loo abuuray!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handle hardware creation
  const handleCreateHardware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    onAddHardware({
      name: assetName.trim(),
      serialNumber: serialNumber.trim() || `SN-AUTO-${Date.now().toString().slice(-4)}`,
      category: selectedCategory,
      labRoom,
      isOperational,
    });

    setAssetName("");
    setSerialNumber("");
    setIsHardwareModalOpen(false);
    setFeedback(`Qalabka ${assetName} si toos ah ayaa loogu diiwaangeliyay ${selectedCategory}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredHardware = hardware.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.labRoom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.serialNumber && h.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = activeCategoryFilter === "ALL" || h.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Cpu className="h-4 w-4" />
            <span>Hardware, Tools & Category Manager</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Diiwaangelinta Qalabka & Maamulka Categories-ka Lab-yada
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Abuur category-yada (Multimedia, Programming, Cisco Technical) oo si toos ah ugu diiwaangeli qalabka iyo tools-ka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="h-4 w-4 text-cyan-400" />
            <span>Abuur Category Cusub</span>
          </button>

          <button
            onClick={() => setIsHardwareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Diiwaangeli Qalab Cusub</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Lab Categories Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories-ka Labs-ka Jaamacadda</h3>
          <span className="text-[10px] text-cyan-400 font-mono">{categories.length} Categories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.slug)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                activeCategoryFilter === cat.slug
                  ? "border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500/40 shadow-lg"
                  : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{cat.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                  {cat.totalHardwareCount} Assets
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Search & Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Raadi qalab, serial number, ama lab room..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveCategoryFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeCategoryFilter === "ALL"
                  ? "bg-cyan-600 text-white font-bold"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              All Assets ({hardware.length})
            </button>
          </div>
        </div>

        {/* Hardware Assets Table with Full CRUD & Toggle Status */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/80">
                <th className="p-3.5">Magaca Qalabka (Asset Name)</th>
                <th className="p-3.5">Serial Number</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Lab Room</th>
                <th className="p-3.5">Xaaladda (Status)</th>
                <th className="p-3.5 text-right">Actions</th>
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
                        item.isOperational
                          ? "bg-emerald-950 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900"
                          : "bg-rose-950 text-rose-300 border-rose-600/40 hover:bg-rose-900 animate-pulse"
                      }`}
                    >
                      {item.isOperational ? "✓ OPERATIONAL" : "⚠ MAINTENANCE"}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onDeleteHardware(item.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Tirtir qalabkan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Category */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <FolderPlus className="h-4 w-4" />
                <span>Abuur Category Cusub oo Lab ah</span>
              </span>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Magaca Category-ga *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multimedia Studio, Robotics Lab"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sharaxaadda (Description)</label>
                <textarea
                  rows={2}
                  placeholder="Qalabka iyo maaddooyinka lagu barto qolalkan..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-3 py-2 text-slate-400">Ka noqo</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Abuur Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Hardware Asset */}
      {isHardwareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span>Diiwaangeli Qalab Cusub (Equipment Registration)</span>
              </span>
              <button onClick={() => setIsHardwareModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateHardware} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Magaca Qalabka (Asset Name) *</label>
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
                  <label className="block text-slate-300 font-semibold mb-1">Category-ga *</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Qolka Lab-ka (Lab Room) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LAB-204 (Cisco Networks), Multimedia Studio A"
                  value={labRoom}
                  onChange={(e) => setLabRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsHardwareModalOpen(false)} className="px-3 py-2 text-slate-400">Ka noqo</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Diiwaangeli Qalabka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareCategoryManager;
