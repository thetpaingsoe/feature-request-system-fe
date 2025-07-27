<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useLoginStore } from '@/stores/loginStore';
import { useSubmissionStore } from '@/stores/submissionStore';
import { LoaderCircle } from 'lucide-vue-next';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';


const store = useLoginStore()
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

async function logout() {
    try {
        await store.logout();  
        store.goTo(router, 'login');      
    } catch (err) {
        store.formError.server = 'Invalid email or password';
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
    <h2 class="text-white text-4xl w-full text-center mt-14"> Dashboard </h2>

    <div class="my-6 flex items-center justify-start mt-8 w-fit">
        <Button class="w-full" :disabled="store.processing" @click="logout">
        <LoaderCircle v-if="store.processing" class="h-4 w-4 animate-spin" />
            Logout
        </Button>
        
    </div>

    <div class="my-6 flex items-center justify-start mt-8 w-fit">
    <Button class="w-full" :disabled="store.processing" @click="submissionEntryHandle">
        <LoaderCircle v-if="store.processing" class="h-4 w-4 animate-spin" />
        New Submission
    </Button>
    </div>
    <div class="my-6 flex items-center justify-start mt-8 w-fit">
    <Button class="w-full" :disabled="store.processing" @click="submissionEditHandle">
        <LoaderCircle v-if="store.processing" class="h-4 w-4 animate-spin" />
        Edit Submission
    </Button>
    </div>

    <div class="text-white">
        Data : 
        <div v-for="data in submissionStore.data" :key="data.id">
            {{ data.full_name }}
            {{ data.target_jurisdiction_names }}
        </div>
    </div>
</template>