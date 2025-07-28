import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useFeatureRequestStore } from '@/stores/featureRequestStore'
import FeatureRequestView from '../FeatureRequestView.vue'

vi.mock('lucide-vue-next', () => ({
  LoaderCircle: { template: '<div>LoaderCircle</div>' },
}));

// Mocking reka-ui Dialog components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: { template: '<div class="mock-dialog"><slot /></div>' },
  DialogContent: { template: '<div class="mock-dialog-content"><slot /></div>' },
  DialogHeader: { template: '<div class="mock-dialog-header"><slot /></div>' },
  DialogTitle: { template: '<h2 class="mock-dialog-title"><slot /></h2>' },
  DialogDescription: { template: '<p class="mock-dialog-description"><slot /></p>' },
  DialogFooter: { template: '<div class="mock-dialog-footer"><slot /></div>' },
  DialogClose: { template: '<button class="mock-dialog-close"><slot /></button>' },
  DialogTrigger: { template: '<button class="mock-dialog-trigger"><slot /></button>' },
}));

vi.mock('@/components/InputError.vue', () => ({
  default: {
    props: ['message'],
    template: '<div class="input-error">{{ message }}</div>',
  },
}));
vi.mock('@/components/ui/button/Button.vue', () => ({
  default: {
    props: ['disabled'],
    template: '<button :disabled="disabled" class="mock-button"><slot /></button>',
  },
}));
vi.mock('@/components/ui/input/Input.vue', () => ({
  default: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<input class="mock-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
}));
vi.mock('@/components/ui/label/Label.vue', () => ({
  default: {
    template: '<label class="mock-label"><slot /></label>',
  },
}));
vi.mock('@/components/ui/textarea/TextArea.vue', () => ({
  default: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<textarea class="mock-textarea" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
  },
}));

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
    store.startProcessing = vi.fn(() => { store.processing = true; });
    store.endProcessing = vi.fn(() => { store.processing = false; });
    store.validate = vi.fn(() => true); // Default to valid for most tests
    store.submitFeatureRequest = vi.fn(() => Promise.resolve({ success: true })); // Default mock for successful submission
    store.setFormError = vi.fn(); // Mock setFormError
  })

  it('testing render properly', () => {
    const wrapper = mount(FeatureRequestView, {
      global: {
        plugins: [pinia], // Provide the Pinia instance to the mounted component
      },
    })

    expect(wrapper.text()).toContain('Feature Request Form')
  })

  it('binds input values to the store correctly', async () => {
    const wrapper = mount(FeatureRequestView, {
      global: {
        plugins: [pinia],
      },
    });

    const titleInput = wrapper.find('#title');
    await titleInput.setValue('New Feature Title');
    expect(store.form.title).toBe('New Feature Title');

    const emailInput = wrapper.find('#email');
    await emailInput.setValue('test@example.com');
    expect(store.form.email).toBe('test@example.com');

    const descriptionInput = wrapper.find('#description');
    await descriptionInput.setValue('Detailed description here.');
    expect(store.form.description).toBe('Detailed description here.');
  });

  it('shows client-side validation errors when validate fails', async () => {
    store.validate.mockReturnValue(false); // Force validation to fail
    store.formError.title = 'Title is required'; // Simulate an error being set by the store

    const wrapper = mount(FeatureRequestView, {
      global: {
        plugins: [pinia],
      },
    });

    await wrapper.find('.mock-button').trigger('click');
    await nextTick();

    expect(store.startProcessing).toHaveBeenCalled();
    expect(store.validate).toHaveBeenCalled();
    expect(store.submitFeatureRequest).not.toHaveBeenCalled(); // Should not submit if validation fails
    expect(store.endProcessing).toHaveBeenCalled();

    expect(wrapper.find('.input-error').text()).toContain('Title is required');
  });

  it('submits the form and opens the success dialog on successful submission', async () => {
    // Mock a successful submission response
    store.submitFeatureRequest.mockResolvedValue({ success: true, data: { id: 1 } });
    store.validate.mockReturnValue(true); // Ensure validation passes

    const wrapper = mount(FeatureRequestView, {
      global: {
        plugins: [pinia],
      },
    });

    // Initial state: dialog should be closed
    expect(wrapper.vm.isDialogOpen).toBe(false);

    await wrapper.find('.mock-button').trigger('click');
    await nextTick(); // Wait for promise resolution and DOM update

    expect(store.startProcessing).toHaveBeenCalled();
    expect(store.validate).toHaveBeenCalled();
    expect(store.submitFeatureRequest).toHaveBeenCalled();
    expect(store.endProcessing).toHaveBeenCalled();

    // Check if dialog is open
    expect(wrapper.vm.isDialogOpen).toBe(true);
    expect(wrapper.find('.mock-dialog-title').text()).toContain('Successfully Sent!');
    expect(wrapper.find('.mock-dialog-description').text()).toContain('Your request has been successfully sent');
  });

  it('handles submission failure (server error) and displays error', async () => {
    // Mock a failed submission response (e.g., data is null or error message is set)
    store.submitFeatureRequest.mockResolvedValue(null); // Simulate API returning null on error
    store.validate.mockReturnValue(true); // Ensure validation passes
    store.formError.server = 'Server error occurred.'; // Simulate server error being set by store

    const wrapper = mount(FeatureRequestView, {
      global: {
        plugins: [pinia],
      },
    });

    await wrapper.find('.mock-button').trigger('click');
    await nextTick();

    expect(store.startProcessing).toHaveBeenCalled();
    expect(store.validate).toHaveBeenCalled();
    expect(store.submitFeatureRequest).toHaveBeenCalled();
    expect(store.endProcessing).toHaveBeenCalled();

    // Dialog should not open on failure
    expect(wrapper.vm.isDialogOpen).toBe(false);
    expect(wrapper.find('.input-error.h-10').text()).toContain('Server error occurred.');
  });

  it('closes the success dialog when OK button is clicked', async () => {
    store.submitFeatureRequest.mockResolvedValue({ success: true, data: { id: 1 } });
    store.validate.mockReturnValue(true);

    const wrapper = mount(FeatureRequestView, {
      global: {
        plugins: [pinia],
      },
    });

    // Trigger submission to open dialog
    await wrapper.find('.mock-button').trigger('click');
    await nextTick();
    expect(wrapper.vm.isDialogOpen).toBe(true);

    // Click the OK button in the dialog
    const okButton = wrapper.find('#dialog-ok-button');
    
    await okButton.trigger('click');
    await nextTick();

    expect(wrapper.vm.isDialogOpen).toBe(false);
  });

  it('disables the submit button when processing', async () => {
    store.processing = true; // Manually set processing to true
    const wrapper = mount(FeatureRequestView, {
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.find('.mock-button').attributes('disabled')).toBeDefined();

    store.processing = false; // Manually set processing to false
    await nextTick();
    expect(wrapper.find('.mock-button').attributes('disabled')).toBeUndefined();
  });
})
