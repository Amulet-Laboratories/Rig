import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatLine from './StatLine.vue'

describe('StatLine', () => {
  it('renders with data-rig-stat-row', () => {
    const wrapper = mount(StatLine, { props: { label: 'Income', value: '$5k' } })
    expect(wrapper.find('[data-rig-stat-row]').exists()).toBe(true)
  })

  it('displays label and value', () => {
    const wrapper = mount(StatLine, { props: { label: 'Users', value: '1,234' } })
    expect(wrapper.find('[data-rig-stat-row-label]').text()).toBe('Users')
    expect(wrapper.find('[data-rig-stat-row-value]').text()).toBe('1,234')
  })

  it('applies tone data attribute', () => {
    const wrapper = mount(StatLine, { props: { label: 'X', value: '0', tone: 'success' } })
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-tone')).toBe('success')
  })

  it('defaults tone to default', () => {
    const wrapper = mount(StatLine)
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-tone')).toBe('default')
  })

  it('applies separator attribute', () => {
    const wrapper = mount(StatLine, { props: { separator: true } })
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-separator')).not.toBeUndefined()
  })

  it('omits separator attribute when false', () => {
    const wrapper = mount(StatLine, { props: { separator: false } })
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-separator')).toBeUndefined()
  })

  it('applies bold attribute', () => {
    const wrapper = mount(StatLine, { props: { bold: true } })
    expect(wrapper.find('[data-rig-stat-row]').attributes('data-bold')).not.toBeUndefined()
  })

  it('renders label slot', () => {
    const wrapper = mount(StatLine, {
      slots: { label: '<em>Custom</em>' },
    })
    expect(wrapper.find('[data-rig-stat-row-label] em').text()).toBe('Custom')
  })

  it('renders default slot as value', () => {
    const wrapper = mount(StatLine, {
      slots: { default: '<strong>$42</strong>' },
    })
    expect(wrapper.find('[data-rig-stat-row-value] strong').text()).toBe('$42')
  })

  it('reacts to prop updates', async () => {
    const wrapper = mount(StatLine, { props: { label: 'A', value: '1' } })
    expect(wrapper.find('[data-rig-stat-row-value]').text()).toBe('1')
    await wrapper.setProps({ value: '2' })
    expect(wrapper.find('[data-rig-stat-row-value]').text()).toBe('2')
  })
})
