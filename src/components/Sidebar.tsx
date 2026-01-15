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
    <aside className="w-64 gradient-card border-r border-slate-200/50 hidden md:flex flex-col h-full shadow-beautiful backdrop-blur-sm relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
      
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3 relative z-10 animate-slide-in-left">
        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white shadow-beautiful shadow-indigo-200/50 animate-float relative">
          <div className="absolute inset-0 gradient-primary rounded-xl blur-lg opacity-50"></div>
          <i className="fas fa-brain text-lg relative z-10"></i>
        </div>
        <div>
          <h1 className="font-black text-slate-900 tracking-tight text-base">Theradesk OS</h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Clinical Zen</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4 relative z-10">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden ${
              view === item.id
                ? 'text-white shadow-glow-indigo'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Active background gradient */}
            {view === item.id && (
              <div className="absolute inset-0 gradient-primary animate-scale-in"></div>
            )}
            
            {/* Hover background */}
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${view === item.id ? 'hidden' : ''}`}></div>
            
            {/* Icon */}
            <div className="relative z-10 w-6 flex items-center justify-center">
              <i className={`fas ${item.icon} transition-all duration-300 ${
                view === item.id 
                  ? 'scale-110 text-white' 
                  : 'group-hover:scale-110'
              }`}></i>
            </div>
            
            {/* Label */}
            <span className="relative z-10">{item.label}</span>
            
            {/* Active indicator */}
            {view === item.id && (
              <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse-subtle"></div>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-6 border-t border-slate-100 relative z-10 animate-slide-in-up">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-200/50 group-hover:scale-110 transition-transform duration-300">
              {user.fullName[0]}
            </div>
            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse-subtle"></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate">{user.fullName}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="text-slate-400 hover:text-rose-500 hover:scale-110 transition-all duration-300 p-2"
            title="Sign out"
          >
            <i className="fas fa-sign-out-alt text-sm"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
