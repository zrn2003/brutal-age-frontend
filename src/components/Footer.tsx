import React from 'react';
import { MessageSquare, Send, Share2, Phone, MessageCircle, FileText } from 'lucide-react';

interface FooterProps {
  onOpenCustomRequirementModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCustomRequirementModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 sm:mt-16 font-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 sm:mb-10">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm font-heading">
                AB
              </div>
              <span className="text-xl font-black font-heading text-slate-900">
                BRUTAL AGE — AB'S MARKETPLACE
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed font-medium">
              Verified Brutal Age gaming accounts & services marketplace. Account & Partner Service, Relocation Tickets, Leadership accounts, clean links, and original mail access.
            </p>

            <div className="pt-2 text-[11px] text-slate-500 font-semibold leading-relaxed">
              ✓ Guaranteed Response Within 24 Hours • Priority Support As Soon As Possible
            </div>
          </div>

          {/* Brutal Age Categories & Services */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-900 mb-3 font-heading">
              Brutal Age Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><a href="#listings" className="hover:text-indigo-600 transition-colors">Strong Hold 35 Accounts</a></li>
              <li><a href="#listings" className="hover:text-indigo-600 transition-colors">Relocation Tickets</a></li>
              <li><a href="#listings" className="hover:text-indigo-600 transition-colors">Resource & Clan Coin Service</a></li>
              <li><a href="#listings" className="hover:text-indigo-600 transition-colors">Account & Partner Service</a></li>
            </ul>

            {onOpenCustomRequirementModal && (
              <button
                type="button"
                onClick={onOpenCustomRequirementModal}
                className="mt-4 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-[11px] font-extrabold uppercase flex items-center gap-1.5 transition-all shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Request Custom Account</span>
              </button>
            )}
          </div>

          {/* Contact Details (Service Names Only, Masked Text) */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-900 mb-3 font-heading">
              Contact & Social
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              
              {/* WhatsApp */}
              <li>
                <a
                  href="https://wa.me/917517491313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </li>

              {/* Line */}
              <li>
                <a
                  href="https://line.me/R/ti/g/aM3NznSNe2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Line</span>
                </a>
              </li>

              {/* Telegram */}
              <li>
                <a
                  href="https://t.me/Raindrop132613"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-bold hover:underline"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>
              </li>

              {/* Facebook */}
              <li>
                <a
                  href="https://www.facebook.com/share/19hNCY4BUk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              </li>

              {/* WeChat */}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText('Raindrop132613');
                    alert('WeChat ID copied to clipboard: Raindrop132613');
                  }}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold hover:underline"
                  title="Click to copy WeChat ID"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>WeChat</span>
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 Brutal Age AB's Marketplace. All rights reserved.</p>
          <p className="text-slate-500 font-medium">
            Verified Handover Platform by{' '}
            <a
              href="https://zishannadaf.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-bold hover:underline"
            >
              Z
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};
