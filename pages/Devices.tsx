
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VERIFIED_HARDWARE } from '../constants';

export const Devices: React.FC = () => {
  const { devices } = useApp();
  const [view, setView] = useState<'my-devices' | 'compatibility'>('my-devices');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Infrastructure</h2>
          <p className="text-slate-500">Manage your energy data nodes and verified hardware.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setView('my-devices')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'my-devices' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            My Setup
          </button>
          <button 
            onClick={() => setView('compatibility')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'compatibility' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Compatibility Registry
          </button>
        </div>
      </div>

      {view === 'my-devices' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map(device => (
              <div key={device.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${device.type === 'Plug' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                      {device.type === 'Plug' ? '🔌' : '⚡'}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${device.status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {device.status}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Reliability: {device.reliabilityScore}%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800">{device.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{device.model} • {device.type}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex space-x-2">
                    {device.metering && <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-xs" title="Energy Metering">📊</span>}
                    {device.onOff && <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-xs" title="Remote Control">🕹️</span>}
                  </div>
                  <button className="text-blue-600 text-xs font-bold hover:underline">Node Settings</button>
                </div>
              </div>
            ))}
            
            <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <p className="text-slate-500 text-sm font-bold mt-4">Connect New Node</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Matter 1.3 / Thread</p>
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-2xl">⚡</div>
            <div>
              <h4 className="text-amber-900 font-bold">Unmetered Circuits Detected</h4>
              <p className="text-sm text-amber-700 max-w-2xl">
                Your main HVAC and Water Heating circuits aren't currently sub-metered. 
                Consider adding <strong>CT Clamps</strong> to these breakers for auditable savings tracking.
              </p>
            </div>
            <button className="ml-auto bg-amber-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-amber-200">Fallback Plan</button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-xl">
             <div className="max-w-3xl">
                <h3 className="text-2xl font-bold mb-4">EnergyPilot Compatibility Engine</h3>
                <p className="text-slate-400 leading-relaxed mb-8">
                   We do not claim universal compatibility. To maintain <strong>Audit-Grade Accuracy</strong>, 
                   we only support Matter 1.3+ devices or verified CT Clamp hardware. Using unsupported devices
                   may invalidate your savings reports.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1">
                    <p className="text-emerald-400 text-xs font-bold uppercase mb-1">High Accuracy</p>
                    <p className="text-lg font-bold">Matter 1.3</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">Supports real-time energy clusters & reliable mesh.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1">
                    <p className="text-blue-400 text-xs font-bold uppercase mb-1">Verified Audit</p>
                    <p className="text-lg font-bold">Thread/Zigbee</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">Interference-free local network protocol.</p>
                  </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {VERIFIED_HARDWARE.map((hw, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                 <div className="flex items-center space-x-6">
                   <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                     {hw.brand[0]}
                   </div>
                   <div>
                     <div className="flex items-center gap-3">
                       <h4 className="font-bold text-slate-800 text-lg">{hw.brand} {hw.model}</h4>
                       <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                         hw.tier === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 
                         hw.tier === 'Limited' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {hw.tier}
                       </span>
                     </div>
                     <p className="text-xs text-slate-400 mt-1">{hw.protocol} • {hw.notes}</p>
                   </div>
                 </div>

                 <div className="flex items-center space-x-8">
                   <div className="flex gap-2">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold ${hw.features.energyReporting ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>Energy Reporting</span>
                     <span className={`px-2 py-1 rounded text-[10px] font-bold ${hw.features.remoteControl ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>Remote Relay</span>
                   </div>
                   <button className="text-blue-600 text-xs font-bold">Details</button>
                 </div>
               </div>
             ))}
          </div>

          <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center text-center max-w-2xl mx-auto">
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             </div>
             <h4 className="font-bold text-slate-800">Can't find your device?</h4>
             <p className="text-sm text-slate-500 mt-2 mb-6">
               If you have equipment that isn't compatible with Matter 1.3, we recommend 
               using <strong>CT Clamps</strong> at the breaker level. This works for any device 
               and provides the highest accuracy.
             </p>
             <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-xl">Order CT Fallback Kit</button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 italic py-10">
        EnergyPilot is an independent platform and not affiliated with Matter, Thread, or specific hardware brands listed.
      </p>
    </div>
  );
};
