export interface TapItem {
  name: string
  style: string
  abv: string
  ibu: string
  status: string
  note: string
}

export interface RecurringEvent {
  name: string
  day: string
  time: string
  description: string
  icon: string
}

export interface UpcomingEvent {
  name: string
  date: string
  time: string
  description: string
  icon: string
}

export const tapList: TapItem[] = [
  {
    name: 'Riptide IPA',
    style: 'West Coast IPA',
    abv: '7.2%',
    ibu: '65',
    status: 'Pouring',
    note: 'Flagship. Citrus and pine, dry finish.',
  },
  {
    name: 'Fogbank Haze',
    style: 'Hazy Pale Ale',
    abv: '5.4%',
    ibu: '35',
    status: 'Pouring',
    note: 'Tropical juice bomb. Our best-seller.',
  },
  {
    name: 'Undertow Stout',
    style: 'Oatmeal Stout',
    abv: '6.8%',
    ibu: '40',
    status: 'Pouring',
    note: 'Coffee and chocolate. Silky body.',
  },
  {
    name: 'Dockside Pils',
    style: 'Czech Pilsner',
    abv: '4.9%',
    ibu: '28',
    status: 'Pouring',
    note: 'Crisp, biscuity, noble hops. Sessionable.',
  },
  {
    name: 'Saltwater Gose',
    style: 'Gose',
    abv: '4.5%',
    ibu: '12',
    status: 'Pouring',
    note: 'Brewed with Briar Cove sea salt and coriander.',
  },
  {
    name: 'Breakwater Amber',
    style: 'Amber Ale',
    abv: '5.6%',
    ibu: '32',
    status: 'Low',
    note: 'Caramel malt, toasty finish. Almost gone.',
  },
  {
    name: 'Storm Surge DIPA',
    style: 'Double IPA',
    abv: '9.1%',
    ibu: '85',
    status: 'Pouring',
    note: 'Mango, resin, booze. Not for beginners.',
  },
  {
    name: 'Barnacle Brown',
    style: 'English Brown Ale',
    abv: '5.2%',
    ibu: '25',
    status: 'Coming Soon',
    note: 'Nutty and mild. Brewed with local hazelnuts.',
  },
  {
    name: 'Kelp Forest Saison',
    style: 'Belgian Saison',
    abv: '6.3%',
    ibu: '22',
    status: 'Pouring',
    note: 'Peppery, dry, farmhouse funk. Collaboration with Maren Lys.',
  },
  {
    name: 'Harbor Light Lager',
    style: 'American Lager',
    abv: '4.2%',
    ibu: '15',
    status: 'Pouring',
    note: 'Clean, cold, crushable. The one your dad will drink.',
  },
]

export const recurringEvents: RecurringEvent[] = [
  {
    name: 'Trivia Night',
    day: 'Every Wednesday',
    time: '7pm',
    description:
      'Six rounds, no phones, winning team gets a $50 bar tab. Hosted by local radio legend Dan Weatherby.',
    icon: 'puzzle',
  },
  {
    name: 'Pint Night',
    day: 'Every Thursday',
    time: '4pm–close',
    description: 'All pints $5. A Briar Cove institution. Kitchen stays open late.',
    icon: 'tag',
  },
  {
    name: 'Open Mic',
    day: 'First Sunday of the month',
    time: '5pm',
    description: 'Sign up at the bar. All genres welcome. 10-minute sets.',
    icon: 'music',
  },
]

export const upcomingEvents: UpcomingEvent[] = [
  {
    name: 'Live Music: The Salal Creek Band',
    date: 'Friday, Apr 3',
    time: '8pm',
    description: 'Folk-rock four-piece from Gold Beach. Two sets, no cover.',
    icon: 'music',
  },
  {
    name: 'Brewery Tour & Tasting',
    date: 'Saturday, Apr 4',
    time: '2pm',
    description: 'Walk through the brewhouse with Cole. Four samples included. $10, reserve ahead.',
    icon: 'beaker',
  },
  {
    name: 'KBCV Live Remote Broadcast',
    date: 'Saturday, Mar 28',
    time: '3pm',
    description: 'KBCV 91.7 FM broadcasts live from the taproom. Music, interviews, and giveaways.',
    icon: 'music',
  },
  {
    name: 'Cornhole Tournament',
    date: 'Sunday, Apr 6',
    time: '1pm',
    description: 'Double elimination. Teams of two. $20 entry, cash prizes. Register at the bar.',
    icon: 'puzzle',
  },
  {
    name: 'Stout Release Party',
    date: 'Friday, Apr 11',
    time: '6pm',
    description:
      'First pour of our limited-edition Imperial Stout aged in bourbon barrels. One keg only.',
    icon: 'beaker',
  },
  {
    name: 'Earth Day Coastal Cleanup',
    date: 'Saturday, Apr 19',
    time: '10am',
    description:
      'Meet at the taproom. We provide bags and gloves. Free pint for every volunteer after.',
    icon: 'tag',
  },
  {
    name: 'Live Music: Maren Lys Solo Set',
    date: 'Saturday, Apr 26',
    time: '7pm',
    description:
      "Briar Cove's own Maren Lys — ambient folk, synth textures. One set, one hour, unforgettable.",
    icon: 'music',
  },
  {
    name: 'Cask Night',
    date: 'First Friday of each month',
    time: '5pm',
    description: 'One-off cask-conditioned ale, hand-pulled until it kicks. Usually gone by 8.',
    icon: 'beaker',
  },
]

export const food = [
  {
    id: 'food-fish-tacos',
    name: 'Smoked Fish Tacos',
    price: '$14',
    description: 'Wild-caught cod, cabbage slaw, chipotle crema',
  },
  {
    id: 'food-loaded-tots',
    name: 'Loaded Tots',
    price: '$10',
    description: 'Beer cheese, bacon, scallions, sour cream',
  },
  {
    id: 'food-brewers-burger',
    name: 'Brewers Burger',
    price: '$16',
    description: 'Double patty, Stout-braised onions, sharp cheddar, brioche bun',
  },
  {
    id: 'food-pretzel',
    name: 'Pretzel & Beer Cheese',
    price: '$12',
    description: 'Warm Bavarian pretzel, Fogbank Haze cheese dip',
  },
  {
    id: 'food-wings',
    name: 'Crispy Wings (6pc)',
    price: '$13',
    description: 'Riptide IPA dry rub or Stout BBQ glaze',
  },
  {
    id: 'food-chowder',
    name: 'Clam Chowder',
    price: '$9',
    description: 'New England-style, housemade, served in a bread bowl +$3',
  },
  {
    id: 'food-fish-chips',
    name: 'Fish & Chips',
    price: '$17',
    description: 'Pils-battered Pacific cod, malt vinegar, house fries',
  },
  {
    id: 'food-portobello',
    name: 'Smoked Portobello Sandwich',
    price: '$14',
    description: 'Grilled, balsamic glaze, arugula, provolone on ciabatta',
  },
  {
    id: 'food-mac-cheese',
    name: 'Mac & Cheese',
    price: '$11',
    description: 'Four-cheese blend, panko crust. Add pulled pork +$4',
  },
  {
    id: 'food-fries',
    name: 'House Fries',
    price: '$7',
    description: 'Crispy seasoned fries, garlic aioli',
  },
]

export const merch = [
  {
    id: 'merch-tee',
    name: 'Undertow Logo Tee',
    price: '$28',
    description: 'Heavyweight cotton, orange on black',
  },
  {
    id: 'merch-pint-glass',
    name: 'Pint Glass Set (4)',
    price: '$24',
    description: 'Branded 16oz shaker glasses',
  },
  {
    id: 'merch-trucker-cap',
    name: 'Trucker Cap',
    price: '$22',
    description: 'Black mesh-back, embroidered logo',
  },
  {
    id: 'merch-growler',
    name: 'Growler (Empty)',
    price: '$15',
    description: '64oz amber glass, swing-top. Fills from $12',
  },
]

export const nonAlcoholicDrinks = [
  {
    id: 'drink-ginger-beer',
    name: 'N/A Ginger Beer',
    price: '$5',
    description: 'Housemade, spicy, served cold',
  },
  {
    id: 'drink-root-beer-float',
    name: 'Root Beer Float',
    price: '$7',
    description: 'Tillamook vanilla + housemade root beer',
  },
  {
    id: 'drink-kombucha',
    name: 'Kombucha (rotating)',
    price: '$6',
    description: "Local. Ask your server for today's flavor",
  },
  {
    id: 'drink-coffee',
    name: 'Coffee (drip)',
    price: '$3',
    description: 'Drift Coffee roast, served hot or iced',
  },
  {
    id: 'drink-hot-cider',
    name: 'Hot Cider',
    price: '$5',
    description: 'Apple cider, cinnamon, star anise',
  },
]
