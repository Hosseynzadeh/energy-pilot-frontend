
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { askAssistant, AssistantAction, AssistantResponse } from '../services/geminiService';
import { calculateWaste } from '../services/analytics';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  actions?: AssistantAction[];
  dataUsed?: string;
}

export const Assistant: React.FC = () => {
  const { activeSite, insights, org, meterData, autopilot, updateAutopilot } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'ai', 
      text: `Hi! I'm your EnergyPilot Assistant. I've analyzed ${activeSite?.name} and found we can save up to £${insights.reduce((a, b) => a + b.estimatedMonthlySavings, 0).toFixed(0)} this month through smarter energy use.`,
      actions: [
        { label: "Where is the potential?", type: "navigate", payload: "/insights" },
        { label: "Check Smart Plan", type: "navigate", payload: "/dashboard" }
      ],
      dataUsed: "Based on last 7 days and your site profile."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleAction = (action: AssistantAction) => {
    switch (action.type) {
      case 'navigate':
        navigate(action.payload);
        break;
      case 'toggle_autopilot':
        updateAutopilot({ mode: action.payload === 'on' ? 'Active' : 'Off' });
        setMessages(prev => [...prev, { role: 'ai', text: `Got it. Autopilot is now ${action.payload === 'on' ? 'Active' : 'Off'}.` }]);
        break;
      case 'review_fault':
        navigate('/insights');
        break;
      case 'suggest_check':
        setMessages(prev => [...prev, { role: 'ai', text: `Added to your checklist: ${action.payload}` }]);
        break;
    }
  };

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsLoading(true);

    const stats = calculateWaste(meterData, activeSite!, org!);
    const context = {
        siteName: activeSite!.name,
        insights: insights.map(i => ({ title: i.title, impact: i.estimatedMonthlySavings })),
        stats,
        operatingHours: `${activeSite!.operatingHours.start} - ${activeSite!.operatingHours.end}`,
        autopilotMode: autopilot.mode
    };

    const aiResponse: AssistantResponse = await askAssistant(query, context);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: aiResponse.text, 
      actions: aiResponse.actions,
      dataUsed: `Based on last 14 days and your operating hours ${context.operatingHours}.`
    }]);
    setIsLoading(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    // @ts-ignore
    const Recognition = window.webkitSpeechRecognition || window.speechRecognition;
    const recognition = new Recognition();
    recognition.lang = 'en-GB';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none p-4 shadow-md' : 'w-full'}`}>
              {m.role === 'user' ? (
                <span>{m.text}</span>
              ) : (
                <div className="bg-white border border-slate-100 p-6 rounded-3xl rounded-tl-none shadow-sm space-y-4">
                  <p className="text-slate-800 text-lg font-medium leading-relaxed">{m.text}</p>
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {m.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(action)}
                          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                          {action.label}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      ))}
                    </div>
                  )}
                  {m.dataUsed && (
                    <div className="pt-4 border-t border-slate-50 text-[10px] text-slate-400 italic">
                      {m.dataUsed}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-1 shadow-sm">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
            </div>
        )}
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-lg mt-4 mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={startListening}
            className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            title="Push to Talk"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </button>
          <input 
            type="text" 
            className="flex-1 outline-none bg-transparent text-slate-800 placeholder-slate-400 font-medium"
            placeholder="Ask: 'Where is my biggest efficiency potential?'"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
