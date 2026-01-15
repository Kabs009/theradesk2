
import React, { useState } from 'react';
import { Client, ClientStatus } from '../types';

interface Props { clients: Client[]; onSelectClient: (id: string) => void; onAddClient: (c: Client) => void; practitionerId: string; }

const ClientList: React.FC<Props> = ({ clients, onSelectClient, onAddClient, practitionerId }) => {
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    const name = prompt("Client Name:");
    if (!name) return;
    const email = prompt("Client Email:");
    
    const newClient: Client = {
      id: `c-${Date.now()}`,
      practitionerId,
      name,
      email: email || '',
      phone: '',
      dob: '',
      status: ClientStatus.ACTIVE,
      presentingConcern: '',
      emergencyContact: '',
      consentSigned: false,
      createdAt: Date.now()
    };
    onAddClient(newClient);
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Clinical Files</h2>
          <p className="text-slate-500">Managing {clients.length} active files</p>
        </div>
        <button onClick={handleAdd} className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
          <i className="fas fa-plus"></i> New Intake
        </button>
      </div>

      <div className="relative">
        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
        <input 
          type="text" 
          placeholder="Search clinical directory..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => (
          <div key={c.id} onClick={() => onSelectClient(c.id)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {c.name[0]}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{c.status}</span>
            </div>
            <h4 className="font-black text-slate-900 text-lg mb-1">{c.name}</h4>
            <p className="text-xs text-slate-400 font-medium mb-4">{c.email}</p>
            <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
              <i className={`fas ${c.consentSigned ? 'fa-check-circle text-emerald-500' : 'fa-clock text-amber-500'} text-xs`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consent: {c.consentSigned ? 'Active' : 'Pending'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;