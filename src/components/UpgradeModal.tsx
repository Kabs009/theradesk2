import React, { useState } from 'react';
import { Practitioner } from '../types';

declare const PaystackPop: any;

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
  user: Practitioner;
}

const PAYSTACK_PUBLIC_KEY = process.env.VITE_PAYSTACK_PUBLIC_KEY || '';

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade, user }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'pricing' | 'payment'>('pricing');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

    const handlePaystackPayment = () => {
      if (!PAYSTACK_PUBLIC_KEY) {
        alert("Billing is not configured. Please add VITE_PAYSTACK_PUBLIC_KEY to environment variables.");
        return;
      }

      setLoading(true);

      const amount = selectedPlan === 'monthly' ? 10000 : 100000;

      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount,
        currency: 'KES',
        ref: `td_pro_kes_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        callback: () => {
          setLoading(false);
          onUpgrade();
        },
        onClose: () => {
          setLoading(false);
        },
      });

      handler.openIframe();
    };

    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="relative p-8 md:p-12">
            <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors">
              <i className="fas fa-times text-xl" />
            </button>

            {step === 'pricing' ? (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <i className="fas fa-bolt" /> Elevate Your Practice
                  </div>
                  <h3 className="text-3xl font-black text-gray-900">Theradesk Pro</h3>
                  <p className="text-gray-500 mt-2 font-medium">Unshackle your clinical workspace from administrative limits.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className={`p-8 rounded-3xl border-2 transition-all cursor-pointer ${
                      selectedPlan === 'monthly' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-100 bg-white hover:border-indigo-200'
                    }`}
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                      Test Mode
                    </div>
                    <h4 className="font-bold text-gray-900">Monthly Pro</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">100</span>
                      <span className="text-gray-500 font-bold text-sm">KES /mo</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {['Unlimited Clients', 'AI Note Assistant', 'Priority Transcription', 'Premium Support'].map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <i className={`fas fa-check-circle text-xs ${selectedPlan === 'monthly' ? 'text-indigo-500' : 'text-gray-300'}`} /> {feat}
                        </li>
                      ))}
                    </ul>
                    <button onClick={(e) => { e.stopPropagation(); setStep('payment'); }} className="w-full mt-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                      Select Plan
                    </button>
                  </div>

                  <div
                    className={`p-8 rounded-3xl border-2 transition-all cursor-pointer ${
                      selectedPlan === 'annual' ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-100 bg-white hover:border-indigo-200'
                    }`}
                    onClick={() => setSelectedPlan('annual')}
                  >
                    <h4 className="font-bold text-gray-900">Annual Pro</h4>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">1,000</span>
                      <span className="text-gray-500 font-bold text-sm">KES /year</span>
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-emerald-600 uppercase">Save KES 200 (2 Months Free)</p>
                    <ul className="mt-6 space-y-3">
                      {['Everything in Monthly', 'Beta Feature Access', 'Custom Practice Branding'].map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <i className={`fas fa-check-circle text-xs ${selectedPlan === 'annual' ? 'text-indigo-500' : 'text-gray-300'}`} /> {feat}
                        </li>
                      ))}
                    </ul>
                    <button onClick={(e) => { e.stopPropagation(); setStep('payment'); }} className="w-full mt-8 py-3.5 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all">
                      Choose Annual
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-8 py-4">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900">Secure Checkout</h3>
                  <p className="text-gray-500 text-sm mt-1">Payment secured by <span className="text-emerald-500 font-bold">Paystack</span></p>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Selected Plan</p>
                    <p className="text-sm font-bold text-gray-900 capitalize">{selectedPlan} Pro</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Total amount</p>
                    <p className="text-2xl font-black text-gray-900">{selectedPlan === 'monthly' ? 'KES 100' : 'KES 1,000'}</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                  <i className="fas fa-info-circle text-indigo-500 mt-1" />
                  <p className="text-xs text-indigo-700 font-medium leading-relaxed">Clicking the button below will open the secure Paystack payment window. Your clinical data remains protected throughout the process.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={handlePaystackPayment} disabled={loading} className="w-full py-4.5 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                    {loading ? <i className="fas fa-circle-notch fa-spin" /> : <><i className="fas fa-lock text-xs" /> Pay KES {selectedPlan === 'monthly' ? '100' : '1,000'}</>}
                  </button>
                  <button onClick={() => setStep('pricing')} className="w-full py-3 text-gray-400 font-bold text-xs hover:text-gray-600 transition-colors">Change Plan</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default UpgradeModal;