import api from '@/services/api'
import { defineStore } from 'pinia'
import { SubmissionLog } from '@/types/SubmissionLogTypes';

export const useSubmissionLogStore = defineStore('submission-logs-store', {
    state: () => ({
        processing: false,
        data: [] as Array<SubmissionLog>, // This is for List
        filters : Object,
        sorting : Object,
        paginationInfo : Object,
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
                this.data = response.data.submissionLogsPagination.data;
                this.filters = response.data.filters;
                this.sorting = response.data.sorting;                                
            } catch (err) {
                console.log(err);
            }
        },
  }
});