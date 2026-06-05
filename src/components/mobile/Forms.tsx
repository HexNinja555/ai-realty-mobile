import React, { useState } from 'react';

import { X, Loader2 } from 'lucide-react';
import { type DBProperty, type DBClient } from '@/lib/db';
import { PROPERTY_IMAGES, AVATARS } from '@/data/seed';

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl max-h-[88%] overflow-y-auto animate-[slideup_.25s_ease]">
        <div className="sticky top-0 bg-white px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={17} className="text-slate-600" /></button>
        </div>
        <div className="p-5 pb-8 space-y-3">{children}</div>
      </div>
    </div>
  );
}

const inputCls = 'w-full bg-slate-100 rounded-xl px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200';
const STATUSES: DBProperty['status'][] = ['Active', 'Pending', 'Sold', 'Draft'];
const STAGES = ['Hot Lead', 'Touring', 'Negotiating', 'Closing', 'Nurture', 'Past Client'];

export function PropertyForm({ initial, onClose, onSave }: { initial?: DBProperty | null; onClose: () => void; onSave: (p: Partial<DBProperty>) => Promise<void> }) {
  const [f, setF] = useState<Partial<DBProperty>>(initial || {
    address: '', city: '', price: 500000, status: 'Active', beds: 3, baths: 2, sqft: 1800,
    image: PROPERTY_IMAGES[Math.floor(Math.random() * PROPERTY_IMAGES.length)], client: '', fav: false,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof DBProperty, v: any) => setF((p) => ({ ...p, [k]: v }));
  const submit = async () => {
    if (!f.address?.trim()) return;
    setSaving(true);
    try { await onSave(f); onClose(); } finally { setSaving(false); }
  };
  return (
    <Sheet title={initial ? 'Edit listing' : 'New listing'} onClose={onClose}>
      <input className={inputCls} placeholder="Address" value={f.address || ''} onChange={(e) => set('address', e.target.value)} />
      <input className={inputCls} placeholder="City, State" value={f.city || ''} onChange={(e) => set('city', e.target.value)} />
      <input className={inputCls} placeholder="Client name" value={f.client || ''} onChange={(e) => set('client', e.target.value)} />
      <input className={inputCls} type="number" placeholder="Price" value={f.price ?? ''} onChange={(e) => set('price', Number(e.target.value))} />
      <div className="grid grid-cols-3 gap-2">
        <input className={inputCls} type="number" placeholder="Beds" value={f.beds ?? ''} onChange={(e) => set('beds', Number(e.target.value))} />
        <input className={inputCls} type="number" placeholder="Baths" value={f.baths ?? ''} onChange={(e) => set('baths', Number(e.target.value))} />
        <input className={inputCls} type="number" placeholder="Sq ft" value={f.sqft ?? ''} onChange={(e) => set('sqft', Number(e.target.value))} />
      </div>
      <div className="flex gap-2">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => set('status', s)} className={`flex-1 py-2 rounded-lg text-xs font-medium ${f.status === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{s}</button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pt-1">
        {PROPERTY_IMAGES.map((img) => (
          <button key={img} onClick={() => set('image', img)} className={`shrink-0 h-14 w-20 rounded-lg overflow-hidden border-2 ${f.image === img ? 'border-indigo-600' : 'border-transparent'}`}>
            <img src={img} className="h-full w-full object-cover" alt="opt" />
          </button>
        ))}
      </div>
      <button onClick={submit} disabled={saving} className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-[.98] transition-transform disabled:opacity-60">
        {saving && <Loader2 size={18} className="animate-spin" />}{initial ? 'Save changes' : 'Create listing'}
      </button>
    </Sheet>
  );
}

export function ClientForm({ initial, onClose, onSave }: { initial?: DBClient | null; onClose: () => void; onSave: (c: Partial<DBClient>) => Promise<void> }) {
  const [f, setF] = useState<Partial<DBClient>>(initial || {
    name: '', email: '', phone: '', stage: 'Hot Lead', property_count: 1, last_touch: 'Just now',
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)], notes: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof DBClient, v: any) => setF((p) => ({ ...p, [k]: v }));
  const submit = async () => {
    if (!f.name?.trim()) return;
    setSaving(true);
    try { await onSave(f); onClose(); } finally { setSaving(false); }
  };
  return (
    <Sheet title={initial ? 'Edit client' : 'New client'} onClose={onClose}>
      <input className={inputCls} placeholder="Full name" value={f.name || ''} onChange={(e) => set('name', e.target.value)} />
      <input className={inputCls} placeholder="Email" value={f.email || ''} onChange={(e) => set('email', e.target.value)} />
      <input className={inputCls} placeholder="Phone" value={f.phone || ''} onChange={(e) => set('phone', e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button key={s} onClick={() => set('stage', s)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${f.stage === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{s}</button>
        ))}
      </div>
      <textarea className={inputCls + ' resize-none'} rows={3} placeholder="Notes" value={f.notes || ''} onChange={(e) => set('notes', e.target.value)} />
      <button onClick={submit} disabled={saving} className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-[.98] transition-transform disabled:opacity-60">
        {saving && <Loader2 size={18} className="animate-spin" />}{initial ? 'Save changes' : 'Create client'}
      </button>
    </Sheet>
  );
}
