
import React, { useEffect, useState } from 'react';
import { StaffProfile } from '../types';
import { getProfileById, generateCoachingTip } from '../services/profiles';
import { useNavigate } from 'react-router-dom';
import { Avatar } from './Avatar';

interface ProfileDrawerProps {
  staffId: string | null;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ staffId, onClose }) => {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (staffId) {
      setLoading(true);
      getProfileById(staffId).then(p => {
        setProfile(p);
        setLoading(false);
      });
    }
  }, [staffId]);

  if (!staffId) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${staffId ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${staffId ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Staff Insight</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {loading ? (
              <div className="space-y-8 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-40 bg-slate-50 rounded-3xl"></div>
              </div>
            ) : profile ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-start gap-6">
                  <Avatar profile={profile} size="lg" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 leading-tight">{profile.name}</h4>
                        <p className="text-slate-500 font-medium">{profile.role} • {profile.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-slate-900 leading-none">{profile.score.composite}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">League Score</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {profile.badges.map(b => (
                        <span key={b} className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100">✨ {b}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact</p>
                    <p className="text-xl font-black text-emerald-600">£{profile.estimatedSavings}</p>
                    <p className="text-[10px] text-slate-500">Month Savings</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-xl font-black text-blue-600">{profile.complianceRate}%</p>
                    <p className="text-[10px] text-slate-500">Task Compliance</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Insights</h5>
                  <div className="space-y-2">
                    {profile.evidence.map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                        <p className="text-sm text-slate-700 leading-snug">{ev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">🧠</span>
                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Coaching Tip</h5>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed italic">
                    "{generateCoachingTip(profile)}"
                  </p>
                </div>

                <div className="pt-8 flex flex-col gap-3">
                  <button 
                    onClick={() => navigate(`/profiles/${profile.id}`)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                  >
                    View Full Analytics
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <button onClick={onClose} className="w-full py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                    Keep Browsing
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 font-bold">Profile not found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
