import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useFeatureRequestStore } from '@/stores/featureRequestStore';
import api from '@/services/api'; // Import the actual api service

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(), // Mock the post method
  },
}));

describe('useFeatureRequestStore', () => {
  let store: ReturnType<typeof useFeatureRequestStore>;

  beforeEach(() => {
    setActivePinia(createPinia()); // Create a fresh Pinia instance for each test
    store = useFeatureRequestStore(); // Get a fresh store instance
    store.$reset(); // Reset the store to its initial state before each test
    vi.clearAllMocks(); // Clear any mock call history
  });

  // --- State and Processing Tests ---
  it('initializes with correct default state', () => {
    expect(store.processing).toBe(false);
    expect(store.isFormReady).toBe(false);
    expect(store.form).toEqual({
      title: '',
      email: '',
      description: '',
    });
    expect(store.formError).toEqual({
      title: '',
      email: '',
      description: '',
      server: '',
    });
  });

  it('startProcessing sets processing to true', () => {
    store.startProcessing();
    expect(store.processing).toBe(true);
  });

  it('endProcessing sets processing to false', () => {
    store.processing = true; // Set to true first
    store.endProcessing();
    expect(store.processing).toBe(false);
  });

  // --- Validation Tests ---
  describe('validate action', () => {
    it('returns true and clears errors for valid form data', () => {
      store.form.title = 'Valid Title';
      store.form.email = 'test@example.com';
      store.form.description = 'Valid description.';
      store.formError.title = 'Previous error'; // Simulate previous error
      store.formError.email = 'Previous error';
      store.formError.description = 'Previous error';

      const isValid = store.validate();

      expect(isValid).toBe(true);
      expect(store.isFormReady).toBe(true);
      expect(store.formError.title).toBe('');
      expect(store.formError.email).toBe('');
      expect(store.formError.description).toBe('');
    });

    // Email validation
    it('sets email error for empty email', () => {
      store.form.email = '';
      store.form.title = 'a';
      store.form.description = 'a';
      const isValid = store.validate();
      expect(isValid).toBe(false);
      expect(store.isFormReady).toBe(false);
      expect(store.formError.email).toBe('Please input email.');
    });

    it('sets email error for invalid email format', () => {
      store.form.email = 'invalid-email';
      store.form.title = 'a';
      store.form.description = 'a';
      const isValid = store.validate();
      expect(isValid).toBe(false);
      expect(store.isFormReady).toBe(false);
      expect(store.formError.email).toBe('Please input valid email.');
    });

    it('sets email error for email exceeding 255 characters', () => {
      store.form.email = 'a'.repeat(250) + '@example.com'; // 250 + 10 = 260 chars
      store.form.title = 'a';
      store.form.description = 'a';
      const isValid = store.validate();
      expect(isValid).toBe(false);
      expect(store.isFormReady).toBe(false);
      expect(store.formError.email).toBe('Email cannot exceed 255 characters.');
    });

    // Title validation
    it('sets title error for empty title', () => {
      store.form.title = '';
      store.form.email = 'test@example.com';
      store.form.description = 'a';
      const isValid = store.validate();
      expect(isValid).toBe(false);
      expect(store.isFormReady).toBe(false);
      expect(store.formError.title).toBe('Please input title.');
    });

    it('sets title error for title exceeding 500 characters', () => {
      store.form.title = 'a'.repeat(501);
      store.form.email = 'test@example.com';
      store.form.description = 'a';
      const isValid = store.validate();
      expect(isValid).toBe(false);
      expect(store.isFormReady).toBe(false);
      expect(store.formError.title).toBe('Title cannot exceed 500 characters.');
    });

    // Description validation
    it('sets description error for empty description', () => {
      store.form.description = '';
      store.form.title = 'a';
      store.form.email = 'test@example.com';
      const isValid = store.validate();
      expect(isValid).toBe(false);
      expect(store.isFormReady).toBe(false);
      expect(store.formError.description).toBe('Please input description.');
    });

    it('returns false if any field is invalid', () => {
      store.form.title = ''; // Invalid
      store.form.email = 'test@example.com';
      store.form.description = 'Valid description.';
      const isValid = store.validate();
      expect(isValid).toBe(false);
    });
  });

  // --- Reset Form Tests ---
  it('resetForm clears form data and errors', () => {
    store.form = {
      title: 'Test',
      email: 'test@example.com',
      description: 'Desc',
    };
    store.formError = {
      title: 'Error',
      email: 'Error',
      description: 'Error',
      server: 'Server Error',
    };
    store.processing = true; // Should not be reset by resetForm

    store.resetForm();

    expect(store.form).toEqual({
      title: '',
      email: '',
      description: '',
    });
    expect(store.formError).toEqual({
      title: '',
      email: '',
      description: '',
      server: '',
    });
    expect(store.processing).toBe(true); // Should remain true
  });

  // --- Submit Feature Request Tests ---
  describe('submitFeatureRequest action', () => {
    const mockFormData = {
      title: 'Submit Test',
      email: 'submit@example.com',
      description: 'Submitting a test feature request.',
    };

    beforeEach(() => {
      store.form = { ...mockFormData }; // Pre-fill form for submission tests
    });

    it('calls api.post and resets form on successful submission', async () => {
      const mockResponseData = { id: 1, ...mockFormData, status: 'pending' };
      (api.post as Mock).mockResolvedValue({ data: mockResponseData });

      store.processing = false; // Ensure initial state is not processing

      const result = await store.submitFeatureRequest();

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith('/feature-requests', mockFormData);
      expect(store.formError.server).toBe(''); // Server error should be cleared
      expect(store.processing).toBe(false); // Should be false in finally block
      expect(store.form).toEqual({ title: '', email: '', description: '' }); // Form should be reset
      expect(result).toEqual(mockResponseData); // Should return response data
    });

    it('sets server error and does not reset form on failed submission', async () => {
      const errorMessage = 'Network Error';
      const mockErrorResponse = {
        response: {
          data: {
            message: 'Validation failed on server.',
            errors: { email: ['Email already taken.'] },
          },
        },
        message: 'Request failed with status code 422',
      };
      (api.post as Mock).mockRejectedValue(mockErrorResponse);

      store.processing = false;

      const result = await store.submitFeatureRequest();

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith('/feature-requests', mockFormData);
      expect(store.formError.server).toBe('Validation failed on server.'); // Should set server error
      expect(store.processing).toBe(false); // Should be false in finally block
      expect(store.form).toEqual(mockFormData); // Form should NOT be reset on failure
      expect(result).toBeUndefined(); // Should not return data on failure
    });

    it('sets generic error message if response.data.message is missing', async () => {
      const mockErrorResponse = {
        response: {
          data: {}, // No message property
        },
        message: 'Generic network error message',
      };
      (api.post as Mock).mockRejectedValue(mockErrorResponse);

      await store.submitFeatureRequest();

      expect(store.formError.server).toBe('Generic network error message');
    });

    it('sets generic error message if err.response is missing', async () => {
      const mockErrorResponse = new Error('Just a plain error');
      (api.post as Mock).mockRejectedValue(mockErrorResponse);

      await store.submitFeatureRequest();

      expect(store.formError.server).toBe('Just a plain error');
    });

    it('ensures processing is false even if an error occurs', async () => {
      (api.post as Mock).mockRejectedValue(new Error('Test Error'));
      store.processing = true; // Set to true before call

      await store.submitFeatureRequest();

      expect(store.processing).toBe(false); // Should be false after finally
    });
  });
});
