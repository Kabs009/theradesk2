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

  const getStatusColor = (status: ClientStatus) => {
    switch(status) {
      case ClientStatus.ACTIVE:
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
      case ClientStatus.INACTIVE:
        return { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
      case ClientStatus.DISCHARGED:
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
    }
  };

  return (
    <div className="space-y-8 animate-clinical-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl blur-2xl"></div>
          <div className="relative">
            <h2 className="text-4xl font-black text-slate-900 mb-1">
              <span className="text-gradient">Clinical Files</span>
            </h2>
            <p className="text-slate-500 text-lg">Managing {clients.length} active client {clients.length === 1 ? 'file' : 'files'}</p>
          </div>
        </div>
        <button 
          onClick={handleAdd} 
          className="btn-primary flex items-center gap-2 whitespace-nowrap group"
        >
          <i className="fas fa-plus group-hover:rotate-90 transition-transform duration-300"></i> 
          New Intake
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative animate-slide-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
        <div className="relative">
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
          <input 
            type="text" 
            placeholder="Search by name, email, or concern..." 
            className="input-beautiful w-full pl-14 pr-6 py-5 text-slate-900 font-medium shadow-beautiful"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {search && (
        <div className="flex items-center gap-2 text-sm text-slate-500 animate-scale-in">
          <i className="fas fa-filter text-indigo-500"></i>
          <span>Found {filtered.length} matching {filtered.length === 1 ? 'file' : 'files'}</span>
        </div>
      )}

      {/* Client Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, index) => {
            const statusColors = getStatusColor(c.status);
            return (
              <div 
                key={c.id} 
                onClick={() => onSelectClient(c.id)} 
                className="card-beautiful p-6 cursor-pointer group relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-black text-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                          {c.name[0].toUpperCase()}
                        </span>
                      </div>
                      {/* Online indicator for active clients */}
                      {c.status === ClientStatus.ACTIVE && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse-subtle"></div>
                      )}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${statusColors.text} ${statusColors.bg} px-3 py-1.5 rounded-full border ${statusColors.border}`}>
                      {c.status}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="mb-4">
                    <h4 className="font-black text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                      <i className="fas fa-envelope text-xs text-slate-400"></i>
                      {c.email || 'No email provided'}
                    </p>
                    {c.phone && (
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <i className="fas fa-phone text-xs text-slate-400"></i>
                        {c.phone}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.consentSigned ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse-subtle`}></div>
                      <span className="text-xs font-bold text-slate-600">
                        Consent {c.consentSigned ? 'Signed' : 'Pending'}
                      </span>
                    </div>
                    <i className="fas fa-arrow-right text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300"></i>
                  </div>

                  {/* Presenting concern hint */}
                  {c.presentingConcern && (
                    <div className="mt-3 pt-3 border-t border-slate-50">
                      <p className="text-xs text-slate-400 line-clamp-2">
                        <i className="fas fa-clipboard-list mr-1"></i>
                        {c.presentingConcern}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-beautiful p-16 text-center animate-scale-in">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-folder-open text-4xl text-indigo-300"></i>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            {search ? 'No Matching Files' : 'No Client Files Yet'}
          </h3>
          <p className="text-slate-500 mb-6">
            {search 
              ? 'Try adjusting your search criteria'
              : 'Start building your practice by adding your first client'}
          </p>
          {!search && (
            <button 
              onClick={handleAdd}
              className="btn-primary inline-flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Add First Client
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientList;
