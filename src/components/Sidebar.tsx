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
    <aside className="w-64 gradient-card border-r border-slate-200/50 hidden md:flex flex-col h-full shadow-beautiful backdrop-blur-sm">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 animate-float">
          <i className="fas fa-brain text-base"></i>
        </div>
        <div>
          <h1 className="font-black text-slate-900 tracking-tight text-sm">Theradesk OS</h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Clinical Zen</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-hover ${
              view === item.id
                ? 'gradient-primary text-white shadow-lg transform scale-105'
                : 'text-slate-500 hover:text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md hover:transform hover:scale-102'
            }`}
          >
            <i className={`fas ${item.icon} w-5 transition-transform duration-300 ${view === item.id ? 'scale-110' : 'group-hover:scale-105'}`}></i>
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
