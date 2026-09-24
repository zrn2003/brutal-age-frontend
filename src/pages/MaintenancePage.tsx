import React from 'react';
import { Wrench, ShieldAlert, RefreshCw } from 'lucide-react';

interface MaintenancePageProps {
  message?: string;
  onRefresh?: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  message = 'We are currently upgrading the Brutal Age Marketplace for enhanced speed, security, and high-performance server capacity.',
  onRefresh,
}) => {

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-600 font-heading">
      
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
        
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-amber-500" />

        {/* Animated Badge & Icon */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-extrabold uppercase mb-6">
          <Wrench className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Scheduled System Maintenance</span>
        </div>

        {/* Big Maintenance Shield */}
        <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/80 border border-slate-700 rounded-none flex items-center justify-center text-amber-400 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3 font-heading">
          System Under Maintenance
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8 bg-slate-950/60 p-4 border border-slate-800">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => (onRefresh ? onRefresh() : window.location.reload())}
            className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Brutal Age AB's Marketplace</span>
          <span className="font-mono text-slate-400">HTTP 503 SERVICE UNAVAILABLE</span>
        </div>

      </div>

    </div>
  );
};

export default MaintenancePage;
