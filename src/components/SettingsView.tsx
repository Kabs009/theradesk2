import React, { useState } from 'react';
import { Practitioner, UserPlan } from '../types';

interface SettingsViewProps {
  user: Practitioner;
  onUpdateUser: (updatedUser: Practitioner) => void;
  onTriggerUpgrade: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser, onTriggerUpgrade }) => {
  const [formData, setFormData] = useState({ ...user });
  const [isManagingBilling, setIsManagingBilling] = useState(false);

  const handleSave = () => {
    onUpdateUser(formData);
    alert("Profile settings saved successfully.");
  };

  const handleCancelSubscription = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your Theradesk Pro subscription?\n\n" +
      "You will lose access to unlimited clients and AI-assisted clinical documentation immediately."
    );

    if (confirmed) {
      const downgradedUser = { ...user, plan: UserPlan.FREE };
      onUpdateUser(downgradedUser);
      setIsManagingBilling(false);
      alert("Your subscription has been cancelled. Your account has been moved to the Free Practice plan.");
    }
  };

  const handleSecurityAction = (action: string) => {
    alert(`${action}: This action has been initiated. Please check your clinical email (${user.email}) for further instructions.`);
  };

  if (isManagingBilling) {
    return (
      <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsManagingBilling(false)}
            className="p-2 hover:bg-white rounded-full transition-all text-gray-500 hover:text-indigo-600"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-900">Manage Subscription</h2>
            <p className="text-gray-500 mt-1">Review your billing cycle and plan details.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200">
                <i className="fas fa-crown"></i>
              </div>
              <div>
                <p className="text-sm font-black text-indigo-900">Theradesk Pro</p>
                <p className="text-xs text-indigo-600 font-bold">KES 100 / Month • Active</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Billing Date</p>
              <p className="text-sm font-bold text-indigo-900">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</h4>
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">CARD</div>
                <p className="text-sm font-bold text-gray-700">Managed via Paystack Secure Vault</p>
              </div>
              <button 
                onClick={() => alert("Redirecting to secure Paystack portal...")}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Update
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50">
            <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-rose-900">Cancel Subscription</p>
                <p className="text-xs text-rose-600 font-medium mt-1">Stop your recurring payment and return to the Free plan.</p>
              </div>
              <button 
                onClick={handleCancelSubscription}
                className="px-6 py-3 bg-white text-rose-600 border border-rose-200 rounded-2xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-gray-900">Practice Settings</h2>
        <p className="text-gray-500 mt-1">Configure your clinical environment and subscription.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 border-b border-gray-50 pb-4">Practitioner Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="settingsFullName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  id="settingsFullName"
                  name="fullName"
                  type="text" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="settingsPracticeName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Practice Name</label>
                <input 
                  id="settingsPracticeName"
                  name="practiceName"
                  type="text" 
                  value={formData.practiceName} 
                  onChange={(e) => setFormData({...formData, practiceName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  autoComplete="organization"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settingsEmail" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinical Email</label>
              <input 
                id="settingsEmail"
                name="email"
                type="email" 
                readOnly 
                value={user.email} 
                className="w-full px-5 py-3.5 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed outline-none" 
                autoComplete="email"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 border-b border-gray-50 pb-4">Security & Session</h3>
            <div className="mt-6 space-y-4">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSecurityAction("MFA Setup")}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">Multi-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Secure your clinical data with MFA.</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                   <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
              <button 
                onClick={() => handleSecurityAction("Password Reset")}
                className="text-xs font-bold text-indigo-600 hover:underline px-1"
              >
                Change Account Password
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm bg-gradient-to-br from-white to-gray-50">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Plan & Billing</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${user.plan === UserPlan.PAID ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-gray-100 text-gray-400 shadow-gray-100'}`}>
                  <i className={`fas ${user.plan === UserPlan.PAID ? 'fa-crown' : 'fa-seedling'}`}></i>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Plan</p>
                  <p className="text-lg font-black text-gray-900">{user.plan === UserPlan.PAID ? 'Theradesk Pro' : 'Free Practice'}</p>
                </div>
              </div>

              {user.plan === UserPlan.FREE ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">You are currently using the limited version of Theradesk OS. Get unlimited clients and AI tools for only <b>KES 100/mo</b> with <b>Theradesk Pro</b>.</p>
                  <button 
                    onClick={onTriggerUpgrade}
                    className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    Upgrade Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100">
                     <i className="fas fa-check-circle mr-2"></i> Subscription active via Paystack
                   </div>
                   <button 
                    onClick={() => setIsManagingBilling(true)}
                    className="w-full py-3.5 border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                   >
                    Manage Billing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;