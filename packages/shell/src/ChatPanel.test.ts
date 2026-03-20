import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatPanel from './ChatPanel.vue'

const messages = [
  { id: '1', role: 'user' as const, content: 'Hello' },
  { id: '2', role: 'assistant' as const, content: 'Hi there' },
]

describe('ChatPanel', () => {
  it('renders with data-rig-chat-panel', () => {
    const wrapper = mount(ChatPanel)
    expect(wrapper.find('[data-rig-chat-panel]').exists()).toBe(true)
  })

  it('renders header with default title', () => {
    const wrapper = mount(ChatPanel)
    expect(wrapper.find('[data-rig-chat-panel-title]').text()).toBe('Chat')
  })

  it('renders custom title', () => {
    const wrapper = mount(ChatPanel, { props: { title: 'Assistant' } })
    expect(wrapper.find('[data-rig-chat-panel-title]').text()).toBe('Assistant')
  })

  it('shows empty state when no messages', () => {
    const wrapper = mount(ChatPanel)
    expect(wrapper.find('[data-rig-chat-panel-empty]').text()).toBe('No messages yet.')
  })

  it('renders messages', () => {
    const wrapper = mount(ChatPanel, { props: { messages } })
    const msgElements = wrapper.findAll('[data-rig-chat-panel-message]')
    expect(msgElements).toHaveLength(2)
  })

  it('sets data-role on messages', () => {
    const wrapper = mount(ChatPanel, { props: { messages } })
    const msgElements = wrapper.findAll('[data-rig-chat-panel-message]')
    expect(msgElements[0].attributes('data-role')).toBe('user')
    expect(msgElements[1].attributes('data-role')).toBe('assistant')
  })

  it('renders message content', () => {
    const wrapper = mount(ChatPanel, { props: { messages } })
    const contents = wrapper.findAll('[data-rig-chat-panel-message-content]')
    expect(contents[0].text()).toBe('Hello')
    expect(contents[1].text()).toBe('Hi there')
  })

  it('shows clear button when messages exist', () => {
    const wrapper = mount(ChatPanel, { props: { messages } })
    const header = wrapper.find('[data-rig-chat-panel-header]')
    const btn = header.findAll('button').find((b) => b.text() === 'clear')
    expect(btn?.exists()).toBe(true)
  })

  it('hides clear button when no messages', () => {
    const wrapper = mount(ChatPanel)
    const header = wrapper.find('[data-rig-chat-panel-header]')
    const btn = header.findAll('button').find((b) => b.text() === 'clear')
    expect(btn).toBeUndefined()
  })

  it('emits clear on clear button click', async () => {
    const wrapper = mount(ChatPanel, { props: { messages } })
    const header = wrapper.find('[data-rig-chat-panel-header]')
    const btn = header.findAll('button').find((b) => b.text() === 'clear')!
    await btn.trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('shows pending indicator when pending', () => {
    const wrapper = mount(ChatPanel, { props: { pending: true } })
    expect(wrapper.find('[data-rig-chat-panel-pending]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-chat-panel-pending]').text()).toBe('thinking...')
  })

  it('hides pending indicator when not pending', () => {
    const wrapper = mount(ChatPanel)
    expect(wrapper.find('[data-rig-chat-panel-pending]').exists()).toBe(false)
  })

  it('has log role on messages container', () => {
    const wrapper = mount(ChatPanel)
    expect(wrapper.find('[data-rig-chat-panel-messages]').attributes('role')).toBe('log')
  })

  it('has aria-label on messages container', () => {
    const wrapper = mount(ChatPanel)
    expect(wrapper.find('[data-rig-chat-panel-messages]').attributes('aria-label')).toBe(
      'Chat messages',
    )
  })

  it('emits send on Enter keypress', async () => {
    const wrapper = mount(ChatPanel)
    const input = wrapper.find('[data-rig-chat-panel-input] input')
    await input.setValue('test message')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('send')?.[0]).toEqual(['test message'])
  })

  it('does not emit send when input is empty', async () => {
    const wrapper = mount(ChatPanel)
    const input = wrapper.find('[data-rig-chat-panel-input] input')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('send')).toBeUndefined()
  })

  it('emits send on Send button click', async () => {
    const wrapper = mount(ChatPanel)
    const input = wrapper.find('[data-rig-chat-panel-input] input')
    await input.setValue('hello')
    const sendBtn = wrapper
      .findAll('[data-rig-chat-panel-input] button')
      .find((b) => b.text() === 'Send')!
    await sendBtn.trigger('click')
    expect(wrapper.emitted('send')?.[0]).toEqual(['hello'])
  })

  it('disables input when pending', () => {
    const wrapper = mount(ChatPanel, { props: { pending: true } })
    const input = wrapper.find('[data-rig-chat-panel-input] input')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('renders header slot', () => {
    const wrapper = mount(ChatPanel, {
      slots: { header: '<span>Custom Header</span>' },
    })
    expect(wrapper.find('[data-rig-chat-panel-header] span').text()).toBe('Custom Header')
  })
})
