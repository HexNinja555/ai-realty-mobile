export const PROPERTY_IMAGES = [
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691212923_bd963b16.png',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691214796_def0c28a.png',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691222994_90f1df92.png',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691203371_91e34209.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691204661_5c5bcfb5.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691205897_b79e1a69.jpg',
];

export const AVATARS = [
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691245517_e30955eb.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691258640_7ac2af34.png',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691245587_22e0ed6d.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691254306_c6fa98f3.png',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691250049_5e115829.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a233086096c5fe80e1da3e0_1780691249371_36d9c857.jpg',
];

export type Property = {
  id: string;
  address: string;
  city: string;
  price: number;
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  client: string;
  fav: boolean;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  notes: string;
  stage: string;
  properties: number;
  lastTouch: string;
};

export type AppNotification = {
  id: string;
  type: 'deadline' | 'compliance' | 'market' | 'insight';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const cities = ['Beverly Hills, CA', 'Austin, TX', 'Miami, FL', 'Seattle, WA', 'Denver, CO', 'Boston, MA'];
const statuses: Property['status'][] = ['Active', 'Pending', 'Active', 'Sold', 'Active', 'Draft'];
const streets = [
  '1420 Vista Ridge Dr', '88 Lakeshore Blvd', '305 Palmview Terrace', '777 Maple Crest Ln',
  '24 Summit Park Ave', '910 Harbor Point', '512 Oakwood Heights', '63 Crescent Bay',
  '1190 Highland Mews', '47 Willow Creek Rd', '328 Skyline Court', '15 Bayfront Plaza',
  '604 Sterling Way', '219 Aspen Grove', '850 Marina Vista', '72 Birchwood Trail',
];

export const PROPERTIES: Property[] = streets.map((s, i) => ({
  id: 'p' + (i + 1),
  address: s,
  city: cities[i % cities.length],
  price: 480000 + (i * 137000) % 3200000 + 250000,
  status: statuses[i % statuses.length],
  beds: 2 + (i % 5),
  baths: 1 + (i % 4),
  sqft: 1100 + (i * 280) % 4200,
  image: PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
  client: ['Sarah Chen', 'Marcus Reed', 'Elena Rossi', 'David Park', 'Aisha Khan', 'Tom Walsh'][i % 6],
  fav: i % 4 === 0,
}));

const names = ['Sarah Chen', 'Marcus Reed', 'Elena Rossi', 'David Park', 'Aisha Khan', 'Tom Walsh',
  'Priya Nair', 'James Okafor', 'Lena Müller', 'Carlos Vega', 'Mei Tan', 'Robert Frost'];
const stages = ['Hot Lead', 'Touring', 'Negotiating', 'Closing', 'Nurture', 'Past Client'];

export const CLIENTS: Client[] = names.map((n, i) => ({
  id: 'c' + (i + 1),
  name: n,
  email: n.toLowerCase().replace(' ', '.') + '@email.com',
  phone: `(${200 + i}) 555-0${100 + i}`,
  avatar: AVATARS[i % AVATARS.length],
  notes: 'Prefers modern homes with open floor plans. Pre-approved up to $1.2M. Looking to close within 60 days.',
  stage: stages[i % stages.length],
  properties: 1 + (i % 4),
  lastTouch: ['2h ago', 'Yesterday', '3 days ago', '1 week ago'][i % 4],
}));

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'deadline', title: 'Closing deadline approaching', body: '1420 Vista Ridge Dr closes in 2 days. 3 documents pending signature.', time: '12m ago', read: false },
  { id: 'n2', type: 'insight', title: 'AI Insight: Price adjustment', body: 'BrokerBot suggests reducing 88 Lakeshore Blvd by 3% based on 14 comparable sales.', time: '45m ago', read: false },
  { id: 'n3', type: 'compliance', title: 'Compliance reminder', body: 'Disclosure form for 305 Palmview Terrace expires tomorrow.', time: '2h ago', read: false },
  { id: 'n4', type: 'market', title: 'Market update: Austin, TX', body: 'Median list price up 4.2% MoM. Inventory down 8%. Strong seller momentum.', time: '5h ago', read: true },
  { id: 'n5', type: 'insight', title: 'New buyer match', body: 'Elena Rossi matches 3 of your active listings with 92% confidence.', time: 'Yesterday', read: true },
  { id: 'n6', type: 'deadline', title: 'Showing reminder', body: 'Open house at 777 Maple Crest Ln tomorrow at 1:00 PM.', time: 'Yesterday', read: true },
  { id: 'n7', type: 'market', title: 'Rate alert', body: '30-yr fixed dropped to 6.1%. Great time to re-engage warm leads.', time: '2 days ago', read: true },
  { id: 'n8', type: 'compliance', title: 'Document verified', body: 'Purchase agreement for 24 Summit Park Ave passed AI compliance check.', time: '2 days ago', read: true },
];

export const KB_ARTICLES = [
  { id: 'k1', cat: 'Compliance', title: 'Fair Housing Act Quick Reference', summary: 'Protected classes, advertising do/don\'ts, and recordkeeping requirements every agent must know.', read: '4 min' },
  { id: 'k2', cat: 'Scripts', title: 'Listing Presentation Script', summary: 'Proven talk track to win the listing, handle objections, and set realistic price expectations.', read: '7 min' },
  { id: 'k3', cat: 'Contracts', title: 'Understanding Contingencies', summary: 'Inspection, financing, and appraisal contingencies explained with negotiation tips.', read: '6 min' },
  { id: 'k4', cat: 'Marketing', title: 'High-Converting Listing Copy', summary: 'Templates and AI prompts that turn features into emotional, scannable descriptions.', read: '5 min' },
  { id: 'k5', cat: 'Finance', title: 'Mortgage Basics for Agents', summary: 'Loan types, DTI ratios, and how to guide buyers toward pre-approval confidently.', read: '8 min' },
  { id: 'k6', cat: 'Scripts', title: 'Cold Lead Re-Engagement', summary: 'Texts and emails to revive dormant leads when rates or inventory shift.', read: '3 min' },
  { id: 'k7', cat: 'Compliance', title: 'Disclosure Checklist', summary: 'State-by-state disclosure essentials and how to avoid common liability traps.', read: '5 min' },
  { id: 'k8', cat: 'Marketing', title: 'Open House Playbook', summary: 'Pre, during, and post open-house tactics to capture and convert visitors.', read: '6 min' },
];

export const APPOINTMENTS = [
  { id: 'a1', title: 'Showing — 305 Palmview Terrace', client: 'Elena Rossi', time: 'Today · 2:00 PM', color: 'teal' },
  { id: 'a2', title: 'Listing consult — 47 Willow Creek', client: 'Tom Walsh', time: 'Today · 4:30 PM', color: 'indigo' },
  { id: 'a3', title: 'Closing — 24 Summit Park Ave', client: 'David Park', time: 'Tomorrow · 10:00 AM', color: 'amber' },
  { id: 'a4', title: 'Open house — 777 Maple Crest', client: 'Walk-ins', time: 'Sat · 1:00 PM', color: 'teal' },
];

export const TASKS = [
  { id: 't1', label: 'Send disclosure to David Park', done: true },
  { id: 't2', label: 'Follow up with Aisha Khan', done: false },
  { id: 't3', label: 'Upload photos for 850 Marina Vista', done: false },
  { id: 't4', label: 'Review offer on 88 Lakeshore', done: true },
  { id: 't5', label: 'Schedule inspection — Vista Ridge', done: false },
];

export function fmtPrice(n: number) {
  return '$' + n.toLocaleString('en-US');
}
