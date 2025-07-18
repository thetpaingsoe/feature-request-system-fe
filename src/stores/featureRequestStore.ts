import { defineStore } from 'pinia'

export const useFeatureRequestStore = defineStore('feature-request', {
  state: () => ({
    processing: false,
    form: {
      title: '',
      email: '',
      description: '',
    },
    formError: {
      title: '',
      email: '',
      description: '',
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email.trim()) {
        this.formError.email = 'Please input email.'
      }

      if (!emailRegex.test(this.form.email)) {
        this.formError.email = 'Please input valid email.'
      }

      if (!this.form.title.trim()) {
        this.formError.title = 'Please input title.'
      }

      if (!this.form.description.trim()) {
        this.formError.description = 'Please input description.'
      }

      return false
    },
  },
})
