import { useState, useEffect } from 'react';
import PhoneShell from './mobile/PhoneShell';
import BottomNav, { type Tab } from './mobile/BottomNav';
import Login from './mobile/Login';
import Dashboard from './mobile/Dashboard';
import AIChat from './mobile/AIChat';
import Scanner from './mobile/Scanner';
import Listings from './mobile/Listings';
import Alerts from './mobile/Alerts';
import Settings from './mobile/Settings';
import { listNotifications, markNotificationRead, markAllNotificationsRead, type DBNotification } from '@/lib/db';
import { Settings as Gear } from 'lucide-react';

export default function AppLayout() {
  const [device, setDevice] = useState<'ios' | 'android'>('ios');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [online, setOnline] = useState(true);
  const [notifs, setNotifs] = useState<DBNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (!authed) return;
    setNotifLoading(true);
    listNotifications().then(setNotifs).catch(console.error).finally(() => setNotifLoading(false));
  }, [authed]);

  const onRead = async (id: string) => {
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
    try { await markNotificationRead(id); } catch (e) { console.error(e); }
  };
  const onReadAll = async () => {
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    try { await markAllNotificationsRead(); } catch (e) { console.error(e); }
  };

  return (
    <PhoneShell device={device} setDevice={setDevice}>
      {!authed ? (
        <Login onAuth={() => setAuthed(true)} />
      ) : showSettings ? (
        <Settings close={() => setShowSettings(false)} signOut={() => { setShowSettings(false); setAuthed(false); }} online={online} setOnline={setOnline} />
      ) : (
        <div className="flex-1 flex flex-col min-h-0 relative">
          {tab === 'home' && (
            <button onClick={() => setShowSettings(true)} className="absolute top-2 right-4 z-20 h-9 w-9 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center">
              <Gear size={18} />
            </button>
          )}
          <div className="flex-1 flex flex-col min-h-0">
            {tab === 'home' && <Dashboard go={setTab} online={online} setOnline={setOnline} />}
            {tab === 'chat' && <AIChat />}
            {tab === 'scan' && <Scanner />}
            {tab === 'listings' && <Listings />}
            {tab === 'alerts' && <Alerts items={notifs} loading={notifLoading} onRead={onRead} onReadAll={onReadAll} />}
          </div>
          <BottomNav tab={tab} setTab={setTab} unread={unread} />
        </div>
      )}
    </PhoneShell>
  );
}
