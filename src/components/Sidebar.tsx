import React from 'react';
import { Practitioner } from '../types';
import { supabase } from '../db';

interface Props { view: string; setView: (v: any) => void; user: Practitioner; }

const Sidebar: React.FC<Props> = ({ view, setView, user }) => {
  const items = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Overview' },
    { id: 'clients', icon: 'fa-user-friends', label: 'Clinical Files' },
    { id: 'schedule', icon: 'fa-calendar-alt', label: 'Calendar' },
    { id: 'settings', icon: 'fa-cog', label: 'Workspace' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <i className="fas fa-brain text-sm"></i>
        </div>
        <div>
          <h1 className="font-black text-slate-900 tracking-tight text-sm">Theradesk OS</h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Clinical Zen</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {items.map(item => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${view === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
            {user.fullName[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate">{user.fullName}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-slate-300 hover:text-rose-500 transition-colors">
            <i className="fas fa-sign-out-alt text-xs"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;