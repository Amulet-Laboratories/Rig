import type { ServiceItem, WebStatItem } from '@amulet-laboratories/rig'

// -- Station stats --

export const stationStats: WebStatItem[] = [
  { label: 'On Air Since', value: '2008' },
  { label: 'Broadcast Radius', value: '12 mi' },
  { label: 'Weekly Programming', value: '40+ hrs' },
  { label: 'Active Volunteers', value: '28' },
]

// -- Schedule --

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const hours = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm']

export const schedule: Record<string, string[]> = {
  Mon: [
    'Morning Jazz',
    'Community Calendar',
    'Talk of the Town',
    'Midday Mix',
    'Classical Hour',
    'Drive Time',
    'Evening News',
    'Night Sounds',
    'Late Jazz',
  ],
  Tue: [
    'Morning Jazz',
    'Garden Show',
    'Briar Cove History',
    'World Music',
    'Classical Hour',
    'Drive Time',
    'Evening News',
    'Experimental Hour',
    'Late Jazz',
  ],
  Wed: [
    'Morning Jazz',
    'Community Calendar',
    'Talk of the Town',
    'Blues Block',
    'Classical Hour',
    'Drive Time',
    'Evening News',
    'Vinyl Revival',
    'Late Jazz',
  ],
  Thu: [
    'Morning Jazz',
    'Coast Report',
    'Tech Talk',
    'Midday Mix',
    'Classical Hour',
    'Drive Time',
    'Evening News',
    'Storytellers',
    'Late Jazz',
  ],
  Fri: [
    'Morning Jazz',
    'Community Calendar',
    'Talk of the Town',
    'Folk Friday',
    'Classical Hour',
    'Drive Time',
    'Evening News',
    'All Request',
    'Late Jazz',
  ],
  Sat: [
    'Saturday Morning',
    'Kids Radio',
    'Weekend Mix',
    'Weekend Mix',
    'Local Bands',
    'Local Bands',
    'Saturday Night Live',
    'Saturday Night Live',
    'Ambient',
  ],
  Sun: [
    'Sunday Morning',
    'Chapel Hour',
    'Sunday Brunch Mix',
    'Sunday Brunch Mix',
    'Spoken Word',
    'Coast Stories',
    'Evening Classics',
    'Evening Classics',
    'Sign Off',
  ],
}

export function showAt(day: string, index: number): string {
  return schedule[day]?.[index] ?? '\u2014'
}

// -- Shows --

export interface Show extends ServiceItem {
  host: string
  icon: string
  schedule: string
}

export const shows: Show[] = [
  {
    id: 'talk-of-the-town',
    title: 'Talk of the Town',
    host: 'Phoebe Strand',
    schedule: 'Mon/Wed/Fri 10am',
    description:
      'Local news, interviews, community voices. The show that keeps Briar Cove connected. Featured guests have included Mayor Patricia Kern and Aldric & Pace attorneys.',
    icon: 'heroicons:microphone',
  },
  {
    id: 'morning-jazz',
    title: 'Morning Jazz',
    host: 'Ray Castellano',
    schedule: 'Mon–Sat 6am',
    description:
      'Wakes up Briar Cove six mornings a week. Standards, bebop, and West Coast cool. Ray has been on air since the station signed on in 2008.',
    icon: 'heroicons:musical-note',
  },
  {
    id: 'night-sounds',
    title: 'Night Sounds',
    host: 'Marcus Eliot',
    schedule: 'Mon 8pm',
    description:
      "Ambient, experimental, and new music. The show for people who are still awake at 10pm. Marcus broadcasts from the station's rooftop studio overlooking the harbor.",
    icon: 'heroicons:speaker-wave',
  },
  {
    id: 'vinyl-revival',
    title: 'Vinyl Revival',
    host: 'Tomoko Sakai',
    schedule: 'Wed 8pm',
    description:
      'Deep cuts and forgotten albums. Vinyl-only, played on station turntables. Tomoko also curates the record section at Salt & Signal Co.',
    icon: 'heroicons:musical-note',
  },
  {
    id: 'coast-stories',
    title: 'Coast Stories',
    host: 'Helen Park',
    schedule: 'Sun 4pm',
    description:
      "Oral histories and narratives from the Oregon coast. Produced in partnership with the Briar Cove Historical Society and the Public Library's archive.",
    icon: 'heroicons:book-open',
  },
  {
    id: 'briar-cove-history',
    title: 'Briar Cove History',
    host: 'Dr. Len Oshiro',
    schedule: 'Alternate Tuesdays 10am',
    description:
      'Deep dives into local history — the WPA library, the old cannery, shipwrecks off Cedar Point. Airs alternate Tuesdays.',
    icon: 'heroicons:book-open',
  },
  {
    id: 'kids-radio',
    title: 'Kids Radio',
    host: 'Nadia Cuevas',
    schedule: 'Sat 8am',
    description:
      'Saturday morning programming for ages 4–10. Stories, silly songs, and a rotating cast of young co-hosts from Briar Cove Elementary.',
    icon: 'heroicons:sparkles',
  },
  {
    id: 'experimental-hour',
    title: 'Experimental Hour',
    host: 'Juno Kade',
    schedule: 'Tue 8pm',
    description:
      "Noise, drone, field recordings, sound collage. Not for everyone. Juno also created sound installations for Maren Lys's gallery exhibitions.",
    icon: 'heroicons:speaker-wave',
  },
]

// -- Community events --

export interface CommunityEvent extends ServiceItem {
  date: string
}

export const communityEvents: CommunityEvent[] = [
  {
    id: 'live-remote',
    title: 'Live Remote at Undertow Brewing',
    date: 'Apr 28',
    description: 'Phoebe Strand broadcasts Talk of the Town live from the taproom. Free entry.',
  },
  {
    id: 'spring-pledge',
    title: 'Spring Pledge Drive',
    date: 'May 5–11',
    description: 'Our annual fundraiser. Goal: $12,000 to replace aging transmitter equipment.',
  },
  {
    id: 'record-swap',
    title: 'Record Swap at the Library',
    date: 'May 12',
    description:
      'Bring your vinyl, trade with neighbors. Co-hosted with Briar Cove Public Library.',
  },
  {
    id: 'open-mic',
    title: 'Open Mic Night',
    date: 'May 19',
    description: 'Musicians and storytellers take the mic at Lantern House Inn. Simulcast on 91.7.',
  },
  {
    id: 'summer-solstice',
    title: 'Summer Solstice Broadcast',
    date: 'Jun 21',
    description:
      'Twelve hours of live music from Cedar Point Park. Bring a blanket. Food trucks from noon.',
  },
  {
    id: 'harbor-fest',
    title: 'Harbor Festival Live Coverage',
    date: 'Jul 4',
    description:
      'All-day coverage from the Briar Cove Harbor Festival. Parade commentary, live interviews, fireworks simulcast.',
  },
]

// -- Volunteer roles --

export interface VolunteerRole extends ServiceItem {
  icon: string
  commitment: string
}

export const volunteerRoles: VolunteerRole[] = [
  {
    id: 'on-air',
    title: 'On-Air Hosts',
    description:
      'Pitch a show idea. We provide training, equipment, and a timeslot. Minimum six-month commitment.',
    icon: 'heroicons:microphone',
    commitment: '4–6 hrs/week',
  },
  {
    id: 'event-support',
    title: 'Event Support',
    description:
      'Help with live broadcasts, pledge drives, and community events. Flexible scheduling.',
    icon: 'heroicons:megaphone',
    commitment: '2–4 hrs/event',
  },
  {
    id: 'tech-web',
    title: 'Tech & Web',
    description:
      'Audio engineering, streaming infrastructure, website updates. Skills welcome, training available.',
    icon: 'heroicons:wrench-screwdriver',
    commitment: '2–4 hrs/week',
  },
  {
    id: 'fundraising',
    title: 'Fundraising & Outreach',
    description:
      'Grant writing, donor relations, community partnerships. Help keep the lights on and the transmitter humming.',
    icon: 'heroicons:heart',
    commitment: '3–5 hrs/week',
  },
  {
    id: 'music-library',
    title: 'Music Library',
    description:
      'Catalog donations, organize the vinyl collection, digitize legacy recordings. Perfect for music lovers.',
    icon: 'heroicons:musical-note',
    commitment: '2–3 hrs/week',
  },
]

// -- Station history timeline --

export interface TimelineEntry {
  year: string
  event: string
}

export const timeline: TimelineEntry[] = [
  {
    year: '2008',
    event: 'KBCV signs on from a converted garage on Lighthouse Road with a 10-watt transmitter',
  },
  {
    year: '2010',
    event: 'FCC grants power increase to 100 watts; moves to current studio at 88 Lighthouse Road',
  },
  {
    year: '2012',
    event: 'Launches Talk of the Town with Phoebe Strand; listenership doubles in six months',
  },
  {
    year: '2014',
    event: 'First Spring Pledge Drive raises $8,400; hires first paid station manager',
  },
  {
    year: '2016',
    event: 'Power increase to 300 watts; broadcast reaches from Bandon to Gold Beach',
  },
  { year: '2018', event: 'Celebrates 10 years with a live concert at Cedar Point Park' },
  { year: '2019', event: 'Wins Grassroots Radio Coalition "Station of the Year" award' },
  {
    year: '2022',
    event: 'Launches streaming; listenership extends beyond the 12-mile broadcast radius',
  },
  {
    year: '2024',
    event: 'Completes studio renovation with new board, mics, and acoustic treatment',
  },
]

// -- Contact fields --

export const contactFields = [
  { name: 'name', label: 'Name', type: 'text' as const, required: true, autocomplete: 'name' },
  { name: 'email', label: 'Email', type: 'email' as const, required: true, autocomplete: 'email' },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea' as const,
    required: true,
    placeholder: 'How can we help?',
    rows: 4,
  },
]
