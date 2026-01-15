import React from 'react';
import { Practitioner, Client, Appointment, ClinicalNote } from '../types';

interface Props { user: Practitioner; clients: Client[]; appointments: Appointment[]; notes: ClinicalNote[]; onNavigateToClient: (id: string) => void; }

const Dashboard: React.FC<Props> = ({ user, clients, appointments, notes, onNavigateToClient }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === today);
  const pendingNotes = todayAppts.length - notes.filter(n => n.createdAt > Date.now() - 86400000).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Health of Practice</h2>
        <p className="text-slate-500 mt-1">Practice metrics for {user.practiceName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Files', value: clients.length, icon: 'fa-folder-open', color: 'indigo' },
          { label: 'Sessions Today', value: todayAppts.length, icon: 'fa-calendar-check', color: 'emerald' },
          { label: 'Documentation Due', value: Math.max(0, pendingNotes), icon: 'fa-file-signature', color: 'amber' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-${stat.color}-600 bg-${stat.color}-50`}>
              <i className={`fas ${stat.icon} text-lg`}></i>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h3 className="font-black text-slate-900">Today's List</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {todayAppts.length > 0 ? todayAppts.map(a => {
              const c = clients.find(x => x.id === a.clientId);
              return (
                <div key={a.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigateToClient(a.clientId)}>
                  <div className="flex items-center gap-4">
                    <div className="text-center w-12">
                      <p className="text-sm font-black text-indigo-600">{a.startTime}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{a.duration}m</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{c?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{a.type}</p>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-slate-300 text-xs"></i>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-300 italic">No sessions scheduled today.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;