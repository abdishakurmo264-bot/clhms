"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  Plus,
  Trash2,
  Edit3,
  Layers,
  CheckCircle2,
  Sparkles,
  Cpu,
  Monitor,
  Network,
  Video,
  Shield,
  Bot,
} from "lucide-react";
import { KaabeCategory } from "@/types/kaabe";

export interface CustomCategoryDef {
  id: string;
  name: KaabeCategory | string;
  defaultRoom: string;
  capacityPCs: number;
  description: string;
  defaultTools: string;
  badgeColor: string;
}

const INITIAL_CATEGORY_LIST: CustomCategoryDef[] = [
  {
    id: "cat-01",
    name: "Programming Lab",
    defaultRoom: "LAB-101 (Programming)",
    capacityPCs: 30,
    description: "Software engineering, Full-stack web, PostgreSQL, Python, and C++ development.",
    defaultTools: "Dell OptiPlex Core i7, VS Code, Node.js, pgAdmin",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
  },
  {
    id: "cat-02",
    name: "Technical & Cisco Lab",
    defaultRoom: "LAB-204 (Cisco Networks)",
    capacityPCs: 24,
    description: "Cisco 2901 Routers, Catalyst 2960 Switches, BGP Peering & RJ45 Patch Cabling.",
    defaultTools: "Cisco Routers, Catalyst Switches, PuTTY, RJ45 Crimpers",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-500/40",
  },
  {
    id: "cat-03",
    name: "Multimedia Studio",
    defaultRoom: "Multimedia Studio A",
    capacityPCs: 20,
    description: "4K Video Editing, Adobe Premiere, Studio sound recording & broadcast cameras.",
    defaultTools: "Epson 4K Laser Projector, GPU Workstations, Studio Mics",
    badgeColor: "bg-purple-950/80 text-purple-300 border-purple-500/40",
  },
  {
    id: "cat-04",
    name: "Cybersecurity Lab",
    defaultRoom: "LAB-302 (Cybersecurity)",
    capacityPCs: 22,
    description: "Network security, ethical hacking, Wireshark packet capture & cryptography.",
    defaultTools: "Kali Linux Workstations, Network Tap Monitors, Firewall Pods",
    badgeColor: "bg-rose-950/80 text-rose-300 border-rose-500/40",
  },
  {
    id: "cat-05",
    name: "AI & Robotics",
    defaultRoom: "Robotics Innovation Hub",
    capacityPCs: 18,
    description: "Embedded microcontrollers, Arduino, Raspberry Pi, and machine learning models.",
    defaultTools: "NVIDIA Jetson, Arduino Kits, Soldering Stations",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
  },
];

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<CustomCategoryDef[]>(INITIAL_CATEGORY_LIST);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCat, setEditingCat] = useState<CustomCategoryDef | null>(null);

  // Form State
  const [name, setName] = useState<string>("");
  const [defaultRoom, setDefaultRoom] = useState<string>("LAB-101");
  const [capacityPCs, setCapacityPCs] = useState<number>(25);
  const [description, setDescription] = useState<string>("");
  const [defaultTools, setDefaultTools] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCat) {
      setCategories(
        categories.map((c) =>
          c.id === editingCat.id
            ? {
                ...c,
                name: name.trim(),
                defaultRoom: defaultRoom.trim(),
                capacityPCs,
                description: description.trim(),
                defaultTools: defaultTools.trim(),
              }
            : c
        )
      );
      setEditingCat(null);
      setFeedback(`Category ${name} updated successfully!`);
    } else {
      const created: CustomCategoryDef = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        defaultRoom: defaultRoom.trim(),
        capacityPCs,
        description: description.trim(),
        defaultTools: defaultTools.trim(),
        badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
      };
      setCategories([...categories, created]);
      setFeedback(`New laboratory category ${name} created successfully!`);
    }

    setName("");
    setDescription("");
    setDefaultTools("");
    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const openEdit = (cat: CustomCategoryDef) => {
    setEditingCat(cat);
    setName(cat.name as string);
    setDefaultRoom(cat.defaultRoom);
    setCapacityPCs(cat.capacityPCs);
    setDescription(cat.description);
    setDefaultTools(cat.defaultTools);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Layers className="h-4 w-4" />
            <span>Laboratory Categories & Dynamic Fields Configuration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Manage Laboratory Categories & Default Rooms
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure academic lab departments (Programming, Cisco Technical, Multimedia, Robotics), room capacities, and default hardware toolkits.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCat(null);
            setName("");
            setDescription("");
            setDefaultTools("");
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center gap-2 transition-all cursor-pointer"
        >
          <FolderPlus className="h-4 w-4" />
          <span>+ Add New Lab Category</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-base text-white">{cat.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800">
                  {cat.capacityPCs} Workstations
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Default Room & Location:</span>
                <p className="text-cyan-300 font-mono">{cat.defaultRoom}</p>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                {cat.description}
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-indigo-300">Default Tools & Setup:</span>
                <p className="font-mono text-[11px] text-slate-400">{cat.defaultTools}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => openEdit(cat)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                title="Delete Category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <FolderPlus className="h-4 w-4" />
                <span>{editingCat ? "Edit Category Setup" : "Create New Lab Category"}</span>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Robotics, Multimedia Studio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Default Lab Room *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LAB-101, Studio A"
                    value={defaultRoom}
                    onChange={(e) => setDefaultRoom(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Workstations Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={capacityPCs}
                    onChange={(e) => setCapacityPCs(parseInt(e.target.value) || 20)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the academic modules and software taught in this lab..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Default Tools & Hardware Requirements</label>
                <input
                  type="text"
                  placeholder="e.g. Dell OptiPlex PCs, Projector, Cisco Routers, PuTTY"
                  value={defaultTools}
                  onChange={(e) => setDefaultTools(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
