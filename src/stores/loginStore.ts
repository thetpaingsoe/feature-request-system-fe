import api from '@/services/api'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router';

export const useLoginStore = defineStore('login-store', {
state: () => ({
    processing: false,
    isFormReady: false,
    form: {
      email: '',
      password: '',
    },
    formError: {
      email: '',
      password: '',
      server: '',
    },
    
  }),
  actions: {
        submit(router: Router) {
            // const router = useRouter();
            
            router.push({ name: 'entry' });
        }
  }
});