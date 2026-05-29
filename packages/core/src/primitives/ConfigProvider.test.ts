import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, type Ref } from 'vue'
import ConfigProvider from './ConfigProvider.vue'
import { RigConfigKey, type RigConfig } from '../composables/useConfigProvider'

describe('ConfigProvider', () => {
  it('renders slot content', () => {
    const wrapper = mount(ConfigProvider, {
      slots: { default: '<p>App</p>' },
    })
    expect(wrapper.text()).toBe('App')
  })

  it('provides dir config to children', () => {
    const Child = defineComponent({
      setup() {
        const config = inject<Ref<RigConfig>>(RigConfigKey)
        return { config }
      },
      render() {
        return h('span', this.config?.dir)
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: { dir: 'rtl' },
      slots: { default: () => h(Child) },
    })
    expect(wrapper.find('span').text()).toBe('rtl')
  })

  it('provides locale config to children', () => {
    const Child = defineComponent({
      setup() {
        const config = inject<Ref<RigConfig>>(RigConfigKey)
        return { config }
      },
      render() {
        return h('span', this.config?.locale)
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: { locale: 'fr-FR' },
      slots: { default: () => h(Child) },
    })
    expect(wrapper.find('span').text()).toBe('fr-FR')
  })

  it('provides defaults config to children', () => {
    const Child = defineComponent({
      setup() {
        const config = inject<Ref<RigConfig>>(RigConfigKey)
        return { config }
      },
      render() {
        return h('span', JSON.stringify(this.config?.defaults))
      },
    })

    const defaults = { Button: { size: 'sm' } }
    const wrapper = mount(ConfigProvider, {
      props: { defaults },
      slots: { default: () => h(Child) },
    })
    expect(wrapper.find('span').text()).toContain('"size":"sm"')
  })

  it('renders without error when no props provided', () => {
    const wrapper = mount(ConfigProvider, {
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.text()).toBe('Content')
  })
})
