import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './App.vue'

describe('App', () => {
  it('expands the header search and filters tools', async () => {
    const wrapper = mount(App)

    expect(wrapper.find('input[type="search"]').exists()).toBe(false)

    await wrapper.get('.header-search-trigger').trigger('click')
    const searchInput = wrapper.get('input[type="search"]')
    await searchInput.setValue('JSON')

    expect(wrapper.findAll('.tool-card')).toHaveLength(1)
    expect(wrapper.get('.tool-card').text()).toContain('JSON 格式化')
  })

  it('collapses an empty search when it loses focus', async () => {
    const wrapper = mount(App)

    await wrapper.get('.header-search-trigger').trigger('click')
    await wrapper.get('input[type="search"]').trigger('blur')

    expect(wrapper.find('input[type="search"]').exists()).toBe(false)
  })

  it('uses the compact hero copy', () => {
    const wrapper = mount(App)

    expect(wrapper.get('.hero').text()).toContain('简单、直接、随手可用')
    expect(wrapper.get('.hero').text()).not.toContain('ONLINE TOOLBOX')
  })
})
