import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContentViewer from './ContentViewer.vue'

describe('ContentViewer', () => {
  it('renders with data-rig-content-viewer', () => {
    const wrapper = mount(ContentViewer)
    expect(wrapper.find('[data-rig-content-viewer]').exists()).toBe(true)
  })

  it('renders body area', () => {
    const wrapper = mount(ContentViewer)
    expect(wrapper.find('[data-rig-content-viewer-body]').exists()).toBe(true)
  })

  it('shows default empty text when no content', () => {
    const wrapper = mount(ContentViewer)
    expect(wrapper.find('[data-rig-content-viewer-empty]').text()).toBe('No content')
  })

  it('renders default slot content', () => {
    const wrapper = mount(ContentViewer, {
      slots: { default: '<article>Article text</article>' },
    })
    expect(wrapper.find('[data-rig-content-viewer-body] article').text()).toBe('Article text')
  })

  it('shows edit button when editable', () => {
    const wrapper = mount(ContentViewer, { props: { editable: true } })
    const btn = wrapper.find('[data-rig-content-viewer-header] button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('Edit')
  })

  it('uses custom editLabel', () => {
    const wrapper = mount(ContentViewer, {
      props: { editable: true, editLabel: 'Modify' },
    })
    const btn = wrapper.find('[data-rig-content-viewer-header] button')
    expect(btn.text()).toBe('Modify')
  })

  it('emits edit on edit button click', async () => {
    const wrapper = mount(ContentViewer, { props: { editable: true } })
    const btn = wrapper.find('[data-rig-content-viewer-header] button')
    await btn.trigger('click')
    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  it('renders editor slot instead of view when provided', () => {
    const wrapper = mount(ContentViewer, {
      slots: { editor: '<textarea>Editing</textarea>' },
    })
    expect(wrapper.find('textarea').text()).toBe('Editing')
    expect(wrapper.find('[data-rig-content-viewer-body]').exists()).toBe(false)
  })

  it('renders header slot', () => {
    const wrapper = mount(ContentViewer, {
      slots: { header: '<h1>Title</h1>' },
    })
    expect(wrapper.find('[data-rig-content-viewer-scroll] h1').text()).toBe('Title')
  })

  it('renders empty slot', () => {
    const wrapper = mount(ContentViewer, {
      slots: { empty: '<p>Nothing here</p>' },
    })
    expect(wrapper.find('p').text()).toBe('Nothing here')
  })

  it('renders breadcrumbs when provided', () => {
    const breadcrumbs = [
      { id: 'root', label: 'Home' },
      { id: 'page', label: 'Page' },
    ]
    const wrapper = mount(ContentViewer, { props: { breadcrumbs } })
    expect(wrapper.find('[data-rig-content-viewer-breadcrumbs]').exists()).toBe(true)
  })

  it('hides breadcrumbs when not provided', () => {
    const wrapper = mount(ContentViewer)
    expect(wrapper.find('[data-rig-content-viewer-breadcrumbs]').exists()).toBe(false)
  })
})
