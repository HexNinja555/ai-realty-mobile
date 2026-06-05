import { supabase } from '@/lib/supabase';

export type DBProperty = {
  id: string;
  address: string;
  city: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  beds: number;
  baths: number;
  sqft: number;
  image: string | null;
  client: string | null;
  fav: boolean;
};

export type DBClient = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  notes: string | null;
  stage: string | null;
  property_count: number;
  last_touch: string | null;
};

export type DBDocument = {
  id: string;
  name: string;
  type: string;
  status: 'pass' | 'warn';
  property_address: string | null;
  ocr_text: string | null;
  created_at: string;
};

export type DBNotification = {
  id: string;
  type: 'deadline' | 'compliance' | 'market' | 'insight';
  title: string;
  body: string | null;
  time_label: string | null;
  read: boolean;
};

// ---- Properties ----
export async function listProperties() {
  const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as DBProperty[];
}
export async function createProperty(p: Partial<DBProperty>) {
  const { data, error } = await supabase.from('properties').insert(p).select().single();
  if (error) throw error;
  return data as DBProperty;
}
export async function updateProperty(id: string, patch: Partial<DBProperty>) {
  const { data, error } = await supabase.from('properties').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data as DBProperty;
}
export async function deleteProperty(id: string) {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

// ---- Clients ----
export async function listClients() {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as DBClient[];
}
export async function createClient(c: Partial<DBClient>) {
  const { data, error } = await supabase.from('clients').insert(c).select().single();
  if (error) throw error;
  return data as DBClient;
}
export async function updateClient(id: string, patch: Partial<DBClient>) {
  const { data, error } = await supabase.from('clients').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data as DBClient;
}
export async function deleteClient(id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
}

// ---- Documents ----
export async function listDocuments() {
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DBDocument[];
}
export async function createDocument(d: Partial<DBDocument>) {
  const { data, error } = await supabase.from('documents').insert(d).select().single();
  if (error) throw error;
  return data as DBDocument;
}

// ---- Notifications ----
export async function listNotifications() {
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as DBNotification[];
}
export async function markNotificationRead(id: string) {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  if (error) throw error;
}
export async function markAllNotificationsRead() {
  const { error } = await supabase.from('notifications').update({ read: true }).neq('read', true);
  if (error) throw error;
}

export function fmtPrice(n: number) {
  return '$' + Number(n).toLocaleString('en-US');
}
