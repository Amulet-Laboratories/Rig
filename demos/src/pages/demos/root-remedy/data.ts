import type {
  WebStatItem,
  TeamMember,
  ServiceItem,
  FeatureItem,
  GalleryItem,
  MenuItem,
} from '@amulet-laboratories/rig'

export interface Product {
  id: string
  name: string
  price: string
  category: string
  tag: string
  thc: string
  cbd: string
  description: string
  strain: string
  img: string
}

export const products: Product[] = [
  {
    id: 'blue-dream-flower',
    name: 'Blue Dream',
    price: '$12/g',
    category: 'Flower',
    tag: 'Popular',
    thc: '21%',
    cbd: '0.1%',
    description:
      'A balanced hybrid known for full-body relaxation with gentle cerebral invigoration. Sweet berry aroma inherited from its Blueberry parent.',
    strain: 'Hybrid',
    img: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'northern-lights-flower',
    name: 'Northern Lights',
    price: '$14/g',
    category: 'Flower',
    tag: 'Staff Pick',
    thc: '18%',
    cbd: '0.3%',
    description:
      'Pure indica. Resinous buds with a sweet, spicy aroma. Deeply relaxing — recommended for evening use. One of the most famous strains in cannabis history.',
    strain: 'Indica',
    img: '',
  },
  {
    id: 'jack-herer-flower',
    name: 'Jack Herer',
    price: '$13/g',
    category: 'Flower',
    tag: '',
    thc: '23%',
    cbd: '0.2%',
    description:
      'A sativa-dominant strain named after the cannabis activist. Blissful, clear-headed, and creative. Earthy pine aroma with a hint of spice.',
    strain: 'Sativa',
    img: '',
  },
  {
    id: 'granddaddy-purple',
    name: 'Granddaddy Purple',
    price: '$15/g',
    category: 'Flower',
    tag: 'New',
    thc: '20%',
    cbd: '0.1%',
    description:
      'Complex grape and berry aroma. This indica delivers a potent fusion of physical relaxation and cerebral euphoria. Beautiful purple-hued buds.',
    strain: 'Indica',
    img: '',
  },
  {
    id: 'harlequin-flower',
    name: 'Harlequin',
    price: '$11/g',
    category: 'Flower',
    tag: 'High CBD',
    thc: '7%',
    cbd: '15%',
    description:
      'One of the most reliable CBD-rich strains available. Mild, clear-headed effects without heavy sedation. Ideal for patients seeking symptom relief without strong psychoactivity.',
    strain: 'Sativa',
    img: '',
  },
  {
    id: 'honey-lavender-gummy',
    name: 'Honey Lavender Gummies (10pk)',
    price: '$28',
    category: 'Edibles',
    tag: 'Popular',
    thc: '5mg/ea',
    cbd: '5mg/ea',
    description:
      'Locally sourced honey and lavender in a 1:1 THC:CBD gummy. Low dose, calming, and consistent. Made with Oregon honey from Briar Cove apiaries.',
    strain: '1:1 Balanced',
    img: '',
  },
  {
    id: 'dark-chocolate-bar',
    name: 'Sea Salt Dark Chocolate Bar',
    price: '$22',
    category: 'Edibles',
    tag: '',
    thc: '100mg total',
    cbd: '0mg',
    description:
      'Ten scored squares at 10mg each. 72% dark chocolate with Oregon coast sea salt. Precise dosing, rich flavor, discreet packaging.',
    strain: 'THC',
    img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'mint-lozenge',
    name: 'Peppermint Lozenges (20pk)',
    price: '$18',
    category: 'Edibles',
    tag: 'High CBD',
    thc: '2mg/ea',
    cbd: '10mg/ea',
    description:
      'Sublingual lozenges for fast-acting relief. Cool peppermint flavor. High CBD ratio makes these ideal for daytime symptom management.',
    strain: 'CBD-dominant',
    img: '',
  },
  {
    id: 'full-spectrum-tincture',
    name: 'Full Spectrum Tincture (1000mg)',
    price: '$65',
    category: 'Tinctures',
    tag: 'Staff Pick',
    thc: '500mg',
    cbd: '500mg',
    description:
      'Whole-plant extract in MCT oil. Graduated dropper for precise dosing. 1:1 THC:CBD ratio. Unflavored — add to any food or beverage.',
    strain: '1:1 Balanced',
    img: '',
  },
  {
    id: 'sleep-tincture',
    name: 'Rest & Restore Tincture (750mg)',
    price: '$55',
    category: 'Tinctures',
    tag: 'New',
    thc: '500mg',
    cbd: '250mg',
    description:
      'Formulated for sleep support with indica-derived terpenes (myrcene, linalool). Natural vanilla flavor. Take 30 minutes before bed.',
    strain: 'Indica-leaning',
    img: '',
  },
  {
    id: 'muscle-balm',
    name: 'Deep Relief Muscle Balm (2oz)',
    price: '$38',
    category: 'Topicals',
    tag: 'Popular',
    thc: '150mg',
    cbd: '300mg',
    description:
      'Targeted relief for sore muscles and joints. Beeswax base with arnica, menthol, and full-spectrum cannabis extract. Non-psychoactive — does not enter the bloodstream.',
    strain: 'Topical',
    img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'body-oil',
    name: 'Recovery Body Oil (4oz)',
    price: '$42',
    category: 'Topicals',
    tag: '',
    thc: '100mg',
    cbd: '200mg',
    description:
      'Lightweight massage oil infused with CBD-rich extract, jojoba, and sweet almond oil. Calming lavender and eucalyptus scent.',
    strain: 'Topical',
    img: '',
  },
  {
    id: 'og-preroll',
    name: 'OG Kush Pre-Roll (1g)',
    price: '$8',
    category: 'Pre-Rolls',
    tag: '',
    thc: '22%',
    cbd: '0.1%',
    description:
      'Classic OG Kush in a hand-rolled cone. Earthy, pine, and lemon flavor profile. Heavy-hitting hybrid with stress-melting effects.',
    strain: 'Hybrid',
    img: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cbd-preroll',
    name: 'Cannatonic Pre-Roll (1g)',
    price: '$7',
    category: 'Pre-Rolls',
    tag: 'High CBD',
    thc: '6%',
    cbd: '12%',
    description:
      'High-CBD, low-THC pre-roll for patients who want relief without heavy psychoactivity. Smooth, earthy smoke with a citrus finish.',
    strain: 'Hybrid',
    img: '',
  },
  {
    id: 'variety-preroll-pack',
    name: 'Discovery Pack (5 x 0.5g)',
    price: '$25',
    category: 'Pre-Rolls',
    tag: 'New',
    thc: 'Varies',
    cbd: 'Varies',
    description:
      'Five half-gram pre-rolls — one each from our five most popular strains. A great way to find what works for you.',
    strain: 'Mixed',
    img: '',
  },
]

export const categories = [
  'All Products',
  'Flower',
  'Edibles',
  'Tinctures',
  'Topicals',
  'Pre-Rolls',
]

export const tagVariants: Record<string, string> = {
  New: 'primary',
  Popular: 'success',
  'Staff Pick': '',
  'High CBD': 'accent',
}

export interface Review {
  name: string
  location: string
  text: string
  condition: string
}

export const reviews: Review[] = [
  {
    name: 'Margaret T.',
    location: 'Briar Cove, OR',
    text: 'The staff took the time to understand my chronic pain and found me the right strain and dosage. I sleep through the night for the first time in years.',
    condition: 'Chronic Pain',
  },
  {
    name: 'David & Anne K.',
    location: 'Coos Bay, OR',
    text: "We drove 40 minutes because friends recommended Root & Remedy specifically. The consultation was thorough and unhurried. We've been regulars since.",
    condition: 'Anxiety',
  },
  {
    name: 'R. Patel',
    location: 'Briar Cove, OR',
    text: 'As a first-time patient, I was nervous about the process. They walked me through everything — the card, the dosing, the different formats. No judgment, just care.',
    condition: 'First-time Patient',
  },
  {
    name: 'Sam W.',
    location: 'Bandon, OR',
    text: 'The CBD topicals have been a game-changer for my arthritis. I tried everything else first — this is the only thing that consistently works.',
    condition: 'Arthritis',
  },
]

export const staff: (TeamMember & { specialty: string })[] = [
  {
    id: 'elena-vasquez',
    name: 'Elena Vasquez',
    role: 'Founder & Licensed Pharmacist',
    bio: 'Elena spent 15 years in traditional pharmacy before opening Root & Remedy. She holds certifications in cannabinoid medicine and leads all patient consultations.',
    img: '',
    specialty: 'Dosing & drug interactions',
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Patient Consultant',
    bio: 'Marcus is a certified cannabis educator with a background in naturopathic medicine. He helps patients navigate strains, formats, and dosing for their specific conditions.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    specialty: 'Strain selection & terpene profiles',
  },
  {
    id: 'joy-okafor',
    name: 'Joy Okafor',
    role: 'Wellness Coordinator',
    bio: 'Joy manages the dispensary floor and runs the monthly wellness workshops. She has a special interest in CBD therapies for chronic conditions.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    specialty: 'CBD therapies & wellness education',
  },
]

export const dispensaryStats: WebStatItem[] = [
  { value: '2023', label: 'Year opened' },
  { value: '1,200+', label: 'Patients served' },
  { value: '45+', label: 'Products in stock' },
  { value: '100%', label: 'Oregon-sourced' },
]

export const serviceItems: ServiceItem[] = [
  {
    id: 'consultations',
    title: 'One-on-One Consultations',
    description:
      'Free 20-minute sessions with a certified cannabis educator. We review your condition, medications, and goals to build a personalized plan.',
  },
  {
    id: 'ommp',
    title: 'OMMP Card Assistance',
    description:
      'We help Oregon patients navigate the medical marijuana program application, renewal, and card replacement process.',
  },
  {
    id: 'dosing',
    title: 'Dosing Guidance',
    description:
      'Start low, go slow. We provide written dosing schedules and check-in calls for new patients adjusting to cannabis therapy.',
  },
  {
    id: 'workshops',
    title: 'Monthly Wellness Workshops',
    description:
      'Free community events covering topics like pain management, sleep hygiene, terpene science, and cooking with cannabis.',
  },
]

export const valueItems: ServiceItem[] = [
  {
    id: 'patient-first',
    title: 'Patient-first',
    description:
      'Every visit starts with a conversation, not a transaction. We listen to your symptoms, history, and goals before recommending anything.',
  },
  {
    id: 'clinical-precision',
    title: 'Clinical precision',
    description:
      'All products are lab-tested for potency, pesticides, and heavy metals. We publish full certificates of analysis for everything we carry.',
  },
  {
    id: 'education',
    title: 'Education over sales',
    description:
      'We run free monthly workshops on dosing, strain selection, and cannabis science. Knowledge is the best medicine we can offer.',
  },
  {
    id: 'community',
    title: 'Community trust',
    description:
      'We work with local healthcare providers, host support groups, and donate a portion of proceeds to the Briar Cove free clinic.',
  },
]

export const benefitFeatures: FeatureItem[] = [
  { id: 'lab-tested', text: 'Full-panel lab testing on every product' },
  { id: 'oregon', text: '100% Oregon-sourced flower and extracts' },
  { id: 'consultations', text: 'Free consultations with certified educators' },
  { id: 'open', text: 'Open 7 days a week, no appointment needed' },
  { id: 'accessible', text: 'ADA-accessible ground-floor location' },
  { id: 'discreet', text: 'Discreet packaging for all purchases' },
]

export const dispensaryGallery: GalleryItem[] = [
  {
    id: 'showroom',
    title: 'The Showroom',
    description:
      'Every product is displayed with its full lab report, terpene profile, and suggested use. No guessing, no pressure — take your time.',
    img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Root & Remedy dispensary showroom with product displays',
  },
  {
    id: 'consultation',
    title: 'Consultation Room',
    description:
      'Private, comfortable space for one-on-one sessions. We review your health history, current medications, and treatment goals before recommending anything.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Private consultation room with warm lighting',
  },
  {
    id: 'apothecary',
    title: 'The Apothecary Wall',
    description:
      'Our signature feature — floor-to-ceiling shelving displaying tinctures, topicals, and edibles. The building was an actual apothecary in the 1920s.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Apothecary-style shelving with tinctures and products',
  },
]

export const firstVisitFeatures: FeatureItem[] = [
  { id: 'id', text: 'Valid photo ID (21+ recreational, 18+ with OMMP card)' },
  {
    id: 'checkin',
    text: 'Check in at the front desk — we verify ID and pair you with a consultant',
  },
  { id: 'consult', text: 'Free consultation to discuss your needs — no purchase required' },
  { id: 'browse', text: 'Browse the showroom — every product has full potency and terpene labels' },
  { id: 'purchase', text: 'Purchase with cash or debit — we provide compliant packaging' },
]

export const wellnessWorkshops: MenuItem[] = [
  {
    id: 'dosing-101',
    name: 'Dosing 101',
    description:
      'How to find your minimum effective dose, titrate safely, and avoid common beginner mistakes. Covers all formats: flower, edibles, tinctures, and topicals.',
    price: 'Free',
    note: '1st Saturday of each month',
  },
  {
    id: 'terpene-lab',
    name: 'Terpene Lab',
    description:
      'Smell, compare, and learn to read terpene profiles. Understand why two strains with the same THC hit differently.',
    price: 'Free',
    note: '2nd Saturday of each month',
  },
  {
    id: 'pain-management',
    name: 'Cannabis & Pain Management',
    description:
      'Evidence-based approaches to using cannabis for chronic pain. Led by Elena Vasquez, RPh, with Q&A. Bring your questions.',
    price: 'Free',
    note: '3rd Saturday of each month',
  },
  {
    id: 'cooking-cannabis',
    name: 'Cooking with Cannabis',
    description:
      'Decarboxylation, infusion methods, and precise dosing for edibles you make at home. Recipes and take-home guide included.',
    price: '$15',
    note: '4th Saturday of each month',
  },
]

export const wellnessResources: ServiceItem[] = [
  {
    id: 'support-group',
    title: 'Patient Support Group',
    description:
      'Monthly peer group for patients managing chronic conditions with cannabis. Facilitated by Joy Okafor. Confidential and judgment-free.',
  },
  {
    id: 'provider-network',
    title: 'Healthcare Provider Network',
    description:
      'We partner with physicians, naturopaths, and physical therapists in Briar Cove and Coos Bay who are cannabis-informed.',
  },
  {
    id: 'resource-library',
    title: 'Resource Library',
    description:
      'Printed and digital guides on strain selection, Oregon cannabis law, OMMP applications, and condition-specific dosing.',
  },
  {
    id: 'new-patient-kit',
    title: 'New Patient Welcome Kit',
    description:
      'Dosing journal, terpene reference card, and a curated sample pack. Free for first-time patients who complete a consultation.',
  },
]

export const contactFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    placeholder: 'Your name',
    required: true,
    autocomplete: 'name',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'your@email.com',
    required: true,
    autocomplete: 'email',
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel' as const,
    placeholder: '(541) 555-0000',
    required: false,
    autocomplete: 'tel',
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea' as const,
    placeholder: 'Questions about products, consultations, or your first visit...',
    required: true,
    rows: 4,
  },
]
