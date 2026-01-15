import React, { useState } from 'react';
import { Practitioner, UserPlan } from '../types';
import { dbUpsertPractitioner } from '../store';
import { supabase } from '../db';

interface LoginProps {
  onLogin: (user: Practitioner) => void;
}

type LoginMode = 'signin' | 'signup' | 'forgot';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<LoginMode>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    practiceName: '',
    plan: UserPlan.FREE
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-1',
      email: 'demo@theradesk.os',
      fullName: 'Dr. Sarah Jenkins',
      practiceName: 'Jenkins Psychology Group',
      plan: UserPlan.PAID
    };
    sessionStorage.setItem('theradesk_demo_session', JSON.stringify(demoUser));
    onLogin(demoUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    // Safeguard: Stop spinning after 10 seconds if no response
    const spinTimeout = setTimeout(() => setLoading(false), 10000);

    const email = formData.email.toLowerCase().trim();
    const password = formData.password;

    try {
      if (mode === 'signup') {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;

        if (authData.user) {
          const practitioner: Practitioner = {
            id: authData.user.id,
            email: email,
            fullName: formData.fullName.trim() || 'Practitioner',
            practiceName: formData.practiceName.trim() || 'My Practice',
            plan: formData.plan
          };

          // If session exists, try to write to DB immediately
          if (authData.session) {
            try {
              await dbUpsertPractitioner(practitioner);
              onLogin(practitioner);
            } catch (dbErr: any) {
              // If write fails, we still consider auth successful but warn about DB
              console.error("DB Provisioning failed:", dbErr);
              onLogin(practitioner);
            }
          } else {
            // Likely email confirmation is enabled on this project
            setInfo("Account created! Please check your email for a confirmation link to activate your clinical workspace.");
            setLoading(false);
          }
        }
      } else if (mode === 'signin') {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        
        // Handle successful signin - App.tsx listener will catch it, but if it's already there or slow:
        if (authData.user && authData.session) {
           // We could call onLogin here if we had the profile, 
           // but App.tsx will trigger syncProfile via onAuthStateChange.
           // Setting a small delay to allow App to catch the event
           setTimeout(() => setLoading(false), 2000);
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (error) throw error;
        setInfo("Reset link sent. Check your inbox.");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      clearTimeout(spinTimeout);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 text-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl animate-pulse-subtle"></div>
      </div>

      <div className="max-w-md w-full animate-scale-in relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 gradient-primary rounded-[2rem] text-white shadow-beautiful shadow-indigo-200 mb-6 animate-float">
            <i className="fas fa-brain text-5xl"></i>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            <span className="text-gradient">Theradesk OS</span>
          </h1>
          <p className="text-gray-600 text-lg font-semibold">Secure clinical practice management</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">HIPAA Compliant</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
          {mode !== 'forgot' && (
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
              <button 
                type="button"
                onClick={() => { setMode('signin'); setError(null); setInfo(null); }}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setMode('signup'); setError(null); setInfo(null); }}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Join
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Practitioner Name</label>
                  <input 
                    required
                    id="fullName"
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300"
                    placeholder="e.g. Dr. Jane Smith"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="practiceName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Practice Entity</label>
                  <input 
                    required
                    id="practiceName"
                    type="text" 
                    name="practiceName"
                    value={formData.practiceName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300"
                    placeholder="e.g. Modern Therapy LLC"
                    autoComplete="organization"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input 
                required
                id="email"
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300"
                placeholder="clinician@practice.com"
                autoComplete="email"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                  {mode === 'signin' && (
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input 
                  required
                  id="password"
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300"
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-bold flex items-start gap-3 border border-rose-100 animate-shake">
                <i className="fas fa-circle-exclamation mt-0.5"></i>
                <span>{error}</span>
              </div>
            )}

            {info && (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-[11px] font-bold flex items-start gap-3 border border-emerald-100 animate-in fade-in">
                <i className="fas fa-info-circle mt-0.5"></i>
                <span>{info}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4.5 rounded-[1.5rem] font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-2xl transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                mode === 'signup' ? 'Create Clinical Account' : mode === 'forgot' ? 'Send Recovery Link' : 'Access Practice'
              )}
            </button>
          </form>

          {mode === 'signin' && (
            <div className="mt-4">
              <button 
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-emerald-50 text-emerald-700 py-3.5 rounded-2xl font-bold text-xs border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-vial"></i> Quick Launch Demo
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <i className="fas fa-lock mr-2 text-indigo-400"></i> HIPAA-Ready Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
