import { Home, Bot, ScanLine, Building2, Bell } from 'lucide-react';

export type Tab = 'home' | 'chat' | 'scan' | 'listings' | 'alerts';

const items: { id: Tab; label: string; Icon: any }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'listings', label: 'Listings', Icon: Building2 },
  { id: 'scan', label: 'Scan', Icon: ScanLine },
  { id: 'chat', label: 'BrokerBot', Icon: Bot },
  { id: 'alerts', label: 'Alerts', Icon: Bell },
];

export default function BottomNav({ tab, setTab, unread }: { tab: Tab; setTab: (t: Tab) => void; unread: number }) {
  return (
    <div className="border-t border-slate-200 bg-white/95 backdrop-blur px-2 pt-1.5 pb-5 flex items-center justify-around">
      {items.map(({ id, label, Icon }) => {
        const active = tab === id;
        const isScan = id === 'scan';
        if (isScan) {
          return (
            <button key={id} onClick={() => setTab(id)} className="relative -mt-6 flex flex-col items-center">
              <span className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-600 shadow-lg shadow-teal-500/30 flex items-center justify-center text-white active:scale-90 transition-transform">
                <Icon size={26} />
              </span>
            </button>
          );
        }
        return (
          <button key={id} onClick={() => setTab(id)} className="relative flex flex-col items-center gap-0.5 px-2 py-1 active:scale-90 transition-transform">
            <Icon size={22} className={active ? 'text-indigo-600' : 'text-slate-400'} />
            <span className={`text-[10px] font-medium ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
            {id === 'alerts' && unread > 0 && (
              <span className="absolute top-0 right-0 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
