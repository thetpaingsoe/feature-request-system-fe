<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useLoginStore } from '@/stores/loginStore';
import { LoaderCircle } from 'lucide-vue-next';
import { useRouter } from 'vue-router';


const store = useLoginStore()
const router = useRouter();

async function logout() {
    try {
        await store.logout();  
        store.goTo(router, 'login');      
    } catch (err) {
        store.formError.server = 'Invalid email or password';
    }
}

</script>
<template>
    <h2 class="text-white text-4xl w-full text-center mt-14"> Dashboard </h2>

    <div class="my-6 flex items-center justify-start mt-8 w-20">
        <Button class="w-full" :disabled="store.processing" @click="logout">
        <LoaderCircle v-if="store.processing" class="h-4 w-4 animate-spin" />
            Logout
        </Button>
    </div>
</template>