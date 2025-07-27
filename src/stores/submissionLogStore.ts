import api from '@/services/api'
import { defineStore } from 'pinia'
import { SubmissionLog, SubmissionLogPagination } from '@/types/SubmissionLogTypes';

export const useSubmissionLogStore = defineStore('submission-logs-store', {
    state: () => ({
        processing: false,
        data: [] as Array<SubmissionLog>, // This is for List
        filters : Object,
        sorting : Object,
        paginationInfo : {} as SubmissionLogPagination,
        formError: {
            server: '',
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
       
        showDialog(title : string, message : string, action : any = () => {}, button : string = "OK"){
            this.dialog = {
                open : true,
                title : title,
                message : message,
                button : button,
                action : action
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
        async fetchSubmissionLogs(submission_id : string) {
            try {
                const response = await api.get('/api/submission-logs/' + submission_id);
                this.paginationInfo = response.data.submissionLogsPagination;
                this.data = response.data.submissionLogsPagination.data.reverse();
                this.filters = response.data.filters;
                this.sorting = response.data.sorting;                                
            } catch (err) {
                console.log(err);
            }
        },
        async postSubmissionLog(submission_id : string, note : string) {
            this.formError.server = ''
            this.processing = true
            try {
                
               const response = await api.post('/api/submission-logs/' + submission_id + "/reply", {
                    note : note
                });
                console.log(response.data);
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