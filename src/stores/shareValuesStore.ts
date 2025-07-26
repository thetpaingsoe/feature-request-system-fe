import api from '@/services/api'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router';
import { ShareValue } from '@/types/ShareValueTypes';

export const userShareValueStore = defineStore('share-value-store', {
    state: () => ({
        processing: false,
        data: [] as Array<ShareValue>,
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
                const response = await api.get('/api/sharevalues');
                this.paginationInfo = response.data.shareValuesPagination;
                this.data = response.data.shareValuesPagination.data;
                this.filters = response.data.filters;
                this.sorting = response.data.sorting;                
            } catch (err) {
                console.log(err);
            }
        }
  }
});