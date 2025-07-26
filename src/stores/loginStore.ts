import api from '@/services/api'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router';

export const useLoginStore = defineStore('login-store', {
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
        
        goTo(router: Router, name : string = 'dashboard') {
            console.log(" ➡ " + name);
            router.push({ name: name });
        },
        async login() {
            try {
                const email = this.form.email;
                const password = this.form.password;
                const response = await api.post('/api/login', { email : email, password: password});

                localStorage.setItem("auth_token", response.data.token);

                this.user = response.data.user;
                this.isAuthenticated = true;

            } catch (err) {
                console.error(err);
                throw err;
            }
        },

        async logout() {
            const data = await api.post('/api/logout');
            localStorage.setItem("auth_token", '');
            this.user = null;
            this.isAuthenticated = false;
            console.log(data);
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