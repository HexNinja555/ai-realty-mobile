import { useState } from 'react';
import { KB_ARTICLES } from '@/data/seed';
import { type DBNotification } from '@/lib/db';
import { Clock, ShieldCheck, TrendingUp, Sparkles, BookOpen, Search, CheckCheck, Bell, Loader2 } from 'lucide-react';

const meta: Record<string, { Icon: any; c: string; bg: string }> = {
  deadline: { Icon: Clock, c: 'text-rose-600', bg: 'bg-rose-50' },
  compliance: { Icon: ShieldCheck, c: 'text-amber-600', bg: 'bg-amber-50' },
  market: { Icon: TrendingUp, c: 'text-teal-600', bg: 'bg-teal-50' },
  insight: { Icon: Sparkles, c: 'text-indigo-600', bg: 'bg-indigo-50' },
};

export default function Alerts({ items, loading, onRead, onReadAll }: {
  items: DBNotification[]; loading: boolean; onRead: (id: string) => void; onReadAll: () => void;
}) {
  const [tab, setTab] = useState<'alerts' | 'kb'>('alerts');
  const [q, setQ] = useState('');
  const kb = KB_ARTICLES.filter((a) => (a.title + a.cat).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="px-5 pt-3 sticky top-0 bg-slate-50 z-10 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">{tab === 'alerts' ? 'Notifications' : 'Knowledge Base'}</h1>
          {tab === 'alerts' && <button onClick={onReadAll} className="text-xs font-medium text-indigo-600 flex items-center gap-1"><CheckCheck size={14} /> Mark all read</button>}
        </div>
        <div className="flex bg-slate-200/60 rounded-xl p-1 mt-3">
          <button onClick={() => setTab('alerts')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium ${tab === 'alerts' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}><Bell size={15} /> Alerts</button>
          <button onClick={() => setTab('kb')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium ${tab === 'kb' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}><BookOpen size={15} /> Offline KB</button>
        </div>
      </div>

      {tab === 'alerts' ? (
        loading ? (
          <div className="flex justify-center py-16 text-slate-400"><Loader2 size={24} className="animate-spin" /></div>
        ) : (
          <div className="px-5 mt-2 space-y-2.5 pb-4">
            {items.length === 0 && <p className="text-center text-sm text-slate-400 py-10">No notifications.</p>}
            {items.map((n) => {
              const m = meta[n.type] || meta.insight;
              return (
                <button key={n.id} onClick={() => !n.read && onRead(n.id)}
                  className={`w-full text-left rounded-2xl p-3.5 border shadow-sm flex gap-3 ${n.read ? 'bg-white border-slate-100' : 'bg-indigo-50/40 border-indigo-100'}`}>
                  <span className={`h-10 w-10 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}><m.Icon size={20} className={m.c} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-sm font-semibold text-slate-800">{n.title}</p>{!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />}</div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{n.time_label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )
      ) : (
        <div className="px-5 mt-2 pb-4">
          <div className="relative mb-3">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search offline articles…" className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-teal-700 bg-teal-50 rounded-lg px-3 py-2 mb-3"><BookOpen size={13} /> Available offline · synced 12m ago</div>
          <div className="space-y-2.5">
            {kb.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{a.cat}</span><span className="text-[11px] text-slate-400">{a.read} read</span></div>
                <p className="text-sm font-semibold text-slate-800 mt-2">{a.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
