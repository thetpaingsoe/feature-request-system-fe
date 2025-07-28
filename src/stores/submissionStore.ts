import api from '@/services/api'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router';
import type { FormDataStructure, Submission, SubmissionPagination} from '@/types/SubmissionTypes';

export const useSubmissionStore = defineStore('submissions-store', {
    state: () => ({
        processing: false,
        data: [] as Array<Submission>, // This is for List
        filters : Object,
        sorting : Object,
        paginationInfo : {} as SubmissionPagination,
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
            isLoading : false,
            data : {} as Submission, 
            error : ''
        },
        dialog : {
            open : false,
            title : '',
            message : '',
            button : "OK",
            action : () => {}
        },
        reply : {
            note : '',
            noteError : '',
            status : '',
            action : '',
            isProcessing : false
        }
    }),
    actions: {        
        goTo(router: Router, name : string = 'dashboard') {
            console.log(" ➡ " + name);
            router.push({ name: name });
        },
        async fetchSubmissions(page : number | null = null) {

            try {
                this.processing = true;
                var param = {};
                if(page) {
                    param = {
                        page : page
                    };
                }
                const response = await api.get('/api/submissions', {
                    params : param
                });
                this.paginationInfo = response.data.submissionsPagination;
                if(page) {
                    const tmp = response.data.submissionsPagination.data;
                    this.data = [...this.data, ...tmp];                    
                }else {
                    this.data = response.data.submissionsPagination.data;
                }

                this.filters = response.data.filters;
                this.sorting = response.data.sorting;                
            } catch (err) {
                console.log(err);
            } finally {
                this.processing = false;
            }
        },
        showDialog(title : string, message : string, action : any = () => {}, button : string = "OK"){
            if(this.dialog.open == true) {
                this.dialog.open = false;
                console.log(this.dialog.open);
            }
            this.dialog.open = true;
            this.dialog.title = title;
            this.dialog.message = message;
            this.dialog.button =button;
            this.dialog.action = action;
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
            this.getData.isLoading = true;
            this.getData.error = '';           
            try {
                const response = await api.get('/api/submissions/'  + id);
                this.getData.data = response.data;
                
            } catch (err: any) {
                console.log(err.response?.data?.message || err.message)
                this.getData.error = err.response?.data?.message || err.message                
            } finally {
                this.getData.isLoading = false;
            }
        },
        async postSubmission() {
            this.formError.server = ''
            this.processing = true
            try {
                
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
        },
        async putSubmission(id : string) {
            this.formError.server = ''
            this.processing = true
            try {
                
                const response = await api.put('/api/submissions/'  + id, {
                    id : id,
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
        },
        async submissionReply(submission_id:string) {
            this.reply.status = "";
            this.reply.action = "";
            await this.postSubmissionReply(submission_id);
        },
        async submissionAccept(submission_id:string) {
            this.reply.status = "reviewing";
            this.reply.action = "accept";
            this.reply.note = "";
            await this.postSubmissionReply(submission_id);
            this.getData.data.status = "reviewing";
        },
        async submissionReject(submission_id:string) {
            this.reply.status = "reviewing";
            this.reply.action = "reject";
            this.reply.note = "";
            await this.postSubmissionReply(submission_id);
            this.getData.data.status = "reviewing";
        },
        async postSubmissionReply(submission_id : string) {
            this.formError.server = ''
            this.processing = true
            try {
                
                const response = await api.post('/api/submissions/reply/' + submission_id, {
                    note : this.reply.note,
                    status : this.reply.status,
                    action : this.reply.action
                });
                console.log(response.data);
                this.reply.note = '';
                this.reply.status = '';
                return response.data;
            } catch (err : any) {
                console.log(err.response?.data?.message || err.message)
                this.formError.server = err.response?.data?.message || err.message
            } finally {
                this.processing = false
            }
        },
  }
});