import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PricingCard from './PricingCard.vue'

function factory(
  props: Partial<InstanceType<typeof PricingCard>['$props']> = {},
  slots: Record<string, string> = {},
) {
  return mount(PricingCard, { props, slots })
}

describe('PricingCard', () => {
  it('renders with data-rig-pricing-card attribute', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card]').exists()).toBe(true)
  })

  it('renders as an article element', () => {
    const wrapper = factory()
    expect(wrapper.element.tagName).toBe('ARTICLE')
  })

  it('does not set data-featured by default', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card]').attributes('data-featured')).toBeUndefined()
  })

  it('sets data-featured when featured prop is true', () => {
    const wrapper = factory({ featured: true })
    expect(wrapper.find('[data-rig-pricing-card]').attributes('data-featured')).toBe('true')
  })

  it('renders title slot', () => {
    const wrapper = factory({}, { title: '<h3 id="tier-name">Pro</h3>' })
    expect(wrapper.find('[data-rig-pricing-card-title]').exists()).toBe(true)
    expect(wrapper.find('#tier-name').text()).toBe('Pro')
  })

  it('renders price slot', () => {
    const wrapper = factory({}, { price: '<span id="price-value">$49</span>' })
    expect(wrapper.find('[data-rig-pricing-card-price]').exists()).toBe(true)
    expect(wrapper.find('#price-value').text()).toBe('$49')
  })

  it('renders period slot', () => {
    const wrapper = factory({}, { period: '/ month' })
    expect(wrapper.find('[data-rig-pricing-card-period]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-period]').text()).toContain('/ month')
  })

  it('does not render period wrapper when period slot is empty', () => {
    const wrapper = factory({}, { price: '$29' })
    expect(wrapper.find('[data-rig-pricing-card-period]').exists()).toBe(false)
  })

  it('renders description slot', () => {
    const wrapper = factory({}, { description: '<p id="desc">Perfect for teams</p>' })
    expect(wrapper.find('[data-rig-pricing-card-description]').exists()).toBe(true)
    expect(wrapper.find('#desc').text()).toBe('Perfect for teams')
  })

  it('does not render description wrapper when slot is empty', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card-description]').exists()).toBe(false)
  })

  it('renders features slot', () => {
    const wrapper = factory({}, { features: '<ul><li id="feat-1">Unlimited projects</li></ul>' })
    expect(wrapper.find('[data-rig-pricing-card-features]').exists()).toBe(true)
    expect(wrapper.find('#feat-1').text()).toBe('Unlimited projects')
  })

  it('does not render features wrapper when slot is empty', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card-features]').exists()).toBe(false)
  })

  it('renders cta slot', () => {
    const wrapper = factory({}, { cta: '<button id="cta-btn">Get started</button>' })
    expect(wrapper.find('[data-rig-pricing-card-cta]').exists()).toBe(true)
    expect(wrapper.find('#cta-btn').text()).toBe('Get started')
  })

  it('does not render cta wrapper when slot is empty', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card-cta]').exists()).toBe(false)
  })

  it('renders footer slot', () => {
    const wrapper = factory({}, { footer: '<p id="footer-note">30-day guarantee</p>' })
    expect(wrapper.find('[data-rig-pricing-card-footer]').exists()).toBe(true)
    expect(wrapper.find('#footer-note').text()).toBe('30-day guarantee')
  })

  it('does not render footer wrapper when slot is empty', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card-footer]').exists()).toBe(false)
  })

  it('renders badge slot', () => {
    const wrapper = factory({}, { badge: '<span id="badge">Most popular</span>' })
    expect(wrapper.find('[data-rig-pricing-card-badge]').exists()).toBe(true)
    expect(wrapper.find('#badge').text()).toBe('Most popular')
  })

  it('does not render badge wrapper when slot is empty', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card-badge]').exists()).toBe(false)
  })

  it('renders all slots together', () => {
    const wrapper = factory(
      { featured: true },
      {
        badge: '<span>Best value</span>',
        title: '<h3>Enterprise</h3>',
        price: '<span>$199</span>',
        period: '/ month',
        description: '<p>For large organizations</p>',
        features: '<ul><li>Everything in Pro</li></ul>',
        cta: '<button>Contact sales</button>',
        footer: '<p>Custom billing available</p>',
      },
    )
    expect(wrapper.find('[data-rig-pricing-card-badge]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-title]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-price]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-period]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-description]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-features]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-cta]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card-footer]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pricing-card]').attributes('data-featured')).toBe('true')
  })

  it('always renders header section', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-pricing-card-header]').exists()).toBe(true)
  })

  it('reacts to featured prop changes', async () => {
    const wrapper = mount(PricingCard, { props: { featured: false } })
    expect(wrapper.find('[data-rig-pricing-card]').attributes('data-featured')).toBeUndefined()
    await wrapper.setProps({ featured: true })
    expect(wrapper.find('[data-rig-pricing-card]').attributes('data-featured')).toBe('true')
  })
})
