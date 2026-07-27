<script setup lang="ts">
import { Section, CTABanner, Button, Card, Badge } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

interface Attorney {
  id: string
  name: string
  role: string
  img: string
  years: number
  education: string[]
  barAdmissions: string[]
  areas: string[]
  bio: string
}

const attorneys: Attorney[] = [
  {
    id: 'margaret-pace',
    name: 'Margaret Pace',
    role: 'Managing Partner',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    years: 30,
    education: [
      'J.D., University of Oregon School of Law, 1994',
      'B.A., Political Science, Reed College, 1991',
    ],
    barAdmissions: ['Oregon State Bar, 1994', 'U.S. District Court, District of Oregon, 1995'],
    areas: ['Real Estate Law', 'Estate Planning'],
    bio: 'Margaret co-founded the firm in 1996 after clerking for the Honorable Patricia Sullivan in Coos County Circuit Court. She has handled more than 500 residential and commercial closings along the southern Oregon coast and is recognized for her meticulous approach to title review and transactional due diligence. Margaret also maintains an active estate planning practice, helping families protect their assets through carefully drafted wills and trusts. She serves on the board of the Briar Cove Community Foundation and is a past president of the Coos County Bar Association.',
  },
  {
    id: 'william-aldric',
    name: 'William Aldric',
    role: 'Senior Partner',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
    years: 28,
    education: [
      'J.D., Lewis & Clark Law School, 1996',
      'B.S., Business Administration, Oregon State University, 1993',
    ],
    barAdmissions: ['Oregon State Bar, 1996'],
    areas: ['Business Formation', 'Commercial Law'],
    bio: 'William joined Margaret in establishing the firm after several years in private practice in Portland. His practice centers on business formation, commercial transactions, and partnership disputes. He has guided hundreds of Oregon entrepreneurs through entity selection, operating agreement drafting, and succession planning. William is known for his practical, no-nonsense counsel and his ability to resolve complex commercial disputes through negotiation before they reach the courtroom. He is an active member of the Oregon State Bar Business Law Section.',
  },
  {
    id: 'catherine-wynn',
    name: 'Catherine Wynn',
    role: 'Associate Attorney',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
    years: 8,
    education: [
      'J.D., Willamette University College of Law, 2018',
      'B.A., English, University of Portland, 2015',
    ],
    barAdmissions: ['Oregon State Bar, 2018', 'Oregon Real Estate Agency, Licensed Broker, 2016'],
    areas: ['Real Estate Law', 'Civil Litigation'],
    bio: "Catherine brings a unique perspective to the firm, having worked as a licensed real estate broker before attending law school. This dual background gives her an unusually practical understanding of the transactional issues clients face. Since joining the firm in 2018, she has developed a strong practice in residential real estate and has expanded the firm's civil litigation capabilities. Catherine also volunteers with the Oregon State Bar's Volunteer Lawyers Project, providing pro bono legal services to low-income Oregonians.",
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <h1 class="font-serif text-3xl font-normal sm:text-4xl">Our Attorneys</h1>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed">
      Three attorneys with complementary expertise, united by a commitment to thorough, responsive
      legal counsel.
    </p>
  </Section>

  <!-- Attorney profiles -->
  <Section v-for="(a, i) in attorneys" :key="a.id" :variant="i % 2 === 1 ? 'alternate' : undefined">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
      <img
        :src="a.img"
        :alt="`Photo of ${a.name}`"
        class="aspect-[4/5] w-full shrink-0 rounded-sm object-cover sm:w-48"
        loading="lazy"
      />
      <div>
        <h2 class="font-serif text-xl font-normal">{{ a.name }}</h2>
        <p class="mt-1 text-sm">{{ a.role }}</p>
        <Badge class="mt-2" variant="secondary">{{ a.years }} Years of Practice</Badge>
        <div class="mt-3 flex flex-wrap gap-1">
          <Badge v-for="area in a.areas" :key="area" variant="outline">{{ area }}</Badge>
        </div>
        <p class="mt-4 max-w-2xl text-sm leading-relaxed">{{ a.bio }}</p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card class="p-5">
        <p class="text-xs font-medium uppercase tracking-wider">Education</p>
        <ul class="mt-3 space-y-2">
          <li v-for="e in a.education" :key="e" class="text-sm leading-relaxed">{{ e }}</li>
        </ul>
      </Card>
      <Card class="p-5">
        <p class="text-xs font-medium uppercase tracking-wider">Bar Admissions</p>
        <ul class="mt-3 space-y-2">
          <li v-for="b in a.barAdmissions" :key="b" class="text-sm leading-relaxed">{{ b }}</li>
        </ul>
      </Card>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-normal">Ready to speak with one of our attorneys?</p>
    <p class="mt-1 text-sm">We welcome the opportunity to discuss your situation.</p>
    <template #action>
      <Button variant="cta-light" @click="emit('navigate', 'contact')"
        >Schedule a Consultation</Button
      >
    </template>
  </CTABanner>
</template>
