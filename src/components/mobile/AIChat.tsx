import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Mic, Sparkles, Bot } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

const QUICK = ['Draft a listing description', 'Summarize today\'s market', 'Write a follow-up text', 'Check contract compliance'];

export default function AIChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hi Jordan! I'm BrokerBot, your AI teammate. I can draft listings, analyze markets, review contracts, and prep client outreach. What are we tackling today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      const reply = data?.reply || 'Sorry, I could not respond.';
      // simulate streaming
      let shown = '';
      setMessages((p) => [...p, { role: 'assistant', content: '' }]);
      const words = reply.split(' ');
      for (let i = 0; i < words.length; i++) {
        shown += (i ? ' ' : '') + words[i];
        await new Promise((r) => setTimeout(r, 18));
        setMessages((p) => { const c = [...p]; c[c.length - 1] = { role: 'assistant', content: shown }; return c; });
      }
    } catch {
      setMessages((p) => [...p, { role: 'assistant', content: 'I hit a connection snag. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const voice = () => {
    setListening(true);
    setTimeout(() => { setListening(false); setInput('Draft a luxury listing description for 1420 Vista Ridge Dr'); }, 1600);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center gap-3">
        <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center text-white"><Bot size={22} /></span>
        <div className="flex-1">
          <p className="font-bold text-slate-800 leading-tight">BrokerBot</p>
          <p className="text-[11px] text-teal-600 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> AI teammate · online</p>
        </div>
        <Sparkles size={20} className="text-amber-400" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${m.role === 'user'
              ? 'bg-indigo-600 text-white rounded-2xl rounded-br-md'
              : 'bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100'}`}>
              {m.content || <span className="inline-flex gap-1"><Dot /><Dot d={150} /><Dot d={300} /></span>}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start"><div className="bg-white rounded-2xl rounded-bl-md border border-slate-100 px-4 py-3 shadow-sm"><span className="inline-flex gap-1"><Dot /><Dot d={150} /><Dot d={300} /></span></div></div>
        )}
      </div>

      {/* Quick replies */}
      <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-slate-50 border-t border-slate-100">
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)} className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 text-indigo-700 active:bg-indigo-50">{q}</button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2">
        <button onClick={voice} className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${listening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}><Mic size={19} /></button>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder={listening ? 'Listening…' : 'Message BrokerBot…'} className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
        <button onClick={() => send(input)} disabled={!input.trim()} className="h-10 w-10 shrink-0 rounded-full bg-indigo-600 disabled:opacity-40 text-white flex items-center justify-center active:scale-90 transition-transform"><Send size={18} /></button>
      </div>
    </div>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />;
}
