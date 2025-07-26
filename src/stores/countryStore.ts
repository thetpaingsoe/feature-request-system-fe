import api from '@/services/api'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router';
import { Country } from '@/types/CountryTypes';

export const useCountryStore = defineStore('country-store', {
    state: () => ({
        processing: false,
        data: [] as Array<Country>,
        filters : Object,
        sorting : Object,
        paginationInfo : Object
    }),
    actions: {        
        goTo(router: Router, name : string = 'dashboard') {
            console.log(" ➡ " + name);
            router.push({ name: name });
        },
        async fetch() {
            try {
                const response = await api.get('/api/countries');
                this.paginationInfo = response.data.countriesPagination;
                this.data = response.data.countriesPagination.data;
                this.filters = response.data.filters;
                this.sorting = response.data.sorting;                
            } catch (err) {
                console.log(err);
            }
        }
  }
});