
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProfileDrawer } from '../components/ProfileDrawer';
import { Avatar } from '../components/Avatar';

export const Team: React.FC = () => {
  const { team, deptRankings, rewards, user, org, setLeagueMode } = useApp();
  const [activeTab, setActiveTab] = useState<'individual' | 'department'>('individual');
  const [approving, setApproving] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // Mocking current user context
  const currentUserStats = team.find(m => m.name === 'Sarah Wilson') || team[1];
  const isManager = user?.role === 'Manager';
  const isTeamOnlyMode = org?.leagueMode === 'TeamOnly';

  // GUARDRAIL 1: Explicitly filter out safety-critical roles from competitive leaderboards
  const rankableTeam = team.filter(m => !m.isSafetyCritical);
  const sortedTeam = [...rankableTeam].sort((a, b) => b.score.composite - a.score.composite);
  
  // GUARDRAIL 4: Toggle visibility based on Manager's preference for Team vs Individual focus
  const displayTeam = isManager ? sortedTeam : sortedTeam.slice(0, 3);

  // GUARDRAIL 3: Manager approval required for prizes
  const handleApproveRewards = () => {
    if (!confirm("Are you sure you want to approve this month's prizes? This will release digital vouchers to the top efficiency performers based on audited savings.")) return;
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      alert("Success! Individual bonuses and team lunch vouchers have been approved and emailed to the team.");
    }, 2000);
  };

  const ScoreBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24 relative">
      
      {/* 1) Personal Summary Card */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left max-w-xl">
            <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Monthly Impact Analysis</span>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar profile={currentUserStats} size="lg" />
              <div>
                <h2 className="text-5xl font-black tracking-tight leading-tight">Great Work, {currentUserStats.name.split(' ')[0]}!</h2>
                <p className="text-blue-100 text-lg font-medium leading-relaxed">
                  Your efficiency habits in <strong>{currentUserStats.department}</strong> saved £{currentUserStats.estimatedSavings} this month.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              {currentUserStats.badges.map(b => (
                <span key={b} className="bg-white text-blue-800 px-5 py-2 rounded-2xl text-xs font-black shadow-xl">✨ {b}</span>
              ))}
            </div>
            <button 
              onClick={() => setSelectedStaffId(currentUserStats.id)}
              className="mt-6 px-8 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm font-black hover:bg-white/20 transition-all flex items-center gap-3"
            >
              Check My Detailed Stats
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 text-center min-w-[240px] shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Personal Score</p>
            <div className="text-8xl font-black leading-none">{currentUserStats.score.composite}</div>
            <p className="text-sm font-bold mt-6 text-emerald-300 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              Steady Improvement
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      </section>

      {/* 2) Manager Controls Section */}
      {isManager && (
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm gap-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">League Configuration</h2>
            <p className="text-slate-500 text-lg font-medium mt-1">Ethical competition settings and role-based fairness.</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
               <button 
                 onClick={() => setLeagueMode('Individual')}
                 className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${org?.leagueMode === 'Individual' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}
               >
                 Individual Rank
               </button>
               <button 
                 onClick={() => setLeagueMode('TeamOnly')}
                 className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${org?.leagueMode === 'TeamOnly' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}
               >
                 Team Only
               </button>
            </div>

            <button 
              onClick={handleApproveRewards}
              disabled={approving}
              className={`px-8 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3 ${approving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="width-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Approve Cash Prizes
            </button>
          </div>
        </div>
      )}

      {/* 3) Leaderboard View */}
      <div className="space-y-8">
        <div className="flex justify-between items-center px-4">
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setActiveTab('individual')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'individual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Staff Leaderboard</button>
             <button onClick={() => setActiveTab('department')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'department' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Department Progress</button>
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safety Check: Active</span>
           </div>
        </div>

        {activeTab === 'individual' ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] border-b border-slate-50">
                <tr>
                  <th className="px-10 py-6">Rank</th>
                  <th className="px-10 py-6">Staff Member</th>
                  <th className="px-10 py-6">Habit Trend</th>
                  <th className="px-10 py-6 text-right">League Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isTeamOnlyMode && !isManager ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                       <div className="max-w-md mx-auto space-y-4">
                          <div className="text-4xl">🤝</div>
                          <h4 className="text-xl font-black text-slate-800">Team-First Mode Enabled</h4>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Individual rankings are hidden to promote group collaboration.
                            Check your personal score card at the top of the page!
                          </p>
                          <button onClick={() => setActiveTab('department')} className="text-blue-600 font-bold text-sm">View Department Progress →</button>
                       </div>
                    </td>
                  </tr>
                ) : (
                  displayTeam.map((member, i) => (
                    <tr 
                      key={member.id}
                      onClick={() => setSelectedStaffId(member.id)}
                      className="group hover:bg-blue-50/30 transition-all cursor-pointer"
                    >
                      <td className="px-10 py-8">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                          i === 0 ? 'bg-amber-100 text-amber-600' : 
                          i === 1 ? 'bg-slate-100 text-slate-500' : 
                          i === 2 ? 'bg-orange-50 text-orange-600' : 'text-slate-200'
                        }`}>
                          {i + 1}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <Avatar profile={member} size="md" />
                          <div>
                            <p className="text-base font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{member.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`flex items-center gap-1.5 text-xs font-black ${member.trend === 'Rising' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {member.trend === 'Rising' ? '↑ Rising' : '→ Steady'}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-6">
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">{member.score.composite}</span>
                          <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:shadow-lg text-slate-300`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {deptRankings.map((dept, i) => (
              <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                <div className="space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="w-20 h-20 rounded-[1.75rem] bg-blue-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {dept.name === 'Kitchen' ? '🍳' : dept.name === 'Front of House' ? '🤝' : '🏢'}
                    </div>
                    <div className="text-right">
                      <p className="text-7xl font-black text-slate-900 leading-none tracking-tighter">{dept.score.composite}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">Team Health</p>
                    </div>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight">{dept.name}</h4>
                  <div className="space-y-6 pt-10 border-t border-slate-50">
                     <ScoreBar label="Habit Improvement" value={dept.score.improvement} color="bg-emerald-500" />
                     <ScoreBar label="Compliance" value={dept.score.behavior} color="bg-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-[3.5rem] p-16 text-center max-w-5xl mx-auto border border-slate-100 shadow-inner space-y-8">
         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-200">
           <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
         </div>
         <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Our Ethics Commitment</h4>
         <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto italic">
            "EnergyPilot rankings are 100% positive and non-punitive. We never rank by raw kWh consumption. Safety-critical roles are excluded to ensure essential equipment is never compromised for points."
         </p>
      </div>

      <ProfileDrawer staffId={selectedStaffId} onClose={() => setSelectedStaffId(null)} />
    </div>
  );
};
