
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateWaste, detectSuspects } from '../services/analytics';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

const ExecutiveSummary = () => {
  const { activeSite, org, meterData, insights, auditLogs, sites, setActiveSite } = useApp();
  const navigate = useNavigate();
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  
  const { monthlyWaste, confidence } = calculateWaste(meterData, activeSite!, org!);
  
  // Calculate total auditable savings from logs
  const totalAuditableSaved = auditLogs
    .filter(l => l.status === 'Verified')
    .reduce((acc, curr) => acc + curr.gbpSaved, 0);

  const efficiencyScore = 84;
  const culprits = detectSuspects(meterData, activeSite!, org!);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 0) Portfolio Pulse - Multi-site SME View */}
      {sites.length > 1 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portfolio Pulse</h2>
            <button onClick={() => navigate('/portfolio')} className="text-blue-600 text-[10px] font-bold uppercase tracking-wider hover:underline">Manage All Sites</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {sites.map(site => (
               <div 
                key={site.id} 
                onClick={() => setActiveSite(site)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                  activeSite?.id === site.id ? 'bg-white border-blue-500 shadow-sm' : 'bg-white border-slate-100'
                }`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-bold text-slate-800 truncate pr-2">{site.name}</span>
                   <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                     site.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                   }`}>{site.status}</span>
                 </div>
                 <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Efficiency Score</p>
                      <p className={`text-lg font-bold ${site.wasteScore > 80 ? 'text-emerald-600' : 'text-amber-500'}`}>{site.wasteScore}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold ${site.deviation > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {site.deviation > 0 ? '+' : ''}{site.deviation}%
                      </p>
                      <p className="text-[8px] text-slate-400 uppercase">vs Normal</p>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* 1) This Month in 10 Seconds */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">This Month in 10 Seconds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-100 text-white flex flex-col justify-between">
            <span className="text-emerald-100/80 text-sm font-medium">Auditable Savings</span>
            <div className="mt-2">
              <span className="text-3xl font-bold">£{totalAuditableSaved.toFixed(0)}</span>
              <p className="text-[10px] text-emerald-100 mt-1 uppercase tracking-wider font-bold">Verified by Match-Day Logic</p>
            </div>
            <button 
              onClick={() => navigate('/reports')}
              className="mt-4 text-xs font-bold bg-white/10 hover:bg-white/20 py-2 rounded-xl transition-all border border-white/10"
            >
              View Evidence Trail
            </button>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-slate-500 text-sm font-medium">Savings Potential</span>
            <div className="mt-2 text-slate-900">
              <span className="text-3xl font-bold text-slate-900">£{monthlyWaste.toFixed(0)}</span>
              <p className="text-xs text-slate-400 mt-1">Further smart optimisation possible</p>
            </div>
          </div>
          <div className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-100 text-white flex flex-col justify-between">
            <span className="text-white/80 text-sm font-medium">Portfolio Efficiency</span>
            <div className="mt-2">
              <span className="text-3xl font-bold">{efficiencyScore}%</span>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${efficiencyScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* 2) Likely Culprits Ranking (Takes 3 columns) */}
        <section className="lg:col-span-3 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Energy Optimisation Insights</h3>
            <button onClick={() => navigate('/insights')} className="text-blue-600 text-xs font-bold hover:underline">View All Analysis</button>
          </div>
          
          <div className="space-y-4">
            {culprits.map((suspect) => (
              <div 
                key={suspect.id} 
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedSuspect === suspect.id ? 'border-blue-500 bg-blue-50/30' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
                }`}
                onClick={() => setSelectedSuspect(selectedSuspect === suspect.id ? null : suspect.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">
                      {suspect.type === 'IT' ? '💻' : suspect.type === 'HVAC' ? '❄️' : suspect.type === 'Lighting' ? '💡' : suspect.type === 'Refrigeration' ? '🧊' : suspect.type === 'Water Heating' ? '🚿' : '❓'}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{suspect.title}</h4>
                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-tighter">{suspect.type} • {suspect.faultCategory}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">£{suspect.estimatedMonthlySavings.toFixed(0)}<span className="text-[10px] text-slate-400 font-normal">/mo</span></p>
                    <div className="flex items-center mt-1 justify-end">
                      <div className="w-16 bg-slate-200 h-1 rounded-full overflow-hidden mr-2">
                        <div className="bg-blue-500 h-full" style={{ width: `${suspect.confidence}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400">{suspect.confidence}% Conf.</span>
                    </div>
                  </div>
                </div>
                
                {selectedSuspect === suspect.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">{suspect.summary}</p>
                    <div className="bg-blue-600/10 text-blue-700 p-3 rounded-xl flex items-center space-x-3 mb-4">
                       <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       <span className="text-[10px] font-bold">Action: {suspect.recommendedAction}</span>
                    </div>
                    <button onClick={() => navigate('/insights')} className="w-full bg-blue-600 text-white py-2 rounded-xl text-[10px] font-bold hover:bg-blue-700 whitespace-nowrap">Investigate Full Evidence</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3) Proof and Action Snippets (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Verified Proof</h3>
              <button onClick={() => navigate('/reports')} className="text-blue-600 text-xs font-bold hover:underline">Full Log</button>
            </div>
            <div className="space-y-3 flex-1">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{log.actionName}</p>
                      <p className="text-[9px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()} • {log.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">+£{log.gbpSaved.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-bold">Verify Your Potential</h3>
                <p className="text-slate-400 text-sm">Our AI detected 4 specific optimisations. Verify the biggest saving source with a single verified sensor to start saving for real.</p>
              </div>
              <button 
                onClick={() => navigate('/devices')}
                className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all"
              >
                Order Verification Kit
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          </section>
        </div>
      </div>

      {/* Tonight's 3 Actions */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Smart Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Optimise HVAC Occupancy Schedule', range: '£12–£15', risk: 'Low', icon: '❄️' },
            { name: 'Automate IT Monitor Standby', range: '£8–£20', risk: 'Low', icon: '💻' },
            { name: 'Check Walk-in Fridge Efficiency', range: '£5', risk: 'Low', icon: '🧊' }
          ].map((action, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{action.icon}</span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${action.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {action.risk} Risk
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">{action.name}</h4>
              <p className="text-xs text-slate-500 mb-6">Estimated daily saving: <span className="text-slate-900 font-bold">{action.range}</span></p>
              <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">Activate Policy</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const DetailsView = () => {
    const { meterData, activeSite } = useApp();
    const chartData = [...meterData].slice(0, 48).reverse();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Continuous Load Profile (kW)</h3>
                        <p className="text-slate-400 text-sm">Real-time meter readings versus smart baseline.</p>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorKw" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="timestamp" 
                                tick={{fontSize: 10}} 
                                tickFormatter={(str) => new Date(str).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                stroke="#94a3b8"
                            />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 10}} label={{ value: 'kW Load', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fontSize: 10, fill: '#94a3b8'}}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                labelFormatter={(str) => new Date(str).toLocaleString()}
                            />
                            <Area type="monotone" dataKey="kw" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorKw)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
  const { isAdvanced } = useApp();
  return (
    <div className="max-w-7xl mx-auto">
      {isAdvanced ? <DetailsView /> : <ExecutiveSummary />}
    </div>
  );
};
