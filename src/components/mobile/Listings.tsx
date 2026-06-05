import { useState, useEffect } from 'react';
import {
  listProperties, createProperty, updateProperty, deleteProperty,
  listClients, createClient, updateClient, deleteClient,
  fmtPrice, type DBProperty, type DBClient,
} from '@/lib/db';
import { PropertyForm, ClientForm } from './Forms';
import {
  Search, Heart, Bed, Bath, Maximize, MapPin, ChevronLeft, Phone, Mail, Share2,
  Plus, Users, Building2, Loader2, Pencil, Trash2,
} from 'lucide-react';

const statusColor: Record<string, string> = {
  Active: 'bg-teal-100 text-teal-700',
  Pending: 'bg-amber-100 text-amber-700',
  Sold: 'bg-slate-200 text-slate-600',
  Draft: 'bg-indigo-100 text-indigo-700',
};

export default function Listings() {
  const [view, setView] = useState<'props' | 'clients'>('props');
  const [query, setQuery] = useState('');
  const [props, setProps] = useState<DBProperty[]>([]);
  const [clients, setClients] = useState<DBClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<DBProperty | null>(null);
  const [editProp, setEditProp] = useState<DBProperty | null | undefined>(undefined);
  const [editClient, setEditClient] = useState<DBClient | null | undefined>(undefined);

  const refresh = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([listProperties(), listClients()]);
      setProps(p); setClients(c);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const toggleFav = async (p: DBProperty) => {
    setProps((arr) => arr.map((x) => x.id === p.id ? { ...x, fav: !x.fav } : x));
    try { await updateProperty(p.id, { fav: !p.fav }); } catch { refresh(); }
  };
  const saveProp = async (data: Partial<DBProperty>) => {
    if (editProp) await updateProperty(editProp.id, data); else await createProperty(data);
    await refresh();
  };
  const removeProp = async (id: string) => {
    setDetail(null);
    setProps((a) => a.filter((x) => x.id !== id));
    try { await deleteProperty(id); } catch { refresh(); }
  };
  const saveClient = async (data: Partial<DBClient>) => {
    if (editClient) await updateClient(editClient.id, data); else await createClient(data);
    await refresh();
  };
  const removeClient = async (id: string) => {
    setClients((a) => a.filter((x) => x.id !== id));
    try { await deleteClient(id); } catch { refresh(); }
  };

  if (detail) return (
    <PropertyDetail p={detail} back={() => setDetail(null)} fav={detail.fav}
      toggle={() => { toggleFav(detail); setDetail({ ...detail, fav: !detail.fav }); }}
      onEdit={() => setEditProp(detail)} onDelete={() => removeProp(detail.id)} />
  );

  const fProps = props.filter((p) => (p.address + p.city + (p.client || '')).toLowerCase().includes(query.toLowerCase()));
  const fClients = clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 relative">
      <div className="px-5 pt-3 sticky top-0 bg-slate-50 z-10 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">{view === 'props' ? 'Listings' : 'Clients'}</h1>
          <button onClick={() => view === 'props' ? setEditProp(null) : setEditClient(null)} className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center active:scale-90 transition-transform"><Plus size={20} /></button>
        </div>
        <div className="flex bg-slate-200/60 rounded-xl p-1 mt-3">
          <button onClick={() => setView('props')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'props' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}><Building2 size={15} /> Properties</button>
          <button onClick={() => setView('clients')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'clients' ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}><Users size={15} /> Clients</button>
        </div>
        <div className="relative mt-3">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${view === 'props' ? 'listings' : 'clients'}…`} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400"><Loader2 size={28} className="animate-spin" /><p className="text-sm mt-2">Loading…</p></div>
      ) : view === 'props' ? (
        <div className="px-5 mt-2 space-y-4 pb-4">
          {fProps.length === 0 && <p className="text-center text-sm text-slate-400 py-10">No listings yet. Tap + to add one.</p>}
          {fProps.map((p) => (
            <div key={p.id} onClick={() => setDetail(p)} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm active:scale-[.99] transition-transform">
              <div className="relative h-40">
                {p.image && <img src={p.image} alt={p.address} className="w-full h-full object-cover" />}
                <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(p); }} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                  <Heart size={17} className={p.fav ? 'fill-rose-500 text-rose-500' : 'text-slate-500'} />
                </button>
                <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur text-white text-base font-bold px-2.5 py-1 rounded-lg">{fmtPrice(p.price)}</div>
              </div>
              <div className="p-3.5">
                <p className="font-semibold text-slate-800">{p.address}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {p.city}</p>
                <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><Bed size={14} /> {p.beds}</span>
                  <span className="flex items-center gap-1"><Bath size={14} /> {p.baths}</span>
                  <span className="flex items-center gap-1"><Maximize size={14} /> {p.sqft.toLocaleString()} ft²</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 mt-2 space-y-2.5 pb-4">
          {fClients.length === 0 && <p className="text-center text-sm text-slate-400 py-10">No clients yet. Tap + to add one.</p>}
          {fClients.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
              {c.avatar && <img src={c.avatar} alt={c.name} className="h-12 w-12 rounded-full object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-semibold text-slate-800 truncate">{c.name}</p><span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">{c.stage}</span></div>
                <p className="text-xs text-slate-500 truncate">{c.property_count} properties · {c.last_touch}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditClient(c)} className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><Pencil size={14} /></button>
                <button onClick={() => removeClient(c.id)} className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editProp !== undefined && <PropertyForm initial={editProp} onClose={() => setEditProp(undefined)} onSave={saveProp} />}
      {editClient !== undefined && <ClientForm initial={editClient} onClose={() => setEditClient(undefined)} onSave={saveClient} />}
    </div>
  );
}

function PropertyDetail({ p, back, fav, toggle, onEdit, onDelete }: {
  p: DBProperty; back: () => void; fav: boolean; toggle: () => void; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="relative h-60">
        {p.image && <img src={p.image} alt={p.address} className="w-full h-full object-cover" />}
        <button onClick={back} className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center"><ChevronLeft size={20} /></button>
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={onEdit} className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center"><Pencil size={17} className="text-slate-600" /></button>
          <button onClick={toggle} className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center"><Heart size={18} className={fav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'} /></button>
        </div>
        <span className={`absolute bottom-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
      </div>
      <div className="px-5 -mt-6 relative">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-slate-900">{fmtPrice(p.price)}</p>
          <p className="font-medium text-slate-700 mt-1">{p.address}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={13} /> {p.city}</p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[[Bed, p.beds, 'Beds'], [Bath, p.baths, 'Baths'], [Maximize, p.sqft.toLocaleString(), 'Sq ft']].map(([Icon, v, l]: any, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 text-center"><Icon size={18} className="text-indigo-600 mx-auto" /><p className="font-bold text-slate-800 mt-1">{v}</p><p className="text-[11px] text-slate-500">{l}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 mt-4">
        <h3 className="font-bold text-slate-800 mb-2">Description</h3>
        <p className="text-sm text-slate-600 leading-relaxed">Stunning contemporary residence featuring floor-to-ceiling windows, an open-concept chef's kitchen, and expansive outdoor living. Premium finishes throughout, smart-home integration, and panoramic views.{p.client ? ` Listed for client ${p.client}.` : ''}</p>
      </div>
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <button className="py-3 rounded-2xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"><Share2 size={18} /> Share</button>
        <button className="py-3 rounded-2xl bg-teal-500 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"><Phone size={18} /> Contact</button>
      </div>
      <div className="px-5 mt-3 pb-6">
        <button onClick={onDelete} className="w-full py-3 rounded-2xl bg-rose-50 text-rose-600 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"><Trash2 size={18} /> Delete listing</button>
      </div>
    </div>
  );
}
