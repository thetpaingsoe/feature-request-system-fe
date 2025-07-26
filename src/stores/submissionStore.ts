import api from '@/services/api'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router';
import type { Submission } from '@/types/SubmissionTypes';

export const useSubmissionStore = defineStore('submissions-store', {
    state: () => ({
        processing: false,
        data: [] as Array<Submission>,
        filters : Object,
        sorting : Object,
        paginationInfo : Object
    }),
    actions: {        
        goTo(router: Router, name : string = 'dashboard') {
            console.log(" ➡ " + name);
            router.push({ name: name });
        },
        async fetchSubmissions() {
            try {
                const response = await api.get('/api/submissions');
                this.paginationInfo = response.data.submissionsPagination;
                this.data = response.data.submissionsPagination.data;
                this.filters = response.data.filters;
                this.sorting = response.data.sorting;                
            } catch (err) {
                console.log(err);
            }
        }
  }
});