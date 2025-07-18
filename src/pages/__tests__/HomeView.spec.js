import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useFeatureRequestStore } from '@/stores/featureRequestStore'

describe('Testing Home View', () => {
  let pinia // Declare pinia variable
  let store // Declare store variable

  beforeEach(() => {
    // 1. Create a new Pinia instance before each test
    pinia = createPinia()
    // 2. Make this Pinia instance active
    setActivePinia(pinia)
    // 3. Get your store instance after Pinia is active
    store = useFeatureRequestStore()

    // Optional: Reset store state before each test if needed
    store.$reset() // If you have a $reset action in your store
  })

  it('testing render properly', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia], // Provide the Pinia instance to the mounted component
      },
    })

    expect(wrapper.text()).toContain('Feature Request Form')
  })
})
