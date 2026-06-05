import { useState, useEffect } from 'react';
import { listDocuments, createDocument, type DBDocument } from '@/lib/db';
import { ScanLine, FileText, CheckCircle2, AlertTriangle, Loader2, Camera, Clock } from 'lucide-react';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export default function Scanner() {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'processing' | 'result'>('idle');
  const [history, setHistory] = useState<DBDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try { setHistory(await listDocuments()); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const scan = () => {
    setPhase('scanning');
    setTimeout(() => setPhase('processing'), 1800);
    setTimeout(async () => {
      setPhase('result');
      try {
        await createDocument({
          name: 'Purchase Agreement — 1420 Vista Ridge',
          type: 'Contract', status: 'pass', property_address: '1420 Vista Ridge Dr',
          ocr_text: 'PURCHASE AGREEMENT made this day between Seller and Buyer for the property located at 1420 Vista Ridge Dr. Purchase price: $1,240,000. Earnest money: $25,000.',
        });
        await refresh();
      } catch (e) { console.error(e); }
    }, 3600);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="px-5 pt-3 pb-2"><h1 className="text-xl font-bold text-slate-800">Document Scanner</h1><p className="text-sm text-slate-500">AI text extraction & compliance checks</p></div>

      <div className="px-5">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 flex items-center justify-center">
          {phase === 'idle' && (
            <div className="text-center px-8">
              <Corners />
              <Camera size={48} className="text-slate-500 mx-auto" />
              <p className="text-slate-300 text-sm mt-3">Position the document within the frame</p>
              <p className="text-slate-500 text-xs mt-1">Auto-capture when edges detected</p>
            </div>
          )}
          {phase === 'scanning' && (
            <>
              <Corners active />
              <div className="absolute inset-x-6 h-0.5 bg-teal-400 shadow-[0_0_20px_#2dd4bf] animate-[scanline_1.6s_ease-in-out_infinite]" style={{ top: '20%' }} />
              <div className="text-center"><ScanLine size={44} className="text-teal-400 mx-auto animate-pulse" /><p className="text-teal-300 text-sm mt-2">Detecting edges…</p></div>
            </>
          )}
          {phase === 'processing' && (
            <div className="text-center"><Loader2 size={44} className="text-teal-400 mx-auto animate-spin" /><p className="text-teal-300 text-sm mt-3">Extracting text with AI…</p><p className="text-slate-500 text-xs mt-1">Running compliance check</p></div>
          )}
          {phase === 'result' && (
            <div className="text-center px-6">
              <span className="h-16 w-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto"><CheckCircle2 size={40} className="text-teal-400" /></span>
              <p className="text-white font-semibold mt-3">Scan complete & saved</p>
              <p className="text-teal-300 text-sm">98% OCR accuracy · Compliant</p>
              <div className="mt-3 text-left bg-white/10 rounded-xl p-3 text-[11px] text-slate-300 leading-relaxed">
                "PURCHASE AGREEMENT made this day between Seller and Buyer for the property located at 1420 Vista Ridge Dr. Purchase price: $1,240,000. Earnest money: $25,000…"
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-4">
        <button onClick={scan} disabled={phase === 'scanning' || phase === 'processing'}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/20 active:scale-[.98] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
          <ScanLine size={20} />{phase === 'result' ? 'Scan another' : phase === 'idle' ? 'Capture document' : 'Scanning…'}
        </button>
      </div>

      <div className="px-5 mt-6 pb-4">
        <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Clock size={16} className="text-slate-400" /> Scan history</h2>
        {loading ? (
          <div className="flex justify-center py-8 text-slate-400"><Loader2 size={22} className="animate-spin" /></div>
        ) : (
          <div className="space-y-2.5">
            {history.length === 0 && <p className="text-center text-sm text-slate-400 py-6">No scans yet.</p>}
            {history.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><FileText size={20} className="text-indigo-600" /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.type} · {timeAgo(s.created_at)}</p>
                </div>
                {s.status === 'pass'
                  ? <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-full"><CheckCircle2 size={12} /> Pass</span>
                  : <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full"><AlertTriangle size={12} /> Review</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Corners({ active }: { active?: boolean }) {
  const c = active ? 'border-teal-400' : 'border-slate-600';
  return (
    <>
      <span className={`absolute top-8 left-8 h-8 w-8 border-t-2 border-l-2 ${c} rounded-tl-lg`} />
      <span className={`absolute top-8 right-8 h-8 w-8 border-t-2 border-r-2 ${c} rounded-tr-lg`} />
      <span className={`absolute bottom-8 left-8 h-8 w-8 border-b-2 border-l-2 ${c} rounded-bl-lg`} />
      <span className={`absolute bottom-8 right-8 h-8 w-8 border-b-2 border-r-2 ${c} rounded-br-lg`} />
    </>
  );
}
