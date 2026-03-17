import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from './Pagination.vue'

describe('Pagination', () => {
  it('renders with data-rig-pagination', () => {
    const wrapper = mount(Pagination, { props: { total: 50, pageSize: 10 } })
    expect(wrapper.attributes('data-rig-pagination')).not.toBeUndefined()
  })

  it('has role navigation', () => {
    const wrapper = mount(Pagination, { props: { total: 50, pageSize: 10 } })
    expect(wrapper.attributes('role')).toBe('navigation')
  })

  it('renders correct number of page buttons', () => {
    const wrapper = mount(Pagination, { props: { total: 30, pageSize: 10 } })
    const pageButtons = wrapper.findAll('[data-rig-pagination-page]')
    expect(pageButtons).toHaveLength(3)
  })

  it('renders prev and next buttons', () => {
    const wrapper = mount(Pagination, { props: { total: 30, pageSize: 10 } })
    expect(wrapper.find('[data-rig-pagination-prev]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-pagination-next]').exists()).toBe(true)
  })

  it('sets data-active on current page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 2 },
    })
    const pages = wrapper.findAll('[data-rig-pagination-page]')
    expect(pages[1]!.attributes('data-active')).not.toBeUndefined()
    expect(pages[0]!.attributes('data-active')).toBeUndefined()
  })

  it('sets aria-current on active page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 2 },
    })
    const pages = wrapper.findAll('[data-rig-pagination-page]')
    expect(pages[1]!.attributes('aria-current')).toBe('page')
    expect(pages[0]!.attributes('aria-current')).toBeUndefined()
  })

  it('disables prev button on first page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 1 },
    })
    expect(wrapper.find('[data-rig-pagination-prev]').attributes('disabled')).not.toBeUndefined()
  })

  it('disables next button on last page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 3 },
    })
    expect(wrapper.find('[data-rig-pagination-next]').attributes('disabled')).not.toBeUndefined()
  })

  it('emits update:modelValue on page click', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 1 },
    })
    const pages = wrapper.findAll('[data-rig-pagination-page]')
    await pages[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('emits update:modelValue on next click', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 1 },
    })
    await wrapper.find('[data-rig-pagination-next]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('emits update:modelValue on prev click', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 2 },
    })
    await wrapper.find('[data-rig-pagination-prev]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('handles disabled state', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, disabled: true },
    })
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
    const pages = wrapper.findAll('[data-rig-pagination-page]')
    for (const page of pages) {
      expect(page.attributes('disabled')).not.toBeUndefined()
    }
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, modelValue: 1, disabled: true },
    })
    const pages = wrapper.findAll('[data-rig-pagination-page]')
    await pages[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders ellipsis for many pages', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, modelValue: 5 },
    })
    const ellipsis = wrapper.findAll('[data-rig-pagination-ellipsis]')
    expect(ellipsis.length).toBeGreaterThan(0)
  })
})
