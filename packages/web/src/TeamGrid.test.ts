import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamGrid from './TeamGrid.vue'

const members = [
  { id: '1', name: 'Alice', role: 'Engineer', bio: 'Builds things', img: '/alice.jpg' },
  { id: '2', name: 'Bob', role: 'Designer', bio: 'Designs things' },
]

describe('TeamGrid', () => {
  it('renders with data-rig-team-grid', () => {
    const wrapper = mount(TeamGrid, { props: { members } })
    expect(wrapper.find('[data-rig-team-grid]').exists()).toBe(true)
  })

  it('defaults to card layout with 3 columns', () => {
    const wrapper = mount(TeamGrid, { props: { members } })
    const el = wrapper.find('[data-rig-team-grid]')
    expect(el.attributes('data-layout')).toBe('card')
    expect(el.attributes('data-columns')).toBe('3')
  })

  it('renders correct number of members', () => {
    const wrapper = mount(TeamGrid, { props: { members } })
    expect(wrapper.findAll('[data-rig-team-grid-member]')).toHaveLength(2)
  })

  it('renders member names', () => {
    const wrapper = mount(TeamGrid, { props: { members } })
    const names = wrapper.findAll('[data-rig-team-grid-name]')
    expect(names[0]!.text()).toBe('Alice')
    expect(names[1]!.text()).toBe('Bob')
  })

  it('renders roles', () => {
    const wrapper = mount(TeamGrid, { props: { members } })
    const roles = wrapper.findAll('[data-rig-team-grid-role]')
    expect(roles[0]!.text()).toBe('Engineer')
  })

  it('renders bio', () => {
    const wrapper = mount(TeamGrid, { props: { members } })
    const bios = wrapper.findAll('[data-rig-team-grid-bio]')
    expect(bios[0]!.text()).toBe('Builds things')
  })

  it('renders photo with alt text', () => {
    const wrapper = mount(TeamGrid, { props: { members } })
    const img = wrapper.find('[data-rig-team-grid-img]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Photo of Alice')
    expect(img.attributes('loading')).toBe('lazy')
  })

  it('hides photo section when no img provided', () => {
    const noPhoto = [{ id: '1', name: 'Eve', role: 'Manager' }]
    const wrapper = mount(TeamGrid, { props: { members: noPhoto } })
    expect(wrapper.find('[data-rig-team-grid-photo]').exists()).toBe(false)
  })

  it('accepts horizontal layout', () => {
    const wrapper = mount(TeamGrid, { props: { members, layout: 'horizontal' } })
    expect(wrapper.find('[data-rig-team-grid]').attributes('data-layout')).toBe('horizontal')
  })

  it('accepts compact layout', () => {
    const wrapper = mount(TeamGrid, { props: { members, layout: 'compact' } })
    expect(wrapper.find('[data-rig-team-grid]').attributes('data-layout')).toBe('compact')
  })

  it('accepts custom columns', () => {
    const wrapper = mount(TeamGrid, { props: { members, columns: 2 } })
    expect(wrapper.find('[data-rig-team-grid]').attributes('data-columns')).toBe('2')
  })
})
