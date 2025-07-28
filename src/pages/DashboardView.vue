<script setup lang="ts">
import KDialog from '@/components/common/KDialog.vue';
import KTag from '@/components/common/KTag.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useSubmissionStore } from '@/stores/submissionStore';
import { FormDataStructure } from '@/types/SubmissionTypes';
import { ScrollText, ChevronRight } from 'lucide-vue-next';

import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const submissionStore = useSubmissionStore()
const router = useRouter();

function handleContinueSubmission(){
    router.push({
        name: 'entry',         
    });    
}

function callbackNewSubmission() {
    localStorage.removeItem('formData');
    router.push({
        name: 'entry',         
    });
}

function handleNewSubmission(){
    submissionStore.showDialog("New Submission!", "Would you like to clear the cache and create new submission ?", callbackNewSubmission, "Start New Entry");
}

function fetchSubmissions(page : number | null = null) {
    try {
        submissionStore.fetchSubmissions(page);          
    } catch (err) {
        
    }
}

function handleViewDetail(id : number) {
    router.push({
        name: 'submission', 
        params: { id: id } 
    });
}

const username = computed(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if(Object.keys(user).length > 0) {
        return user.name + " 👋";
    }else {
        return ' 👋';
    }
});

const cacheData = computed(() => {
    const data = JSON.parse(localStorage.getItem("formData") || '{}') as FormDataStructure;
    if(Object.keys(data).length > 0) {
        if(data.company_detail.company_name != null && data.company_detail.company_name != '') {
            return data.company_detail.company_name;
        }else {
            return "Continue Submission";
        }
    }else {
        return "";
    }
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Morning'";
  } else if (hour >= 12 && hour < 18) {
    return "Afternoon'";
  } else {
    return "Evening'";
  }
});

onMounted(() => {
    fetchSubmissions();
});
</script>
<template>
    <DashboardLayout>

        <!-- Hero Section -->
        <div class="flex flex-row justify-between items-center mb-12  mt-20">
            <div class="flex flex-col items-start">
                <h1 class="text-3xl font-bold text-white dark:text-white text-center"> {{ greeting }} {{ username }} </h1>
                <p class="text-gray-300 mt-2">Take a look into your submissions</p>
            </div>
            <button class=" w-fit px-4 bg-primary/55 text-white rounded py-4 mb-4 flex items-center hover:bg-primary cursor-pointer" 
                @click="handleNewSubmission">        
                <ScrollText class="size-4 me-2" /> New Submission
            </button>
        </div>

        <!-- Cache Entry -->
        <div v-if="cacheData != '' " class="mb-8 "  >
            <div class="font-bold text-white">Continue Your Submission Entry</div>
            <div class="h-0.5 ms-2 bg-primary"></div>

            <div class="w-fit flex flex-row mt-4 items-center hover:bg-primary/55 rounded pe-3 cursor-pointer" @click="handleContinueSubmission">
                <div class="h-16 w-16 bg-primary flex items-center  rounded justify-center"><ScrollText class="size-4 me-2" /></div>
                <p class="ms-4"> {{ cacheData }} </p>
                <div class=" ms-4 w-fit px-2  text-primary-light bg-primary/55 rounded py-2" 
                    >        
                    <ChevronRight class="size-4 text-white " />
                </div>
            </div>
        </div>

        <!-- Submissions -->
        <div>
            <div class="font-bold text-white">Your submissions </div>
            <div class="h-0.5 ms-2 bg-primary"></div>            
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            <div
                v-for="submission in submissionStore.data"
                :key="submission.id"
                class="bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-primary-light/25 dark:border-gray-700">
                <div class="p-6">
                    <h2 class="text-xl font-semibold text-white mb-2 truncate" :title="submission.company_name">
                        {{ submission.company_name }}
                    </h2>
                    <p class="text-gray-300 text-sm mb-2 truncate" :title="submission.email">
                        <span class="font-medium">Email:</span> {{ submission.email }}
                    </p>
                    <div class="flex items-center text-start justify-start mt-4">                    
                        <KTag :status="submission.status" class=""></KTag>                
                    </div>
                </div>
                <div class="bg-gray-900 px-4 py-2 border-t border-primary/25 dark:border-gray-600 flex justify-between items-center">
                    <span class="text-gray-400 text-xs">
                        Submitted: <p>{{ new Date(submission.submitted_at).toLocaleString()  }}</p>
                    </span>
                <button
                    class="px-2 py-2 cursor-pointer bg-transparent text-gray-500 hover:text-white rounded-md hover:bg-primary transition-colors duration-200 text-sm font-medium"
                    @click="handleViewDetail(submission.id)">
                    View Details
                </button>
                </div>
            </div>
        </div>

        <div v-if="!submissionStore.processing && submissionStore.paginationInfo.current_page < submissionStore.paginationInfo.last_page" 
            class="flex justify-center w-full mt-8">
            <p class="cursor-pointer font-bold text-primary-light hover:text-primary-light/80" @click="fetchSubmissions(submissionStore.paginationInfo.current_page+1)">Load More</p>
        </div>

        <div v-if="submissionStore.data.length === 0" class="text-center text-gray-600 dark:text-gray-400 mt-12">
            No submissions to display.
        </div>
          
    </DashboardLayout>

    <KDialog
        :title="submissionStore.dialog.title"
        :message="submissionStore.dialog.message"
        :button="submissionStore.dialog.button"
        v-model:open="submissionStore.dialog.open"
        @close="submissionStore.dialog.action"
    />
</template>