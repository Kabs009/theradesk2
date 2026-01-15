import React, { useState } from 'react';
import { Client, Appointment, ClinicalNote, NoteStatus } from '../types';
import { generateNoteDraft, processTranscription } from '../geminiService';

interface Props { 
  client: Client; 
  appointments: Appointment[]; 
  notes: ClinicalNote[]; 
  onBack: () => void; 
  onUpdateClient: (c: Client) => void;
  onUpdateNote: (n: ClinicalNote) => void;
  onUpdateAppt: (a: Appointment) => void;
}

const ClientDetail: React.FC<Props> = ({ client, appointments, notes, onBack, onUpdateClient, onUpdateNote, onUpdateAppt }) => {
  const [tab, setTab] = useState<'notes' | 'history'>('notes');
  const [isRecording, setIsRecording] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [draftContent, setDraftContent] = useState('');

  const handleTranscribe = async () => {
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      setAiLoading(true);
      const res = await processTranscription("dummy-base64", "audio/webm");
      setDraftContent(prev => prev + "\n" + res);
      setAiLoading(false);
    }, 2000);
  };

  const handleRefine = async () => {
    setAiLoading(true);
    const refined = await generateNoteDraft(draftContent, 'SOAP');
    setDraftContent(refined);
    setAiLoading(false);
  };

  const saveNote = () => {
    const note: ClinicalNote = {
      id: `n-${Date.now()}`,
      practitionerId: client.practitionerId,
      clientId: client.id,
      category: 'Progress Note',
      title: 'Progress Note',
      content: draftContent,
      status: NoteStatus.FINALIZED,
      createdAt: Date.now()
    };
    onUpdateNote(note);
    setDraftContent('');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all">
          <i className="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900">{client.name}</h2>
          <p className="text-slate-500 font-medium">{client.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <h3 className="font-black text-slate-900">Clinical Session Record</h3>
              <div className="flex gap-2">
                <button onClick={handleTranscribe} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                  <i className="fas fa-microphone mr-2"></i> {isRecording ? 'Listening...' : 'Dictate'}
                </button>
                <button onClick={handleRefine} disabled={aiLoading || !draftContent} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 disabled:opacity-50">
                  <i className="fas fa-magic mr-2"></i> {aiLoading ? 'Thinking...' : 'AI Refine'}
                </button>
              </div>
            </div>

            <textarea 
              className="w-full h-80 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm leading-relaxed"
              placeholder="Start typing clinician observations or use dictation..."
              value={draftContent}
              onChange={e => setDraftContent(e.target.value)}
            ></textarea>

            <div className="flex justify-end">
              <button onClick={saveNote} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                Finalize Clinical Record
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="font-black text-slate-900">Clinical History</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {notes.map(n => (
                <div key={n.id} className="p-8 hover:bg-slate-50 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    <span className="text-[9px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{n.category}</span>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Client Profile</h4>
            <div className="space-y-4">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                 <p className="font-bold text-slate-900">{client.status}</p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Legal Consent</p>
                 <button onClick={() => onUpdateClient({...client, consentSigned: !client.consentSigned})} className={`text-xs font-bold ${client.consentSigned ? 'text-emerald-500' : 'text-amber-500'} hover:underline`}>
                   {client.consentSigned ? 'Signed & Validated' : 'Action Required'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;