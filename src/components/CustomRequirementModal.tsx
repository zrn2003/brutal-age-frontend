import React, { useState } from 'react';
import { X, Send, FileText, CheckCircle } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import type { BuyerUser } from '../types';

interface CustomRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerUser: BuyerUser | null;
}

export const CustomRequirementModal: React.FC<CustomRequirementModalProps> = ({
  isOpen,
  onClose,
  buyerUser,
}) => {
  const [buyerName, setBuyerName] = useState(buyerUser?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(buyerUser?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(buyerUser?.phone || '');
  const [desiredLeadership, setDesiredLeadership] = useState('300K - 500K');
  const [relocationTickets, setRelocationTickets] = useState('15+ Relocation Tickets');
  const [budgetUSD, setBudgetUSD] = useState<number | ''>(1500);
  const [preferredContactChannel, setPreferredContactChannel] = useState<'WhatsApp' | 'Line' | 'Telegram' | 'WeChat'>('WhatsApp');
  const [contactDetail, setContactDetail] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!buyerName || !buyerEmail || !desiredLeadership || !budgetUSD) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName,
          buyerEmail,
          buyerPhone,
          desiredLeadership,
          relocationTickets,
          budgetUSD: Number(budgetUSD),
          preferredContactChannel,
          contactDetail: contactDetail || buyerPhone,
          additionalNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit requirement request.');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your custom request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150 font-heading">
      <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-none shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto font-heading">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-xs font-bold p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-black text-slate-900 font-heading uppercase">
              Custom Account Requirement Request
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-heading">
            Need a specific Leadership level, Relocation Tickets, or custom account not in the list? Submit your requirements and store admin will contact you!
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900 font-heading">Requirement Request Received!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
              Our admin team will review your custom Brutal Age account specifications and contact you directly via <strong>{preferredContactChannel}</strong>!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@domain.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Desired Leadership Level *
                </label>
                <select
                  value={desiredLeadership}
                  onChange={(e) => setDesiredLeadership(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-bold"
                >
                  <option value="0K - 100K">0K - 100K</option>
                  <option value="100K - 300K">100K - 300K</option>
                  <option value="300K - 500K">300K - 500K</option>
                  <option value="500K - 700K">500K - 700K</option>
                  <option value="700K - 900K+">700K - 900K+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Budget ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={budgetUSD}
                  onChange={(e) => setBudgetUSD(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-bold font-mono-num"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Required Relocation Tickets / Troops Features
              </label>
              <input
                type="text"
                placeholder="e.g. 20+ Relocation Tickets, High Defensive Research"
                value={relocationTickets}
                onChange={(e) => setRelocationTickets(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Preferred Contact Channel
                </label>
                <select
                  value={preferredContactChannel}
                  onChange={(e) => setPreferredContactChannel(e.target.value as any)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-bold"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Line">Line</option>
                  <option value="Telegram">Telegram</option>
                  <option value="WeChat">WeChat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  WhatsApp / Phone / Social ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 234 567 8900 or Social ID"
                  value={buyerPhone}
                  onChange={(e) => {
                    setBuyerPhone(e.target.value);
                    setContactDetail(e.target.value);
                  }}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Additional Account Specifications / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Describe any specific dragon skills, legendary partner sets, or hero research requirements..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs p-3 border border-slate-300 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-indigo w-full py-3.5 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Request...' : 'Submit Custom Account Request'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
