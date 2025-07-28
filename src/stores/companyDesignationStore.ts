import api from '@/services/api'
import { defineStore } from 'pinia'
import { CompanyDesignation } from '@/types/CompanyDesignationTypes';

export const useCompanyDesignationStore = defineStore('company-designation-store', {
    state: () => ({
        processing: false,
        data: [] as Array<CompanyDesignation>,
        filters : Object,
        sorting : Object,
        paginationInfo : Object
    }),
    actions: {        
        async fetch() {
            try {
                const response = await api.get('/api/desinations');
                this.paginationInfo = response.data.companyDesignationsPagination;
                this.data = response.data.companyDesignationsPagination.data;
                this.filters = response.data.filters;
                this.sorting = response.data.sorting;                
            } catch (err) {
                console.log(err);
            }
        }
  }
});