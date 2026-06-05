import { AVATARS } from '@/data/seed';
import { ChevronRight, Bell, Fingerprint, Database, Moon, Globe, Shield, LogOut, BadgeCheck, X } from 'lucide-react';

export default function Settings({ close, signOut, online, setOnline }: { close: () => void; signOut: () => void; online: boolean; setOnline: (v: boolean) => void }) {
  const rows = [
    { Icon: Bell, label: 'Push notifications', sub: 'Deadlines, AI insights, market', toggle: true, on: true },
    { Icon: Fingerprint, label: 'Biometric login', sub: 'Face ID / fingerprint', toggle: true, on: true },
    { Icon: Database, label: 'Offline sync', sub: online ? 'Synced 12m ago' : 'Will sync when online', toggle: true, on: online, action: () => setOnline(!online) },
    { Icon: Moon, label: 'Dark mode', sub: 'Match system', toggle: true, on: false },
  ];
  const links = [
    { Icon: Globe, label: 'Language & region' },
    { Icon: Shield, label: 'Privacy & security' },
    { Icon: BadgeCheck, label: 'Subscription · Pro plan' },
  ];
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="px-5 pt-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
        <button onClick={close} className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center"><X size={18} className="text-slate-600" /></button>
      </div>

      <div className="px-5 mt-4">
        <div className="bg-gradient-to-br from-indigo-600 to-teal-600 rounded-2xl p-4 flex items-center gap-3 text-white">
          <img src={AVATARS[0]} className="h-14 w-14 rounded-full object-cover border-2 border-white/40" alt="profile" />
          <div className="flex-1"><p className="font-bold text-lg leading-tight">Jordan Avery</p><p className="text-indigo-100 text-xs">jordan@brokerbot.ai</p><span className="inline-flex items-center gap-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full mt-1"><BadgeCheck size={11} /> Senior Agent · Admin</span></div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Preferences</p>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3 p-3.5">
              <span className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center"><r.Icon size={18} className="text-indigo-600" /></span>
              <div className="flex-1"><p className="text-sm font-medium text-slate-800">{r.label}</p><p className="text-[11px] text-slate-500">{r.sub}</p></div>
              <button onClick={r.action} className={`h-6 w-11 rounded-full transition-colors relative ${r.on ? 'bg-teal-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${r.on ? 'left-[1.4rem]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Account</p>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {links.map((l) => (
            <button key={l.label} className="w-full flex items-center gap-3 p-3.5 active:bg-slate-50">
              <span className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center"><l.Icon size={18} className="text-indigo-600" /></span>
              <span className="flex-1 text-left text-sm font-medium text-slate-800">{l.label}</span>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5 pb-6">
        <button onClick={signOut} className="w-full py-3.5 rounded-2xl bg-rose-50 text-rose-600 font-semibold flex items-center justify-center gap-2 active:scale-[.98] transition-transform"><LogOut size={18} /> Sign out</button>
        <p className="text-center text-[11px] text-slate-400 mt-3">BrokerBot Mobile v1.0.0 · iOS & Android</p>
      </div>
    </div>
  );
}
