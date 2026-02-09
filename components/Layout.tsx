
import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons, COLORS } from '../constants';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');

  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdvanced, setAdvanced, activeSite, demoMode } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-20">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">EnergyPilot</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          <SidebarItem to="/dashboard" icon={<Icons.Dashboard />} label="Dashboard" />
          <SidebarItem to="/portfolio" icon={<Icons.Portfolio />} label="Portfolio" />
          <SidebarItem to="/insights" icon={<Icons.Insights />} label="Insights" />
          <SidebarItem to="/autopilot" icon={<Icons.Autopilot />} label="Autopilot" />
          <SidebarItem to="/devices" icon={<Icons.Devices />} label="Devices" />
          <SidebarItem to="/team" icon={<Icons.Team />} label="League & Rewards" />
          <SidebarItem to="/reports" icon={<Icons.Reports />} label="Reports" />
          <SidebarItem to="/assistant" icon={<Icons.Assistant />} label="Assistant" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Advanced Tools</span>
              <button 
                onClick={() => setAdvanced(!isAdvanced)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isAdvanced ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isAdvanced ? 'right-1' : 'left-1'}`} />
              </button>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl">
             <div className="flex items-center space-x-3">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">M</div>
               <div>
                 <p className="text-xs font-bold text-slate-800">Manager</p>
                 <p className="text-[10px] text-slate-500 truncate w-32">{activeSite?.name || 'Loading...'}</p>
               </div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800">{activeSite?.name}</h1>
            {demoMode && (
              <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                Demo Environment
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
              Autopilot: Advisory
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
};
