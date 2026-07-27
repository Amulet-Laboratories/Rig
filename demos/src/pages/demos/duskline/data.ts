import type { WebStatItem, ServiceItem } from '@amulet-laboratories/rig'

export const stats: WebStatItem[] = [
  { value: '6', label: 'Years Private Practice' },
  { value: '400+', label: 'Cases Handled' },
  { value: '12', label: 'Years Law Enforcement' },
  { value: '100%', label: 'Confidential' },
]

export interface DusklineService extends ServiceItem {
  detail: string
  caseTypes: string[]
}

export const services: DusklineService[] = [
  {
    id: 'surveillance',
    title: 'Surveillance',
    description:
      'Discreet observation and documentation for civil, domestic, and insurance matters. Mobile and stationary operations with full photographic and video evidence packages. Court-admissible reporting.',
    detail:
      'Surveillance operations range from single-day activity checks to multi-week documentation assignments. All evidence is collected, preserved, and reported to meet Oregon Rules of Evidence standards. Reports include timestamped photographs, GPS logs, and narrative summaries suitable for direct submission to counsel.',
    caseTypes: ['Domestic', 'Insurance', 'Civil Litigation', 'Workers Comp'],
  },
  {
    id: 'background',
    title: 'Background Checks',
    description:
      'Comprehensive records research spanning employment, financial, criminal, and civil litigation histories. Nationwide database access with manual county-level verification for accuracy.',
    detail:
      'Every database search is verified at the county level by a human researcher. This catches aliases, sealed records that appear in ancillary databases, and jurisdictional gaps that automated-only reports miss. Reports are delivered in 3–5 business days; rush service available.',
    caseTypes: ['Pre-Employment', 'Tenant Screening', 'Due Diligence', 'Custody'],
  },
  {
    id: 'asset',
    title: 'Asset Tracing',
    description:
      'Locating hidden, transferred, or concealed assets for litigation support and judgment enforcement. Real property, financial accounts, vehicles, and business interests.',
    detail:
      'Asset traces follow paper trails across county recorder offices, Secretary of State filings, UCC liens, vehicle registrations, and financial institution records. Particularly effective in divorce proceedings and civil judgment enforcement where opposing parties have incentive to conceal holdings.',
    caseTypes: ['Divorce', 'Judgment Enforcement', 'Fraud', 'Estate'],
  },
  {
    id: 'litigation',
    title: 'Litigation Support',
    description:
      'Evidence gathering, witness location, statement collection, and case development for attorneys. Pre-trial preparation and expert referral coordination. Available for deposition and trial testimony.',
    detail:
      'Duskline works directly with counsel to develop case strategy, locate and interview witnesses, collect documentary evidence, and prepare detailed case chronologies. Jack Maren has testified in over 40 depositions and trial proceedings across Oregon and Washington.',
    caseTypes: ['Civil', 'Family Law', 'Personal Injury', 'Employment'],
  },
  {
    id: 'missing',
    title: 'Missing Persons',
    description:
      'Skip tracing and location services for individuals who cannot be found through conventional means. Missing family members, witnesses, heirs, and persons of interest.',
    detail:
      'Combines database skip-tracing with field investigation: surveillance of known associates, canvassing of last-known areas, and social media intelligence. Success rate of 87% for domestic locate cases. International referral network for out-of-country searches.',
    caseTypes: ['Family Reunion', 'Heir Location', 'Witness Location', 'Skip Trace'],
  },
  {
    id: 'insurance',
    title: 'Insurance Investigation',
    description:
      'Claims verification, fraud detection, and activity documentation for insurance carriers and self-insured employers. Workers compensation and liability claims.',
    detail:
      'Combines surveillance, background research, and social media analysis to verify or refute insurance claims. Activity checks document claimant physical capabilities against reported injuries. Reports are formatted for SIU review and include evidence suitable for coverage denial or fraud referral.',
    caseTypes: ['Workers Comp', 'Liability', 'Disability', 'Fraud Detection'],
  },
]

export interface Testimonial {
  quote: string
  attribution: string
}

export const testimonials: Testimonial[] = [
  {
    quote: 'Jack found in two days what my previous investigator could not locate in three months.',
    attribution: 'Attorney — Portland, OR',
  },
  {
    quote:
      'Professional, discreet, and thoroughly documented. The surveillance report was court-ready and stood up without challenge.',
    attribution: 'Family Law Attorney — Coos Bay',
  },
  {
    quote:
      'Duskline handled a sensitive matter with the discretion it required. I would not hesitate to retain them again.',
    attribution: 'Verified Client',
  },
]

export interface CaseStudy {
  id: string
  title: string
  type: string
  summary: string
  outcome: string
  duration: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Concealed Asset Recovery',
    type: 'Asset Tracing',
    summary:
      'Spouse in a high-asset divorce had transferred real property and business interests to third parties in the months before filing. Opposing counsel requested a comprehensive asset trace.',
    outcome:
      'Located $1.4M in concealed assets across three LLCs and two out-of-state properties. All holdings disclosed to the court.',
    duration: '3 weeks',
  },
  {
    id: 'case-2',
    title: 'Insurance Fraud Documentation',
    type: 'Insurance Investigation',
    summary:
      'Workers compensation claimant reported total disability following a workplace injury. Carrier SIU requested activity surveillance to verify claim.',
    outcome:
      'Four days of surveillance documented claimant performing physical activities inconsistent with reported injuries. Evidence submitted to carrier; claim denied.',
    duration: '4 days',
  },
  {
    id: 'case-3',
    title: 'Missing Heir Location',
    type: 'Missing Persons',
    summary:
      'Estate attorney needed to locate a beneficiary who had not been in contact with family for 12 years. Last known address was a rental property in Eugene, vacated 2018.',
    outcome:
      'Subject located in Boise through social media intelligence and associate interviews. Served with estate notification within 10 days.',
    duration: '10 days',
  },
]

export const credentials = {
  name: 'Jack Maren',
  title: 'Principal Investigator',
  license: 'Oregon DPSST Licensed Private Investigator · #PI-248671',
  bio: 'After twelve years with Briar Cove PD — the last six in major crimes — Jack opened Duskline in 2020. The practice handles civil and domestic investigations only. No criminal defense work.',
  history: [
    'Oregon DPSST Licensed Private Investigator · #PI-248671',
    'Former Briar Cove PD, Detective Division (2008–2020)',
    'Specialized in financial crimes and missing persons',
    '12 years felony-level investigative experience',
    'Member, Oregon Association of Licensed Investigators',
    'Member, National Council of Investigation & Security Services',
  ],
  training: [
    'Advanced Surveillance Techniques (OALI, 2022)',
    'Digital Forensics for Civil Investigators (NCI, 2021)',
    'Court Testimony & Evidence Presentation (OALI, 2020)',
    'Financial Crimes Investigation (FBI-LEEDA, 2016)',
    'Interview & Interrogation (Reid Technique, 2012)',
  ],
  courtExperience: '40+ depositions and trial proceedings across Oregon and Washington',
}

export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: 'Is what you do legal?',
    answer:
      'Yes. Duskline is licensed by the Oregon Department of Public Safety Standards and Training (DPSST). All investigative methods comply with Oregon Revised Statutes, federal law, and the ethical standards of the Oregon Association of Licensed Investigators.',
  },
  {
    question: 'How much does an investigation cost?',
    answer:
      'Fees depend on case complexity, duration, and the type of investigation. Surveillance and field work are billed hourly. Background checks and asset traces are typically flat-fee. A cost estimate is provided after the initial consultation — before any work begins.',
  },
  {
    question: 'What happens during the initial consultation?',
    answer:
      'We discuss your situation, objectives, and timeline by phone or in person. I will tell you whether your case is something Duskline handles, what the investigation would involve, and what it is likely to cost. There is no charge and no obligation.',
  },
  {
    question: 'Will the subject know they are being investigated?',
    answer:
      'Not if discretion is required. Surveillance and most field work are conducted covertly. Database research leaves no trace. If your case requires interviews or process service, those are handled with appropriate notice.',
  },
  {
    question: 'Can your findings be used in court?',
    answer:
      'Yes. All evidence is collected, documented, and preserved to meet Oregon Rules of Evidence. Reports are formatted for attorney review and court submission. I am available for deposition and trial testimony.',
  },
  {
    question: 'Do you handle criminal defense cases?',
    answer:
      'No. Duskline handles civil and domestic investigations only. I do not work for criminal defense attorneys or defendants in criminal proceedings. This is a firm policy without exceptions.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'Based in Briar Cove, Oregon. Most cases are within Coos, Curry, Douglas, and Lane counties. Portland metro and statewide cases accepted. Out-of-state work coordinated through referral network.',
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    description:
      'Free, confidential phone or in-person meeting. We assess your situation and determine if Duskline is the right fit.',
  },
  {
    step: '02',
    title: 'Case Assessment',
    description:
      'Scope of work, timeline, and cost estimate provided in writing. No work begins without your written authorization.',
  },
  {
    step: '03',
    title: 'Investigation',
    description:
      'Field work, database research, surveillance, or interviews — whatever the case requires. You receive progress updates at agreed intervals.',
  },
  {
    step: '04',
    title: 'Reporting',
    description:
      'Comprehensive written report with evidence, documentation, and findings. Formatted for attorney review and court submission.',
  },
  {
    step: '05',
    title: 'Testimony',
    description:
      'If your case goes to court, I am available for deposition and trial testimony. Over 40 proceedings to date.',
  },
]
