import api from '@/services/api'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user-store', {
    state: () => ({
        processing: false,
        isFormReady: false,
        form: {
            email: 'user1@gmail.com',
            password: 'user12345',
        },
        formError: {
            email: '',
            password: '',
            server: '',
        },
        user: null,
        isAuthenticated : false
    
    }),
    actions: {
        async login() {
            this.processing = true;
            try {
                const email = this.form.email;
                const password = this.form.password;
                const response = await api.post('/api/login', { email : email, password: password});

                localStorage.setItem("auth_token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                
                this.user = response.data.user;
                this.isAuthenticated = true;

                return response.data.user;
            } catch (err : any) {
                console.error(err);
                console.log(err.response?.data?.message || err.message)
                this.formError.server = err.response?.data?.message || err.message
            } finally {
                this.processing = false;
            }
        },

        async logout() {
            try {
                const data = await api.post('/api/logout');
                localStorage.removeItem("auth_token");
                this.user = null;
                this.isAuthenticated = false;
                
            } catch (err : any) {
                console.error(err);
                console.log(err.response?.data?.message || err.message)
                this.formError.server = err.response?.data?.message || err.message
            } finally {
                this.processing = false;
                localStorage.removeItem("auth_token");
            }
        },

        async fetchUser() {
            try {
                const response = await api.get('/api/user');
                this.user = response.data;
                this.isAuthenticated = true;
                // console.log(this.user);
            } catch (err) {
                this.user = null;
                this.isAuthenticated = false;
            }
        }
  }
});