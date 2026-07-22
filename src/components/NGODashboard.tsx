'use client';
import React, { useState } from 'react';
import { ResourceItem } from '@/types';
import { Building2, Package, Plus } from 'lucide-react';

interface NGODashboardProps {
  resources: ResourceItem[];
}

export const NGODashboard: React.FC<NGODashboardProps> = ({ resources }) => {
  const [items, setItems] = useState<ResourceItem[]>(resources);
  const [newItem, setNewItem] = useState({ item_type: 'Food Packets', quantity: 500, unit: 'Packets' });

  const handleAddResource = () => {
    const newRes: ResourceItem = {
      id: Date.now(),
      owner: 'Seva Relief NGO',
      item_type: newItem.item_type,
      quantity: newItem.quantity,
      unit: newItem.unit
    };
    setItems((prev) => [newRes, ...prev]);
    alert("Resource cataloged into NGO Logistics pool!");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> Registered NGO Relief Network
          </div>
          <h2 className="text-2xl font-extrabold">Seva Relief Foundation</h2>
          <p className="text-sm text-purple-100 mt-1">
            Logistics & Community Supply Hub • Direct Coordination with District Authorities
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-right">
          <span className="block text-xs text-purple-200 uppercase font-semibold">Relief Supplies Logged</span>
          <span className="text-2xl font-black text-amber-300">
            {items.reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()} Units
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-500" /> Active Relief Inventory
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((r) => (
              <div key={r.id} className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{r.owner}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{r.item_type}</h4>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">{r.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {r.quantity.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-500" /> Add New Relief Inventory
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Item Category</label>
              <select
                value={newItem.item_type}
                onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              >
                <option value="Food Packets">Food Packets (Rations)</option>
                <option value="Clean Drinking Water">Clean Water (Liters)</option>
                <option value="Medical Emergency Kits">Medical Kits</option>
                <option value="Thermal Blankets">Blankets & Tents</option>
                <option value="Rescue Vehicles">Vehicles & Boats</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleAddResource}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow"
            >
              + Catalog Inventory Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
