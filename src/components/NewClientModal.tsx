import React, { useState } from 'react';
import { Client, ClientStatus, Practitioner } from '../types';

interface NewClientModalProps {
  onClose: () => void;
  onSubmit: (client: Client) => void;
  user: Practitioner;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ onClose, onSubmit, user }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    status: ClientStatus.PROSPECT,
    presentingConcern: '',
    emergencyContact: '',
    consentSigned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    if (!formData.name || !formData.email) {
      alert("Name and Email are required.");
      return;
    }

    setSubmitting(true);

    const newClient: Client = {
      id: crypto.randomUUID(), // Use a more reliable unique ID
      practitionerId: user.id,
      ...formData,
      createdAt: Date.now(),
    };

    onSubmit(newClient);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">New Client Intake</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="clientName" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                <input 
                  id="clientName"
                  name="name"
                  required 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="clientEmail" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Email</label>
                <input 
                  id="clientEmail"
                  name="email"
                  required 
                  type="email" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="presentingConcern" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Presenting Concern</label>
              <textarea 
                id="presentingConcern"
                name="presentingConcern"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none h-24" 
                value={formData.presentingConcern} 
                onChange={(e) => setFormData({...formData, presentingConcern: e.target.value})} 
              />
            </div>
          </div>
          <div className="p-8 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 font-bold text-gray-500">Cancel</button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-check"></i>}
              {submitting ? 'Processing...' : 'Complete Intake'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;