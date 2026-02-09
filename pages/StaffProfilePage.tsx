
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaffProfile, GenderHint } from '../types';
import { getProfileById, generateCoachingTip } from '../services/profiles';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Avatar } from '../components/Avatar';
import { useApp } from '../context/AppContext';

export const StaffProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { demoMode } = useApp();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProfileById(id).then(p => {
        setProfile(p);
        setLoading(false);
      });
    }
  }, [id]);

  const toggleGender = () => {
    if (!profile) return;
    const hints: GenderHint[] = ['male', 'female', 'neutral'];
    const currentIdx = hints.indexOf(profile.genderHint || 'neutral');
    const nextHint = hints[(currentIdx + 1) % hints.length];
    setProfile({ ...profile, genderHint: nextHint });
  };

  const handleAction = (label: string) => {
    setActioning(label);
    setTimeout(() => {
      setActioning(null);
      alert(`${label} action completed successfully.`);
    }, 1000);
  };

  const chartData = profile?.scoreHistory.map((score, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    score
  })) || [];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 animate-pulse space-y-12">
        <div className="h-32 bg-white rounded-[3rem]"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="h-64 bg-white rounded-[2rem] md:col-span-2"></div>
           <div className="h-64 bg-white rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto py-40 text-center space-y-6">
        <div className="text-6xl">🔍</div>
        <h2 className="text-3xl font-black text-slate-900">Profile Not Available</h2>
        <button onClick={() => navigate('/team')} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">Back to League</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/team')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          Back to League
        </button>

        {/* Developer Demo Control */}
        {demoMode && (
          <button 
            onClick={toggleGender}
            className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-blue-500 opacity-20 hover:opacity-100 transition-all border border-slate-200 px-3 py-1 rounded-full"
          >
            Fix Gender Mismatch ({profile.genderHint || 'neutral'})
          </button>
        )}
      </div>

      <section className="bg-white rounded-[3.5rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex flex-col md:flex-row items-center gap-10">
              <Avatar profile={profile} size="xl" />
              <div className="text-center md:text-left space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    {profile.badges.map(b => (
                      <span key={b} className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100">✨ {b}</span>
                    ))}
                 </div>
                 <h1 className="text-5xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                 <p className="text-xl text-slate-500 font-medium">{profile.role} • {profile.department} at {profile.siteId.replace('site-', '')}</p>
              </div>
           </div>
           
           <div className="bg-slate-50 p-10 rounded-[2.5rem] text-center min-w-[200px] border border-slate-100 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-slate-400">Current Rank</p>
              <div className="flex items-center justify-center gap-3">
                 <span className="text-7xl font-black text-slate-900 leading-none">#{profile.rank}</span>
                 <div className={`text-sm font-black flex items-center gap-1 ${profile.trend === 'Rising' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {profile.trend === 'Rising' ? '↑' : '→'}
                 </div>
              </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Why this rank?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Savings</p>
                    <p className="text-3xl font-black text-emerald-700">£{profile.estimatedSavings}</p>
                 </div>
                 <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Compliance</p>
                    <p className="text-3xl font-black text-blue-700">{profile.complianceRate}%</p>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Overrides</p>
                    <p className="text-3xl font-black text-slate-700">{profile.overridesCount}</p>
                 </div>
              </div>

              <div className="space-y-4 pt-6">
                 {profile.evidence.map((ev, i) => (
                   <div key={i} className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm bg-slate-200">
                         {ev.tag === 'improvement' ? '📈' : '✅'}
                      </div>
                      <p className="text-base font-black text-slate-800 leading-tight">{ev.text}</p>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <div className="space-y-10">
           <section className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">💡</div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coaching</h4>
              </div>
              <p className="text-lg text-slate-300 italic">"{generateCoachingTip(profile)}"</p>
           </section>

           <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Actions</h4>
              <div className="space-y-3">
                 <button onClick={() => handleAction("Reward Approved")} className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-lg">Approve Reward</button>
                 <button onClick={() => handleAction("Recognition Sent")} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black shadow-lg">Send Recognition</button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};
