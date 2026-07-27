import type { WebStatItem, ServiceItem } from '@amulet-laboratories/rig'

export const cityStats: WebStatItem[] = [
  { value: '8,400', label: 'Population' },
  { value: '1887', label: 'Established' },
  { value: '6', label: 'Departments' },
  { value: '12 mi²', label: 'City Area' },
]

export interface CityService extends ServiceItem {
  icon: 'banknote' | 'building' | 'flag' | 'calendar' | 'briefcase' | 'tree' | 'check' | 'phone'
}

export const quickServices: CityService[] = [
  {
    id: 'pay-utility',
    title: 'Pay Utility Bill',
    description: 'Pay water, sewer, and electric bills online.',
    icon: 'banknote',
  },
  {
    id: 'building-permits',
    title: 'Building Permits',
    description: 'Apply for residential and commercial building permits.',
    icon: 'building',
  },
  {
    id: 'report-issue',
    title: 'Report an Issue',
    description: 'Report potholes, streetlights, or other non-emergency problems.',
    icon: 'flag',
  },
  {
    id: 'meeting-agendas',
    title: 'Meeting Agendas',
    description: 'View upcoming council and committee meeting agendas.',
    icon: 'calendar',
  },
  {
    id: 'job-openings',
    title: 'Job Openings',
    description: 'Current employment opportunities with the City of Briar Cove.',
    icon: 'briefcase',
  },
  {
    id: 'parks-trails',
    title: 'Parks & Trails',
    description: 'Trail maps, park reservations, and recreation programs.',
    icon: 'tree',
  },
  {
    id: 'voter-registration',
    title: 'Voter Registration',
    description: 'Register to vote or update your existing registration.',
    icon: 'check',
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    description: 'City Hall hours, phone directory, and department contacts.',
    icon: 'phone',
  },
]

export interface Department {
  id: string
  title: string
  description: string
  director: string
  phone: string
  email: string
  responsibilities: string[]
}

export const departments: Department[] = [
  {
    id: 'public-works',
    title: 'Public Works',
    description:
      'Maintains and improves city infrastructure including roads, water systems, sewer lines, and stormwater management. Oversees capital improvement projects and coordinates with state DOT on Highway 101 maintenance.',
    director: 'Mike Tanaka',
    phone: '(541) 555-0102',
    email: 'publicworks@briarcove.gov',
    responsibilities: [
      'Road maintenance & paving',
      'Water treatment & distribution',
      'Sewer operations',
      'Stormwater management',
      'Capital improvement projects',
    ],
  },
  {
    id: 'planning-zoning',
    title: 'Planning & Zoning',
    description:
      'Manages land use planning, building permits, code compliance, and long-range development strategy. Administers the Comprehensive Plan and zoning ordinance. Reviews all new construction and land division applications.',
    director: 'Sarah Moreno',
    phone: '(541) 555-0103',
    email: 'planning@briarcove.gov',
    responsibilities: [
      'Building permits & inspections',
      'Land use applications',
      'Code compliance',
      'Comprehensive Plan',
      'Historic preservation',
    ],
  },
  {
    id: 'parks-recreation',
    title: 'Parks & Recreation',
    description:
      'Manages 8 city parks, 14 miles of trails, the Community Center, and youth programs. Coordinates seasonal events including the Summer Concert Series and the Old Harbor Farmers Market partnership.',
    director: 'Elena Voss',
    phone: '(541) 555-0104',
    email: 'parks@briarcove.gov',
    responsibilities: [
      'Park maintenance',
      'Trail system',
      'Community Center',
      'Youth programs',
      'Seasonal events',
    ],
  },
  {
    id: 'police-department',
    title: 'Police Department',
    description:
      'Provides 24/7 law enforcement, emergency response, and community outreach for the City of Briar Cove. Staffed by 12 sworn officers and 4 civilian employees. Operates a School Resource Officer program.',
    director: 'Chief Angela Torres',
    phone: '(541) 555-0105',
    email: 'police@briarcove.gov',
    responsibilities: [
      'Patrol & emergency response',
      'Investigations',
      'Community outreach',
      'School Resource Officer',
      'Animal control',
    ],
  },
  {
    id: 'fire-rescue',
    title: 'Fire & Rescue',
    description:
      'Fire prevention, emergency medical services, and hazard mitigation from two stations covering the full city limits and mutual aid area. 18 career firefighters supplemented by 12 trained volunteers.',
    director: 'Chief Dan Reeves',
    phone: '(541) 555-0106',
    email: 'fire@briarcove.gov',
    responsibilities: [
      'Fire suppression',
      'EMS & ambulance',
      'Fire prevention & inspections',
      'Hazard mitigation',
      'Community education',
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    description:
      'Manages the city budget ($14.2M annual), utility billing, business licenses, accounts payable/receivable, and financial reporting. Prepares the annual budget document and coordinates the independent audit.',
    director: 'Grace Liu',
    phone: '(541) 555-0107',
    email: 'finance@briarcove.gov',
    responsibilities: [
      'Budget preparation',
      'Utility billing',
      'Business licenses',
      'Financial reporting',
      'Payroll & benefits',
    ],
  },
]

export interface Official {
  id: string
  name: string
  role: string
  term: string
  bio: string
  img: string
  committees: string[]
  email: string
}

export const officials: Official[] = [
  {
    id: 'patricia-kern',
    name: 'Mayor Patricia Kern',
    role: 'Mayor',
    term: '2024–2028',
    bio: 'Lifelong Briar Cove resident and former chair of the Coastal Economic Development Board. Focused on infrastructure modernization and sustainable tourism.',
    img: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80',
    committees: ['Ex-officio, all committees'],
    email: 'mayor@briarcove.gov',
  },
  {
    id: 'david-okafor',
    name: 'David Okafor',
    role: 'Council President',
    term: '2023–2027',
    bio: 'Owner of Briar Cove Hardware and 12-year council veteran. Leads the Budget & Finance Committee.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    committees: ['Budget & Finance (Chair)', 'Harbor & Maritime Affairs'],
    email: 'dokafor@briarcove.gov',
  },
  {
    id: 'linda-reese',
    name: 'Linda Reese',
    role: 'Council Member — Ward 1',
    term: '2024–2028',
    bio: 'Former school board president representing the Salal Creek and Ridgeline neighborhoods. Parks & Recreation Committee chair.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    committees: ['Parks & Recreation (Chair)', 'Public Safety'],
    email: 'lreese@briarcove.gov',
  },
  {
    id: 'james-whitfield',
    name: 'James Whitfield',
    role: 'Council Member — Ward 2',
    term: '2023–2027',
    bio: 'Fourth-generation fisherman and Old Harbor advocate. Chairs the Harbor & Maritime Affairs Committee.',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    committees: ['Harbor & Maritime Affairs (Chair)', 'Budget & Finance'],
    email: 'jwhitfield@briarcove.gov',
  },
  {
    id: 'rosa-delgado',
    name: 'Rosa Delgado',
    role: 'Council Member — Ward 3',
    term: '2024–2028',
    bio: 'Environmental scientist and co-founder of the Briar Cove Land Trust. Leads the Coastal Resilience & Climate Committee.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    committees: ['Coastal Resilience & Climate (Chair)', 'Planning'],
    email: 'rdelgado@briarcove.gov',
  },
  {
    id: 'tom-halvorsen',
    name: 'Tom Halvorsen',
    role: 'City Manager',
    term: 'Appointed 2021',
    bio: 'Former assistant city manager in Astoria. Oversees day-to-day operations, the annual budget process, and interdepartmental coordination.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    committees: ['Staff liaison, all committees'],
    email: 'thalvorsen@briarcove.gov',
  },
]

export interface Meeting {
  body: string
  date: string
  time: string
  location: string
  agendaAvailable: boolean
}

export const upcomingMeetings: Meeting[] = [
  {
    body: 'City Council — Regular Session',
    date: 'Apr 8, 2026',
    time: '7:00 PM',
    location: 'Council Chambers, City Hall',
    agendaAvailable: true,
  },
  {
    body: 'Planning Commission',
    date: 'Apr 12, 2026',
    time: '6:00 PM',
    location: 'Council Chambers, City Hall',
    agendaAvailable: true,
  },
  {
    body: 'Parks & Recreation Board',
    date: 'Apr 15, 2026',
    time: '5:30 PM',
    location: 'Community Center, Room B',
    agendaAvailable: false,
  },
  {
    body: 'Budget & Finance Committee',
    date: 'Apr 22, 2026',
    time: '6:00 PM',
    location: 'Council Chambers, City Hall',
    agendaAvailable: false,
  },
  {
    body: 'Coastal Resilience Committee',
    date: 'Apr 29, 2026',
    time: '4:00 PM',
    location: 'Community Center, Room A',
    agendaAvailable: false,
  },
]

export interface PastMeeting {
  body: string
  date: string
  hasMinutes: boolean
}

export const pastMeetings: PastMeeting[] = [
  { body: 'City Council — Regular Session', date: 'Mar 11, 2026', hasMinutes: true },
  { body: 'Planning Commission', date: 'Mar 8, 2026', hasMinutes: true },
  { body: 'City Council — Work Session', date: 'Feb 25, 2026', hasMinutes: true },
  { body: 'Budget & Finance Committee', date: 'Feb 18, 2026', hasMinutes: true },
  { body: 'Parks & Recreation Board', date: 'Feb 11, 2026', hasMinutes: false },
]

export interface Notice {
  title: string
  date: string
  type: 'Advisory' | 'Meeting' | 'Report' | 'Event'
  summary: string
}

export const notices: Notice[] = [
  {
    title: 'Water Main Repair — Salal Creek Rd',
    date: 'Mar 15, 2026',
    type: 'Advisory',
    summary:
      'Expect intermittent water service on Salal Creek Rd between Elm St and the library. Repairs estimated through Friday.',
  },
  {
    title: 'Spring Budget Hearing — Public Comment Open',
    date: 'Mar 22, 2026',
    type: 'Meeting',
    summary:
      'City Council chambers, 7:00 PM. Agenda includes the Parks & Trails bond measure and harbor dredging funding.',
  },
  {
    title: 'Coastal Erosion Report Published',
    date: 'Mar 10, 2026',
    type: 'Report',
    summary:
      'Annual shoreline assessment by Oregon Coastal Management. Dune Quarter monitoring stations show 0.4m retreat.',
  },
  {
    title: 'Farmers Market Opens for the Season',
    date: 'Apr 1, 2026',
    type: 'Event',
    summary:
      'Old Harbor parking lot, every Saturday 9 AM – 1 PM through October. Vendor applications still accepted.',
  },
  {
    title: 'Residential Burn Ban Lifted — Zones 1–3',
    date: 'Apr 5, 2026',
    type: 'Advisory',
    summary:
      'Spring moisture levels allow controlled yard debris burns in residential zones 1–3. Permits required; apply online or at Fire Station 1.',
  },
]

export const noticeTypeStyles: Record<string, { bg: string; fg: string }> = {
  Advisory: {
    bg: 'color-mix(in srgb, var(--color-warning) 15%, transparent)',
    fg: 'var(--color-warning)',
  },
  Meeting: { bg: 'var(--color-secondary)', fg: 'var(--color-primary)' },
  Report: { bg: 'var(--color-muted)', fg: 'var(--color-muted-foreground)' },
  Event: {
    bg: 'color-mix(in srgb, var(--color-success) 15%, transparent)',
    fg: 'var(--color-success)',
  },
}

export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: 'How do I pay my utility bill?',
    answer:
      'You can pay online through the Utility Bill portal, by mail to City Hall (100 Main Street), or in person at the Finance Department window during business hours.',
  },
  {
    question: 'How do I apply for a building permit?',
    answer:
      'Submit a permit application through the Planning & Zoning department. Applications are available online or at City Hall. Typical review takes 10–15 business days.',
  },
  {
    question: 'When is the next City Council meeting?',
    answer:
      'City Council meets the second and fourth Tuesday of each month at 7:00 PM in Council Chambers. Agendas are posted 72 hours in advance on the Meetings page.',
  },
  {
    question: 'How do I report a non-emergency issue?',
    answer:
      'Use the Report an Issue form on the Services page, call the non-emergency line at (541) 555-0911, or visit City Hall during business hours.',
  },
  {
    question: 'How do I reserve a park shelter or community room?',
    answer:
      'Contact Parks & Recreation at (541) 555-0104 or submit a reservation request online. Reservations open 60 days in advance.',
  },
  {
    question: 'Where can I find meeting minutes?',
    answer:
      'Approved minutes for all public meetings are posted on the Meetings page within 10 business days of approval.',
  },
]
