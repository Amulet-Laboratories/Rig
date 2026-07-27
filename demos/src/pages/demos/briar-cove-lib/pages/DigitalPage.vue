<script setup lang="ts">
import { Section, Card, Badge, Icon } from '@amulet-laboratories/rig'

const resources = [
  {
    name: 'Libby by OverDrive',
    category: 'E-Books & Audiobooks',
    description:
      'Borrow e-books and audiobooks from your phone, tablet, or e-reader. Over 15,000 titles available with no late fees. Works with Kindle via the Kindle compatibility feature.',
    icon: 'heroicons:device-phone-mobile',
    features: ['15,000+ titles', 'No late fees', 'Kindle compatible', 'Offline reading'],
  },
  {
    name: 'Kanopy',
    category: 'Streaming Video',
    description:
      "Stream over 30,000 films — including indie cinema, documentaries, Great Courses lectures, and kids' content. Up to 10 play credits per month.",
    icon: 'heroicons:film',
    features: ['30,000+ titles', '10 plays/month', "Kids' section", 'Great Courses'],
  },
  {
    name: 'Newspaper Archive',
    category: 'News & Periodicals',
    description:
      'Full digital access to current editions of The Oregonian, The New York Times, and 120+ other newspapers and magazines through PressReader.',
    icon: 'heroicons:newspaper',
    features: ['120+ publications', 'Full editions', 'Searchable archive', 'Mobile app'],
  },
  {
    name: 'Ancestry Library Edition',
    category: 'Research & Genealogy',
    description:
      "Access census records, immigration data, military records, and family trees from the world's largest genealogy database. Available in-library only.",
    icon: 'heroicons:user-group',
    features: ['Census records', 'Immigration data', 'Military records', 'In-library only'],
  },
  {
    name: 'LinkedIn Learning',
    category: 'Online Courses',
    description:
      'Over 16,000 expert-led courses in business, technology, and creative skills. Earn certificates of completion. Previously Lynda.com.',
    icon: 'heroicons:academic-cap',
    features: ['16,000+ courses', 'Certificates', 'Tech & business', 'Creative skills'],
  },
]

const techHelp = [
  {
    title: 'One-on-One Tech Help',
    schedule: 'By appointment',
    description:
      'Book a 30-minute session with a librarian to get help with your device, email, social media, or any tech question.',
  },
  {
    title: 'Computer Lab',
    schedule: 'During library hours',
    description:
      '12 public computers with internet access, Microsoft Office, and printing. Sessions limited to 60 minutes when others are waiting.',
  },
  {
    title: 'Wi-Fi Hotspot Lending',
    schedule: 'Check out for 2 weeks',
    description:
      'Borrow a portable Wi-Fi hotspot to take home. Unlimited data for 2 weeks. Great for students and remote workers.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-serif text-3xl font-bold">Digital Resources</h1>
      <p class="mt-2 text-sm leading-relaxed">
        Free with a Briar Cove library card. Access e-books, streaming video, research databases,
        and online courses from anywhere.
      </p>
    </div>
  </Section>

  <!-- Getting Started -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <Card class="p-6">
        <h2 class="font-bold">Getting Started</h2>
        <p class="mt-2 text-sm leading-relaxed">
          All digital resources are free with a valid Briar Cove library card. Most can be accessed
          from home — just enter your 14-digit library card number when prompted. Need help? Stop by
          the reference desk or call (541) 555-0142.
        </p>
      </Card>
    </div>
  </Section>

  <!-- Resources -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Available Resources</h2>
      <span class="bg-accent mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 space-y-6">
        <Card
          v-for="r in resources"
          :key="r.name"
          class="p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row">
            <div
              class="bg-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
            >
              <Icon :icon="r.icon" size="sm" aria-hidden="true" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold">{{ r.name }}</h3>
                <Badge variant="secondary">{{ r.category }}</Badge>
              </div>
              <p class="mt-2 text-sm leading-relaxed">{{ r.description }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="f in r.features"
                  :key="f"
                  class="bg-muted inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
                  {{ f }}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Tech Help -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Technology Help</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-2 text-sm">Need help getting set up? Our staff is here for you.</p>
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card v-for="t in techHelp" :key="t.title" class="p-5">
          <h3 class="font-bold">{{ t.title }}</h3>
          <Badge variant="secondary" class="mt-2">{{ t.schedule }}</Badge>
          <p class="mt-3 text-sm leading-relaxed">{{ t.description }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- FAQ -->
  <Section>
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center text-2xl font-bold">Common Questions</h2>
      <span class="bg-accent mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 space-y-4">
        <Card class="p-5">
          <h3 class="font-bold">How do I access digital resources from home?</h3>
          <p class="mt-2 text-sm leading-relaxed">
            Visit the resource's website or app and enter your 14-digit library card number when
            prompted. Most resources also accept the barcode on the back of your card.
          </p>
        </Card>
        <Card class="p-5">
          <h3 class="font-bold">Do digital checkouts have due dates?</h3>
          <p class="mt-2 text-sm leading-relaxed">
            E-books and audiobooks on Libby are checked out for 14 or 21 days (your choice). They
            return automatically — no late fees. Kanopy play credits reset on the first of each
            month.
          </p>
        </Card>
        <Card class="p-5">
          <h3 class="font-bold">Can I use Ancestry Library Edition from home?</h3>
          <p class="mt-2 text-sm leading-relaxed">
            Ancestry Library Edition is licensed for in-library use only. Visit during library hours
            to access it on our public computers or bring your own device and connect to our Wi-Fi.
          </p>
        </Card>
      </div>
    </div>
  </Section>
</template>
