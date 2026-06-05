import { useState } from 'react';
import { Bot, Fingerprint, Mail, Lock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function Login({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('jordan@brokerbot.ai');
  const [pwd, setPwd] = useState('demo1234');
  const [show2fa, setShow2fa] = useState(false);
  const [code, setCode] = useState('');

  const submit = async () => {
    // collect lead via CRM
    try {
      await fetch('https://famous.ai/api/crm/6a233086096c5fe80e1da3e0/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'app-' + mode, tags: ['brokerbot-mobile', mode] }),
      });
    } catch {}
    if (mode === 'signup') { onAuth(); return; }
    setShow2fa(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 px-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center text-white shadow-lg"><Bot size={26} /></span>
          <div><h1 className="text-white text-2xl font-bold leading-tight">BrokerBot</h1><p className="text-teal-300 text-xs font-medium">AI teammates for agents</p></div>
        </div>
        <p className="text-indigo-200 text-sm mb-8 flex items-center gap-1.5"><Sparkles size={14} /> {mode === 'login' ? 'Welcome back. Let\'s close deals.' : 'Create your agent account.'}</p>

        {!show2fa ? (
          <div className="space-y-3">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-white/10 border border-white/15 rounded-2xl pl-10 pr-3 py-3.5 text-white placeholder-indigo-300 text-sm outline-none focus:border-teal-400" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" />
              <input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" placeholder="Password" className="w-full bg-white/10 border border-white/15 rounded-2xl pl-10 pr-3 py-3.5 text-white placeholder-indigo-300 text-sm outline-none focus:border-teal-400" />
            </div>
            <button onClick={submit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-teal-500 text-slate-900 font-bold flex items-center justify-center gap-2 active:scale-[.98] transition-transform shadow-lg shadow-teal-500/20">
              {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={18} />
            </button>
            <button onClick={onAuth} className="w-full py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold flex items-center justify-center gap-2 active:scale-[.98] transition-transform">
              <Fingerprint size={20} className="text-teal-300" /> Sign in with Face ID
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-300 text-sm"><ShieldCheck size={18} /> Two-factor authentication</div>
            <p className="text-indigo-200 text-xs">We sent a 6-digit code to your device. Enter it below.</p>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="• • • • • •" maxLength={6} className="w-full text-center tracking-[0.5em] bg-white/10 border border-white/15 rounded-2xl py-3.5 text-white text-lg outline-none focus:border-teal-400" />
            <button onClick={onAuth} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-teal-500 text-slate-900 font-bold active:scale-[.98] transition-transform">Verify & continue</button>
            <button onClick={onAuth} className="w-full text-indigo-300 text-xs">Skip for demo</button>
          </div>
        )}
      </div>

      <div className="pb-8 text-center">
        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setShow2fa(false); }} className="text-indigo-200 text-sm">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span className="text-teal-300 font-semibold">{mode === 'login' ? 'Sign up' : 'Sign in'}</span>
        </button>
      </div>
    </div>
  );
}
