import api from '@/services/api'
import { defineStore } from 'pinia'

export const useFeatureRequestStore = defineStore('feature-request', {
  state: () => ({
    processing: false,
    isFormReady: false,
    form: {
      title: '',
      email: '',
      description: '',
    },
    formError: {
      title: '',
      email: '',
      description: '',
      server: '',
    },
  }),
  actions: {
    startProcessing() {
      this.processing = true
    },

    endProcessing() {
      this.processing = false
    },

    validate() {
      this.isFormReady = true

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      this.formError.email = '' // Clear previous email error
      if (!this.form.email.trim()) {
        this.formError.email = 'Please input email.'
        this.isFormReady = false
      } else if (!emailRegex.test(this.form.email)) {
        // Only check regex if not empty
        this.formError.email = 'Please input valid email.'
        this.isFormReady = false
      } else if (this.form.email.length > 255) {
        this.formError.email = 'Email cannot exceed 255 characters.'
        this.isFormReady = false
      }

      this.formError.title = ''
      if (!this.form.title.trim()) {
        this.formError.title = 'Please input title.'
        this.isFormReady = false
      } else if (this.form.title.length > 500) {
        this.formError.title = 'Title cannot exceed 500 characters.'
        this.isFormReady = false
      }

      this.formError.description = ''
      if (!this.form.description.trim()) {
        this.formError.description = 'Please input description.'
        this.isFormReady = false
      }

      return this.isFormReady
    },

    resetForm() {
      this.form.title = ''
      this.form.email = ''
      this.form.description = ''

      this.formError.title = ''
      this.formError.email = ''
      this.formError.description = ''

      this.formError.server = ''
    },

    async submitFeatureRequest() {
      this.formError.server = ''
      this.processing = true
      try {
        const response = await api.post('/feature-requests', {
          title: this.form.title,
          email: this.form.email,
          description: this.form.description,
        })

        this.resetForm()

        return response.data
      } catch (err : any) {
        this.formError.server = err.response?.data?.message || err.message
      } finally {
        this.processing = false
      }
    },
  },
})
