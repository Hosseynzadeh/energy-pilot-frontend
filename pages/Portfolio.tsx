
import React from 'react';
import { useApp } from '../context/AppContext';

export const Portfolio: React.FC = () => {
  const { sites, setActiveSite, applyPolicyToAllSites, autopilot } = useApp();
  
  const handleRollout = () => {
    if (window.confirm(`Roll out current Autopilot policy (${autopilot.mode}) and ${autopilot.protectedAssets.length} protected assets to all ${sites.length} locations?`)) {
      applyPolicyToAllSites(autopilot);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Portfolio Health</h2>
          <p className="text-slate-500">Ranking your sites by efficiency potential and verified savings.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRollout}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Sync Policy to All
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-100">+ Add New Site</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sites.sort((a, b) => b.monthlyWaste - a.monthlyWaste).map((ps) => (
          <div 
            key={ps.id} 
            onClick={() => setActiveSite(ps)}
            className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer shadow-sm flex items-center justify-between hover:border-blue-400 ${ps.status === 'Needs Attention' ? 'border-red-100 bg-red-50/10' : 'border-slate-100'}`}
          >
            <div className="flex items-center space-x-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                ps.wasteScore > 85 ? 'bg-emerald-50 text-emerald-600' : ps.wasteScore > 70 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                {ps.wasteScore}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{ps.name}</h4>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-400">{ps.location}</p>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                     ps.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                   }`}>{ps.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-12">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Savings Potential</p>
                <div className="flex items-center justify-end gap-2">
                  <p className={`text-xl font-bold ${ps.deviation > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    £{ps.monthlyWaste}
                  </p>
                  <span className={`text-[10px] font-bold ${ps.deviation > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {ps.deviation > 0 ? '▲' : '▼'} {Math.abs(ps.deviation)}%
                  </span>
                </div>
              </div>
              <button 
                className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-100"
              >
                Switch Console
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="max-w-2xl">
          <h3 className="text-xl font-bold mb-2">Portfolio Anomaly Detected</h3>
          <p className="text-slate-400 text-sm">
            Site <strong>"{sites.find(s => s.status === 'Needs Attention')?.name}"</strong> is deviating from its 30-day normal baseline by +24%. 
            This usually indicates manual overrides or equipment inefficiency during standard operation.
          </p>
        </div>
        <button 
          onClick={() => {
            const worstSite = sites.find(s => s.status === 'Needs Attention');
            if (worstSite) setActiveSite(worstSite);
          }}
          className="bg-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-red-600 whitespace-nowrap"
        >
          Investigate Efficiency
        </button>
      </div>
    </div>
  );
};
