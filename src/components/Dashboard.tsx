import React from 'react';
import { Practitioner, Client, Appointment, ClinicalNote } from '../types';

interface Props { user: Practitioner; clients: Client[]; appointments: Appointment[]; notes: ClinicalNote[]; onNavigateToClient: (id: string) => void; }

const Dashboard: React.FC<Props> = ({ user, clients, appointments, notes, onNavigateToClient }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === today);
  const pendingNotes = todayAppts.length - notes.filter(n => n.createdAt > Date.now() - 86400000).length;

  const stats = [
    { 
      label: 'Active Files', 
      value: clients.length, 
      icon: 'fa-folder-open', 
      gradient: 'gradient-info',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      shadowColor: 'shadow-glow-indigo'
    },
    { 
      label: 'Sessions Today', 
      value: todayAppts.length, 
      icon: 'fa-calendar-check', 
      gradient: 'gradient-success',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      shadowColor: 'shadow-glow-emerald'
    },
    { 
      label: 'Documentation Due', 
      value: Math.max(0, pendingNotes), 
      icon: 'fa-file-signature', 
      gradient: 'gradient-warning',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      shadowColor: 'shadow-glow-amber'
    }
  ];

  return (
    <div className="space-y-8 animate-clinical-in">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>
        <div className="relative">
          <h2 className="text-4xl font-black text-slate-900 mb-2">
            Welcome back, <span className="text-gradient">{user.fullName.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 text-lg">Here's what's happening with {user.practiceName} today</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="card-beautiful group overflow-hidden relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            <div className="relative p-6 flex items-center gap-5">
              <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center ${stat.textColor} shadow-lg group-hover:scale-110 transition-all duration-300 relative`}>
                <div className={`absolute inset-0 ${stat.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}></div>
                <i className={`fas ${stat.icon} text-2xl relative z-10 group-hover:text-white transition-colors duration-300`}></i>
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
            
            {/* Bottom accent line */}
            <div className={`h-1 ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 card-beautiful overflow-hidden animate-slide-in-left">
          <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <i className="fas fa-calendar-day text-white text-sm"></i>
                  </div>
                  Today's Schedule
                </h3>
                <p className="text-sm text-slate-500 mt-1 ml-13">{todayAppts.length} sessions scheduled</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
            {todayAppts.length > 0 ? todayAppts.map((a, index) => {
              const c = clients.find(x => x.id === a.clientId);
              return (
                <div 
                  key={a.id} 
                  className="p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigateToClient(a.clientId)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-5 flex-1">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow-indigo group-hover:scale-110 transition-transform duration-300">
                        <p className="text-sm font-black text-white">{a.startTime}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{a.duration}m</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{c?.name || 'Unknown'}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <i className="fas fa-clipboard-list text-xs"></i>
                        {a.type}
                      </p>
                    </div>
                  </div>
                  <i className="fas fa-arrow-right text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300"></i>
                </div>
              );
            }) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calendar-day text-3xl text-slate-300"></i>
                </div>
                <p className="text-slate-400 font-bold">No sessions scheduled today</p>
                <p className="text-xs text-slate-300 mt-2">Enjoy your free time!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6 animate-slide-in-right">
          {/* Recent Activity */}
          <div className="card-beautiful p-6">
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-chart-line text-indigo-600"></i>
              Quick Insights
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-users text-blue-600 text-xs"></i>
                  </div>
                  <span className="text-sm font-bold text-slate-700">Total Clients</span>
                </div>
                <span className="text-lg font-black text-slate-900">{clients.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <i className="fas fa-calendar-week text-emerald-600 text-xs"></i>
                  </div>
                  <span className="text-sm font-bold text-slate-700">This Week</span>
                </div>
                <span className="text-lg font-black text-slate-900">{appointments.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <i className="fas fa-notes-medical text-purple-600 text-xs"></i>
                  </div>
                  <span className="text-sm font-bold text-slate-700">Total Notes</span>
                </div>
                <span className="text-lg font-black text-slate-900">{notes.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-beautiful p-6">
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-bolt text-amber-500"></i>
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-glow-indigo hover:shadow-beautiful hover:scale-105 transition-all duration-300">
                <i className="fas fa-plus mr-2"></i>
                New Session
              </button>
              <button className="w-full px-4 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300">
                <i className="fas fa-file-medical mr-2"></i>
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
