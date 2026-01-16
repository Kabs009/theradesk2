import React, { useState, useEffect } from 'react';
import { Practitioner, Client, Appointment, ClinicalNote, UserPlan, ClientStatus } from './types';
import { supabase, SCHEMA_SQL } from './db';
import { loadPracticeData, syncClient, syncAppointment, syncNote } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import Schedule from './components/Schedule';
import ClientDetail from './components/ClientDetail';
import SettingsView from './components/SettingsView';
import Login from './components/Login';
import UpgradeModal from './components/UpgradeModal';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<Practitioner | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [view, setView] = useState<'dashboard' | 'clients' | 'schedule' | 'settings'>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [schemaError, setSchemaError] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handleAuth(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) handleAuth(session.user);
      else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (authUser: any) => {
    try {
      const { data } = await supabase.from('practitioners').select('*').eq('id', authUser.id).single();
      let profile = data;
      if (!data) {
        profile = { id: authUser.id, email: authUser.email, full_name: 'Clinician', practice_name: 'Private Practice', plan: UserPlan.FREE };
        await supabase.from('practitioners').upsert(profile);
      }
      setUser({ id: profile.id, email: profile.email, fullName: profile.full_name, practiceName: profile.practice_name, plan: profile.plan });
      fetchData(profile.id);
    } catch (err) {
      console.error("Auth sync error:", err);
      setLoading(false);
    }
  };

  const fetchData = async (id: string) => {
    try {
      const data = await loadPracticeData(id);
      setClients(data.clients);
      setAppointments(data.appointments);
      setNotes(data.notes);
      setSchemaError(false);
    } catch (e: any) {
      if (e.message === "SCHEMA_MISSING") setSchemaError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (c: Client) => {
    setClients(prev => {
      const exists = prev.find(x => x.id === c.id);
      return exists ? prev.map(x => x.id === c.id ? c : x) : [...prev, c];
    });
    await syncClient(c);
  };

  const updateAppt = async (a: Appointment) => {
    setAppointments(prev => {
      const exists = prev.find(x => x.id === a.id);
      return exists ? prev.map(x => x.id === a.id ? a : x) : [...prev, a];
    });
    await syncAppointment(a);
  };

  const updateNote = async (n: ClinicalNote) => {
    setNotes(prev => {
      const exists = prev.find(x => x.id === n.id);
      return exists ? prev.map(x => x.id === n.id ? n : x) : [...prev, n];
    });
    await syncNote(n);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center animate-float">
        <div className="w-16 h-16 gradient-primary rounded-3xl mx-auto mb-6 animate-pulse-subtle flex items-center justify-center shadow-beautiful">
          <i className="fas fa-brain text-white text-xl"></i>
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-600">Loading Theradesk OS...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  if (schemaError) return (
    <div className="h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-rose-100">
        <h2 className="text-2xl font-black mb-4">Database Setup Required</h2>
        <p className="text-slate-500 mb-6">Please run this SQL in your Supabase Editor to continue.</p>
        <pre className="bg-slate-900 text-indigo-300 p-6 rounded-2xl text-xs overflow-auto max-h-60 mb-6 font-mono">{SCHEMA_SQL}</pre>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">I've Run the Script</button>
      </div>
    </div>
  );

  const renderView = () => {
    if (selectedClientId && view === 'clients') {
      const c = clients.find(x => x.id === selectedClientId);
      if (!c) { setSelectedClientId(null); return null; }
      return (
        <ClientDetail
          client={c}
          appointments={appointments.filter(a => a.clientId === c.id)}
          notes={notes.filter(n => n.clientId === c.id)}
          onBack={() => setSelectedClientId(null)}
          onUpdateClient={updateClient}
          onUpdateNote={updateNote}
          onUpdateAppt={updateAppt}
        />
      );
    }
    switch (view) {
      case 'dashboard':
        return <Dashboard user={user} clients={clients} appointments={appointments} notes={notes} onNavigateToClient={(id) => { setSelectedClientId(id); setView('clients'); }} />;
      case 'clients':
        return <ClientList clients={clients} onSelectClient={(id) => { setSelectedClientId(id); setView('clients'); }} onAddClient={updateClient} practitionerId={user.id} />;
      case 'schedule':
        return (
          <Schedule
            appointments={appointments}
            clients={clients}
            user={user}
            onUpdateData={(newData) => {
              if (newData.appointments) {
                // Determine the new appointment(s)
                const latest = newData.appointments[newData.appointments.length - 1];
                if (latest) updateAppt(latest);
              }
            }}
          />
        );
      case 'settings':
        return <SettingsView user={user} onUpdateUser={setUser} onTriggerUpgrade={() => setShowUpgrade(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-900" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)' }}>
      <Sidebar view={view} setView={setView} user={user} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto animate-clinical-in">
          {renderView()}
        </div>
      </main>
      {showUpgrade && <UpgradeModal user={user} onClose={() => setShowUpgrade(false)} onUpgrade={() => { setUser({ ...user, plan: UserPlan.PAID }); setShowUpgrade(false); }} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
      <ToastContainer />
    </ToastProvider>
  );
};

export default App;
