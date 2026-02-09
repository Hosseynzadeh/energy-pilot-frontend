
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Insights: React.FC = () => {
  const { insights } = useApp();
  const [selectedFault, setSelectedFault] = useState<string | null>(insights[0]?.id || null);

  const activeInsight = insights.find(i => i.id === selectedFault);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Fault Detection</h2>
          <p className="text-slate-500">Plain-language analysis of your site's energy leaks.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Monthly Leakage</p>
          <p className="text-2xl font-bold text-red-500">£{insights.reduce((acc, i) => acc + i.estimatedMonthlySavings, 0).toFixed(0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Fault List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Suspected Faults</h3>
          {insights.map(insight => (
            <button
              key={insight.id}
              onClick={() => setSelectedFault(insight.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedFault === insight.id 
                ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20' 
                : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">
                    {insight.type === 'IT' ? '💻' : insight.type === 'HVAC' ? '❄️' : insight.type === 'Lighting' ? '💡' : insight.type === 'Refrigeration' ? '🧊' : insight.type === 'Water Heating' ? '🚿' : '❓'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{insight.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{insight.faultCategory}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-bold text-red-500">£{insight.estimatedMonthlySavings.toFixed(0)}/mo</span>
                <span className="text-[10px] text-slate-400 font-medium">{insight.confidence}% confidence</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Detailed Insight */}
        <div className="lg:col-span-8">
          {activeInsight ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded">{activeInsight.type}</span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">{activeInsight.faultCategory}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{activeInsight.title}</h3>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-red-500 text-xl">£{activeInsight.estimatedMonthlySavings.toFixed(0)}</p>
                     <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Potential Monthly Saving</p>
                   </div>
                </div>
              </div>

              <div className="p-8 space-y-10 flex-1">
                {/* 1. Why it matters */}
                <section>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Why it matters</h4>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {activeInsight.summary}
                  </p>
                </section>

                {/* 2. Evidence */}
                <section>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">The Evidence</h4>
                  <div className="space-y-3">
                    {activeInsight.evidence.map((ev, i) => (
                      <div key={i} className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <p className="text-sm text-slate-600 font-medium">{ev}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Action Plan */}
                <section className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                   <div className="relative z-10">
                    <h4 className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">Recommended Action</h4>
                    <p className="text-lg font-bold mb-6">
                      {activeInsight.recommendedAction}
                    </p>
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-all">
                      I've handled this
                    </button>
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                </section>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                 <p className="text-[10px] text-slate-400 font-medium">Analysis updated today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} based on {activeInsight.patternDetected} usage patterns.</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <div>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-bold text-slate-800">Select a fault to see details</h3>
                <p className="text-sm text-slate-500 mt-1">Our AI is continuously monitoring for abnormal patterns.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
