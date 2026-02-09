
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    orgName: '',
    tariff: '0.32',
    siteName: '',
    location: '',
    start: '08:00',
    end: '18:00',
    equipment: [] as string[],
    departments: ['Kitchen', 'Office', 'Floor'],
    staff: '3'
  });

  const equipmentOptions = ['Lighting', 'HVAC', 'Refrigeration', 'Server/IT', 'Kitchen', 'Other'];

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const toggleEquipment = (opt: string) => {
    setFormData(prev => ({
        ...prev,
        equipment: prev.equipment.includes(opt) 
            ? prev.equipment.filter(e => e !== opt) 
            : [...prev.equipment, opt]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden">
        <div className="bg-blue-600 h-2 transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }}></div>
        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Welcome to EnergyPilot</h2>
                <p className="text-slate-500">Smart energy use. Proven savings.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. London Bakery Group"
                    value={formData.orgName}
                    onChange={e => setFormData({ ...formData, orgName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Energy Tariff (£/kWh)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.tariff}
                    onChange={e => setFormData({ ...formData, tariff: e.target.value })}
                  />
                  <p className="text-xs text-slate-400 mt-2">UK Average is ~£0.30/kWh. Find this on your monthly bill.</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Add Your First Site</h2>
                <p className="text-slate-500">We analyze energy use relative to your site details.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Site Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Central Warehouse"
                    value={formData.siteName}
                    onChange={e => setFormData({ ...formData, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="City / Region"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Operating Hours</h2>
                <p className="text-slate-500">Everything outside these hours is prioritized for smart energy use.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Opens at</label>
                  <input 
                    type="time" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.start}
                    onChange={e => setFormData({ ...formData, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Closes at</label>
                  <input 
                    type="time" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.end}
                    onChange={e => setFormData({ ...formData, end: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400">Weekends are assumed closed by default unless changed later.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Equipment Profile</h2>
                <p className="text-slate-500">Select what's running on-site to help our AI detection.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {equipmentOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleEquipment(opt)}
                    className={`px-4 py-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                        formData.equipment.includes(opt) 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {opt}
                    {formData.equipment.includes(opt) && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Team & Departments</h2>
                <p className="text-slate-500">Enable Closing Leaderboards and shift attribution.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Key Departments</label>
                  <div className="flex flex-wrap gap-2">
                    {['Office', 'Kitchen', 'Warehouse', 'Retail', 'Storage'].map(dept => (
                      <span key={dept} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Number of Staff</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                    value={formData.staff}
                    onChange={e => setFormData({ ...formData, staff: e.target.value })}
                  >
                    <option value="3">1-5 Employees</option>
                    <option value="10">5-20 Employees</option>
                    <option value="50">20+ Employees</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">Demo data will be generated for {formData.staff} staff members.</p>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center">
            {step > 1 ? (
              <button onClick={prev} className="px-6 py-2 font-semibold text-slate-500 hover:text-slate-900">Back</button>
            ) : <div></div>}
            
            {step < 5 ? (
              <button onClick={next} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Continue</button>
            ) : (
              <button 
                onClick={() => completeOnboarding(
                  { name: formData.orgName, tariff: formData.tariff },
                  { name: formData.siteName, location: formData.location, start: formData.start, end: formData.end, equipment: formData.equipment, departments: ['Kitchen', 'Office', 'Floor'] }
                )}
                className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
