import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumbs from './Breadcrumbs.vue'

const items = [
  { id: 'root', label: 'Home' },
  { id: 'dir', label: 'src' },
  { id: 'file', label: 'App.vue' },
]

describe('Breadcrumbs', () => {
  it('renders with data-rig-breadcrumbs and breadcrumb aria-label', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    expect(wrapper.attributes('data-rig-breadcrumbs')).toBeDefined()
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('renders all segments', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    expect(wrapper.findAll('[data-rig-breadcrumbs-item]')).toHaveLength(3)
  })

  it('marks last item as current page', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    const current = wrapper.find('[data-rig-breadcrumbs-current]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('App.vue')
    expect(current.attributes('aria-current')).toBe('page')
  })

  it('renders non-last items as buttons', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    const links = wrapper.findAll('[data-rig-breadcrumbs-link]')
    expect(links).toHaveLength(2)
  })

  it('emits select on segment click', async () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    await wrapper.findAll('[data-rig-breadcrumbs-link]')[0]!.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['root'])
  })

  it('renders separators between items', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    const seps = wrapper.findAll('[data-rig-breadcrumbs-separator]')
    expect(seps).toHaveLength(2)
    expect(seps[0]!.text()).toBe('/')
  })

  it('uses custom separator', () => {
    const wrapper = mount(Breadcrumbs, { props: { items, separator: '>' } })
    const seps = wrapper.findAll('[data-rig-breadcrumbs-separator]')
    expect(seps[0]!.text()).toBe('>')
  })

  it('does not emit select on Escape keydown', async () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('can focus a breadcrumb link button', () => {
    const wrapper = mount(Breadcrumbs, { props: { items }, attachTo: document.body })
    const link = wrapper.find('[data-rig-breadcrumbs-link]')
    ;(link.element as HTMLElement).focus()
    expect(document.activeElement).toBe(link.element)
    wrapper.unmount()
  })

  it('updates separator text when separator prop changes', async () => {
    const wrapper = mount(Breadcrumbs, { props: { items, separator: '/' } })
    expect(wrapper.find('[data-rig-breadcrumbs-separator]').text()).toBe('/')
    await wrapper.setProps({ separator: '>' })
    expect(wrapper.find('[data-rig-breadcrumbs-separator]').text()).toBe('>')
  })
})
