import { useState, useEffect } from 'react';
import { APPOINTMENTS, TASKS } from '@/data/seed';
import { listProperties, fmtPrice, type DBProperty } from '@/lib/db';
import { TrendingUp, Sparkles, CheckCircle2, Circle, ChevronRight, Bot, ScanLine, UserPlus, Wifi, WifiOff } from 'lucide-react';

const colorMap: Record<string, string> = {
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function Dashboard({ go, online, setOnline }: { go: (t: any) => void; online: boolean; setOnline: (v: boolean) => void }) {
  const [tasks, setTasks] = useState(TASKS);
  const [props, setProps] = useState<DBProperty[]>([]);
  useEffect(() => { listProperties().then(setProps).catch(console.error); }, []);
  const active = props.filter((p) => p.status === 'Active').length;
  const portfolio = props.reduce((s, p) => s + Number(p.price), 0);
  const done = tasks.filter((t) => t.done).length;
  const ring = Math.round((done / tasks.length) * 100);


  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-5 pt-2 pb-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-teal-600 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-xs">Good afternoon,</p>
            <h1 className="text-white text-xl font-bold">Jordan Avery</h1>
          </div>
          <button onClick={() => setOnline(!online)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${online ? 'bg-white/20 text-white' : 'bg-amber-400 text-amber-950'}`}>
            {online ? <Wifi size={13} /> : <WifiOff size={13} />}{online ? 'Online' : 'Offline'}
          </button>
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3 border border-white/10">
            <p className="text-white text-2xl font-bold">{active}</p>
            <p className="text-indigo-100 text-[11px]">Active listings</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3 border border-white/10">
            <p className="text-white text-2xl font-bold">12</p>
            <p className="text-indigo-100 text-[11px]">Hot leads</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3 border border-white/10 flex flex-col items-center justify-center">
            <div className="relative h-8 w-8">
              <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="4" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray={`${ring * 0.94} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white text-[9px] font-bold">{ring}%</span>
            </div>
            <p className="text-indigo-100 text-[11px] mt-1">Tasks</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { Icon: Bot, label: 'Ask AI', t: 'chat', c: 'from-teal-400 to-teal-600' },
            { Icon: ScanLine, label: 'Scan', t: 'scan', c: 'from-indigo-400 to-indigo-600' },
            { Icon: UserPlus, label: 'New lead', t: 'listings', c: 'from-amber-400 to-amber-600' },
          ].map(({ Icon, label, t, c }) => (
            <button key={label} onClick={() => go(t)} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <span className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${c} text-white flex items-center justify-center shadow-md`}><Icon size={24} /></span>
              <span className="text-xs font-medium text-slate-700">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insight card */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 to-indigo-900 text-white relative overflow-hidden">
          <Sparkles className="absolute -right-3 -top-3 text-teal-400/20" size={90} />
          <div className="flex items-center gap-2 mb-2">
            <span className="h-7 w-7 rounded-lg bg-teal-400/20 flex items-center justify-center"><Sparkles size={16} className="text-teal-300" /></span>
            <span className="text-sm font-semibold">BrokerBot Insight</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">3 of your warm leads match new price drops in Austin. I drafted outreach texts — review & send in one tap.</p>
          <button onClick={() => go('chat')} className="mt-3 text-teal-300 text-sm font-semibold flex items-center gap-1">Open in chat <ChevronRight size={15} /></button>
        </div>
      </div>

      {/* Appointments */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">Upcoming</h2>
          <span className="text-xs text-indigo-600 font-medium">{APPOINTMENTS.length} events</span>
        </div>
        <div className="space-y-2.5">
          {APPOINTMENTS.map((a) => (
            <div key={a.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
              <span className={`h-10 w-1.5 rounded-full ${a.color === 'teal' ? 'bg-teal-400' : a.color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{a.title}</p>
                <p className="text-xs text-slate-500">{a.client} · {a.time}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colorMap[a.color]}`}>Event</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="px-5 mt-6">
        <h2 className="font-bold text-slate-800 mb-3">Today's tasks</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {tasks.map((t) => (
            <button key={t.id} onClick={() => setTasks((p) => p.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
              className="w-full flex items-center gap-3 p-3.5 text-left active:bg-slate-50">
              {t.done ? <CheckCircle2 size={20} className="text-teal-500 shrink-0" /> : <Circle size={20} className="text-slate-300 shrink-0" />}
              <span className={`text-sm ${t.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Market trend */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="h-11 w-11 rounded-xl bg-teal-50 flex items-center justify-center"><TrendingUp size={22} className="text-teal-600" /></span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Your portfolio value</p>
            <p className="text-xs text-slate-500">Across {props.length} listings</p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-slate-900">{fmtPrice(portfolio)}</p>
            <p className="text-xs text-teal-600 font-medium">+4.2% MoM</p>

          </div>
        </div>
      </div>
    </div>
  );
}
