<script setup lang="ts">
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useSubmissionStore } from '@/stores/submissionStore';
import { useUserStore } from '@/stores/userStore';
import { LoaderCircle } from 'lucide-vue-next';

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';


const userStore = useUserStore()
const submissionStore = useSubmissionStore()
const router = useRouter();

function submissionEntryHandle(){
    router.push({
        name: 'entry',         
    });    
}

function submissionEditHandle(){
    router.push({
        name: 'entry', 
        params: { id: 9 } 
    });    
}

function submissionViewHandle(){
    router.push({
        name: 'submission', 
        params: { id: 9 } 
    });    
}

async function logout() {
    try {
        await userStore.logout();  
        router.push({name: 'login'});        
    } catch (err) {
        userStore.formError.server = 'Invalid email or password';
    }
}

function fetchSubmissions() {
    try {
        submissionStore.fetchSubmissions();          
    } catch (err) {
        
    }
}
onMounted(() => {
    fetchSubmissions();
});
</script>
<template>
    <DashboardLayout>
            <h2 class="text-white text-4xl w-full text-center mt-14"> Dashboard </h2>

            <div class="my-6 flex items-center justify-start mt-8 w-fit">
                <Button class="w-full" :disabled="userStore.processing" @click="logout">
                <LoaderCircle v-if="userStore.processing" class="h-4 w-4 animate-spin" />
                    Logout
                </Button>
                
            </div>

            <div class="my-6 flex items-center justify-start mt-8 w-fit">
            <Button class="w-full" :disabled="userStore.processing" @click="submissionEntryHandle">
                <LoaderCircle v-if="userStore.processing" class="h-4 w-4 animate-spin" />
                New Submission
            </Button>
            </div>
            <div class="my-2 flex items-center justify-start w-fit">
            <Button class="w-full" :disabled="userStore.processing" @click="submissionEditHandle">
                <LoaderCircle v-if="userStore.processing" class="h-4 w-4 animate-spin" />
                Edit Submission
            </Button>
            </div>

            <div class="my-2 flex items-center justify-start w-fit">
            <Button class="w-full" :disabled="userStore.processing" @click="submissionViewHandle">
                <LoaderCircle v-if="userStore.processing" class="h-4 w-4 animate-spin" />
                View Submission
            </Button>
            </div>

            <div class="text-white">
                Data : 
                <div v-for="data in submissionStore.data" :key="data.id">
                    {{ data.full_name }}
                    {{ data.target_jurisdiction_names }}
                </div>
            </div>

            <div class="text-white" v-for="i in 40"> {{ i }}</div>
        
    </DashboardLayout>
</template>