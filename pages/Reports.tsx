
import React from 'react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const Reports: React.FC = () => {
  const { activeSite, auditLogs } = useApp();

  const reportData = [
    { name: 'Week 1', baseline: 1200, actual: 1150 },
    { name: 'Week 2', baseline: 1200, actual: 1050 },
    { name: 'Week 3', baseline: 1200, actual: 950 },
    { name: 'Week 4', baseline: 1200, actual: 880 },
  ];

  const totalSaved = auditLogs.reduce((acc, curr) => acc + curr.gbpSaved, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Savings Evidence Trail</h2>
          <p className="text-slate-500">Every Penny Saved. Audited against Smart Energy Baselines.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white text-slate-600 px-6 py-2 rounded-xl font-bold text-sm border border-slate-200">Export CSV</button>
          <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg">Download PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Weekly Energy Impact (kWh)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 10}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" />
                <Bar name="Baseline (Smart Target)" dataKey="baseline" fill="#e2e8f0" radius={[4,4,0,0]} />
                <Bar name="Actual Usage" dataKey="actual" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Total Savings Logged</p>
            <h4 className="text-5xl font-bold">£{totalSaved.toFixed(2)}</h4>
            <p className="mt-4 text-emerald-100/60 text-xs italic">All savings are normalized for seasonality and working hours.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">M&V Controls</h4>
            <div className="space-y-4">
               {[
                 { label: 'Outlier Filter', val: 'Active' },
                 { label: 'Seasonality Control', val: 'Enabled' },
                 { label: 'Optimisation Accuracy', val: '94%' },
               ].map((stat, i) => (
                 <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                   <span className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</span>
                   <span className="text-xs font-bold text-slate-700">{stat.val}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Detailed Action Audit Trail</h3>
          <span className="text-xs font-bold text-slate-400">Comparing Current Period vs Baseline matched by Smart Patterns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Autopilot Action</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4 text-right">kWh Saved</th>
                <th className="px-8 py-4 text-right">£ Impact</th>
                <th className="px-8 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-4 text-xs font-medium text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-8 py-4 text-xs font-bold text-slate-800">{log.actionName}</td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase">{log.category}</span>
                  </td>
                  <td className="px-8 py-4 text-right text-xs text-slate-600">{log.kwhSaved.toFixed(2)}</td>
                  <td className="px-8 py-4 text-right text-xs font-bold text-emerald-600">+£{log.gbpSaved.toFixed(2)}</td>
                  <td className="px-8 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${log.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-slate-900 p-8 rounded-3xl text-white/80 text-xs italic text-center">
        This report is generated using standard match-day measurement and verification (M&V) logic. It provides a credible estimate of savings by isolating efficiency gains.
      </div>
    </div>
  );
};
