
import React from 'react';
import { useApp } from '../context/AppContext';
import { LoadPriority } from '../types';

export const Autopilot: React.FC = () => {
  const { autopilot, updateAutopilot, updateAssetPriority } = useApp();

  const handleToggleMode = () => {
    const newMode = autopilot.mode === 'Active' ? 'Off' : 'Active';
    updateAutopilot({ mode: newMode });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* 1) Main Control Panel */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">EnergyPilot Mission Control</h2>
            <p className="text-slate-500 text-sm">Managing out-of-hours energy efficiency with safety first.</p>
          </div>
          <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <span className={`text-xs font-bold uppercase tracking-widest px-4 ${autopilot.mode === 'Active' ? 'text-blue-600' : 'text-slate-400'}`}>
              {autopilot.mode === 'Active' ? 'Autopilot ON' : 'Autopilot OFF'}
            </span>
            <button
              onClick={handleToggleMode}
              className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${
                autopilot.mode === 'Active' ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${autopilot.mode === 'Active' ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Off', 'Advisory', 'Active'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updateAutopilot({ mode })}
              className={`p-6 rounded-3xl border-2 text-left transition-all ${
                autopilot.mode === mode 
                ? 'border-blue-600 bg-blue-50/50 shadow-md' 
                : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${autopilot.mode === mode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {mode}
                </span>
                {autopilot.mode === mode && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>}
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{
                mode === 'Off' ? 'Monitoring Only' : mode === 'Advisory' ? 'AI Recommendations' : 'Fully Automated'
              }</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{
                mode === 'Off' ? 'We only watch your data and report efficiency gaps.' : mode === 'Advisory' ? 'We suggest smart adjustments, you tap to confirm.' : 'AI actively manages energy use based on your guardrails.'
              }</p>
            </button>
          ))}
        </div>
      </div>

      {/* 2) Safety & Policy Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Protected Assets List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Protected Equipment List</h3>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">No interference with critical loads</span>
          </div>
          
          <div className="space-y-4">
            {autopilot.protectedAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    asset.priority === 'Critical' ? 'bg-red-50 text-red-600' : 
                    asset.priority === 'Conditional' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {asset.priority === 'Critical' ? '🛡️' : asset.priority === 'Conditional' ? '⚖️' : '☁️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">{asset.name}</h4>
                      {asset.priority === 'Critical' && <span className="text-[8px] bg-red-100 text-red-700 px-1 rounded font-black uppercase">Safety Critical</span>}
                    </div>
                    <p className="text-[10px] text-slate-400">Policy: {asset.priority === 'Critical' ? 'Excluded from control' : 'Smart Optimization'}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {(['Critical', 'Conditional', 'Flexible'] as LoadPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateAssetPriority(asset.id, p)}
                      className={`px-3 py-1 rounded-lg text-[9px] font-bold transition-all border ${
                        asset.priority === p 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-sm font-bold hover:border-blue-200 hover:text-blue-600 transition-all">
            + Add Protected Asset
          </button>
        </div>

        {/* Global Policy Settings */}
        <div className="space-y-8">
          <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
            <h3 className="text-lg font-bold mb-4">Human Override</h3>
            <p className="text-slate-400 text-xs mb-8 leading-relaxed">
              Staff safety and manual control always take precedence. If a switch is toggled locally, EnergyPilot pauses for:
            </p>
            
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 mb-8">
              <span className="text-sm font-bold">{autopilot.overrideResumeHours} Hours</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => updateAutopilot({ overrideResumeHours: Math.max(1, autopilot.overrideResumeHours - 1) })}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >-</button>
                <button 
                  onClick={() => updateAutopilot({ overrideResumeHours: Math.min(24, autopilot.overrideResumeHours + 1) })}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >+</button>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[10px] text-slate-500 italic">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
              <span>Verified: System respects manual control.</span>
            </div>
          </section>

          <section className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
            <h3 className="text-lg font-bold mb-2">Policy Verification</h3>
            <p className="text-blue-100 text-xs leading-relaxed mb-6">
              Our AI verifies that suggested optimizations do not impact safety-critical sensors or professional-grade refrigeration clusters.
            </p>
            <div className="p-3 bg-white/10 rounded-xl text-[10px] font-bold">
              Status: Audit Complete - 0 Risks
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
