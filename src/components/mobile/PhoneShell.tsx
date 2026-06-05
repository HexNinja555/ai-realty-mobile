import React from 'react';
import { Wifi, Signal, BatteryFull } from 'lucide-react';

export default function PhoneShell({ children, device, setDevice }: {
  children: React.ReactNode;
  device: 'ios' | 'android';
  setDevice: (d: 'ios' | 'android') => void;
}) {
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 gap-6">
      {/* Marketing header (desktop) */}
      <div className="text-center max-w-md">
        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">BrokerBot <span className="text-teal-400">Mobile</span></h1>
        <p className="text-slate-400 text-sm mt-1">AI teammates for real estate agents — iOS & Android</p>
      </div>

      {/* Device toggle */}
      <div className="flex items-center gap-1 bg-white/10 backdrop-blur rounded-full p-1 border border-white/10">
        {(['ios', 'android'] as const).map((d) => (
          <button key={d} onClick={() => setDevice(d)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${device === d ? 'bg-teal-400 text-slate-900' : 'text-slate-300 hover:text-white'}`}>
            {d === 'ios' ? 'iPhone' : 'Android'}
          </button>
        ))}
      </div>

      {/* Phone frame */}
      <div className={`relative bg-slate-950 shadow-2xl shadow-black/50 ${device === 'ios' ? 'rounded-[3rem] p-3 border-[6px] border-slate-800' : 'rounded-[2rem] p-2 border-[5px] border-slate-700'}`}
        style={{ width: 390, maxWidth: '94vw' }}>
        <div className={`relative overflow-hidden bg-slate-50 ${device === 'ios' ? 'rounded-[2.3rem]' : 'rounded-[1.5rem]'}`}
          style={{ height: 'min(820px, 82vh)' }}>
          {/* Status bar */}
          <div className="absolute top-0 inset-x-0 z-50 h-11 flex items-center justify-between px-6 text-slate-900 text-xs font-semibold pointer-events-none">
            <span>{time}</span>
            {device === 'ios' && <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-6 w-28 bg-slate-950 rounded-full" />}
            <div className="flex items-center gap-1.5">
              <Signal size={14} /><Wifi size={14} /><BatteryFull size={16} />
            </div>
          </div>
          {/* Screen content */}
          <div className="h-full pt-11 flex flex-col">{children}</div>
        </div>
      </div>
      <p className="text-slate-500 text-xs">Interactive prototype · Swift/SwiftUI & Kotlin/Compose reference build</p>
    </div>
  );
}
