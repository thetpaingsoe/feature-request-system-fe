import api from '@/services/api'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router';
import type { FormDataStructure, Submission } from '@/types/SubmissionTypes';

export const useSubmissionStore = defineStore('submissions-store', {
    state: () => ({
        processing: false,
        data: [] as Array<Submission>, // This is for List
        filters : Object,
        sorting : Object,
        paginationInfo : Object,
        formError: {
            server: '',
        },
        formData : {
            company_detail: {},
            shareholders: [],
            beneficial_owners: [],
            directors: [],
        } as FormDataStructure,
        getData : { // This is for Get by ID
            data : {} as Submission, 
            error : ''
        },
        dialog : {
            open : false,
            title : '',
            message : '',
            button : "OK",
            action : () => {}
        }
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
        },
        resetDialog() {
            this.dialog = {
                open : false,
                title : '',
                message : '',
                button : "OK",
                action : () => {}
            }
        },
        async fetchSubmission(id : string) {
            this.getData.error = '';
            this.resetDialog()
            try {
                const response = await api.get('/api/submissions/'  + id);
                this.getData.data = response.data;
                console.log(response.data);
            } catch (err: any) {
                console.log(err.response?.data?.message || err.message)
                this.getData.error = err.response?.data?.message || err.message
                
            }
        },
        async postSubmission() {
            this.formError.server = ''
            this.processing = true
            try {
                console.log(this.formData.company_detail.full_name)
               const response = await api.post('/api/submissions', {
                    full_name: this.formData.company_detail.full_name,
                    email: this.formData.company_detail.email,
                    company_name: this.formData.company_detail.company_name,
                    alternative_company_name: this.formData.company_detail.alternative_company_name,
                    company_designation_id: this.formData.company_detail.company_designation_id,
                    jurisdiction_of_operation_id: this.formData.company_detail.jurisdiction_of_operation_id,
                    target_jurisdictions: this.formData.company_detail.target_jurisdictions,
                    number_of_shares: this.formData.company_detail.number_of_shares,
                    are_all_shares_issued: this.formData.company_detail.are_all_shares_issued,
                    number_of_issued_shares: this.formData.company_detail.number_of_issued_shares,
                    share_value_id: this.formData.company_detail.share_value_id,
                    shareholders: this.formData.shareholders,
                    beneficial_owners: this.formData.beneficial_owners,
                    directors: this.formData.directors
                });
                
                return response.data;
            } catch (err : any) {
                console.log(err.response?.data?.message || err.message)
                this.formError.server = err.response?.data?.message || err.message
            } finally {
                this.processing = false
            }
        }
  }
});