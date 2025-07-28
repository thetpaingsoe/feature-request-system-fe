import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import SubmissionEntryView from '../SubmissionEntryView.vue'
import { useSubmissionStore } from '@/stores/submissionStore'

describe('Testing Home View', () => {
  let pinia // Declare pinia variable
    let store // Declare store variable
  
    beforeEach(() => {
      // 1. Create a new Pinia instance before each test
      pinia = createPinia()
      // 2. Make this Pinia instance active
      setActivePinia(pinia)
      // 3. Get your store instance after Pinia is active
      store = useSubmissionStore()
  
      // Optional: Reset store state before each test if needed
      store.$reset() // If you have a $reset action in your store
      store.startProcessing = vi.fn(() => { store.processing = true; });
      store.endProcessing = vi.fn(() => { store.processing = false; });
      store.validate = vi.fn(() => true); // Default to valid for most tests
      store.submitFeatureRequest = vi.fn(() => Promise.resolve({ success: true })); // Default mock for successful submission
      store.setFormError = vi.fn(); // Mock setFormError
    })

  it('testing render properly', () => {
    const wrapper = mount(SubmissionEntryView, {})

    expect(wrapper.text()).toContain('Time to start your BVI company!')
    expect(wrapper.text()).toContain(
      'All questions below must be answered. Take your time, and if you need to take a break, the form will save automatically and you can continue later. Good luck!',
    )
  })

})
