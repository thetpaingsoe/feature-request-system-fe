<script setup lang="ts">
import { DropdownMenuItem} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/stores/userStore';
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const router = useRouter();

async function handleLogout () {
    try {
        await userStore.logout();  
        router.push({name : 'login'});      
    } catch (err) {
        userStore.formError.server = 'Invalid email or password';
    }
};

</script>

<template>
    <DropdownMenuItem :as-child="true" class="cursor-pointer bg-primary focus:outline-none hover:bg-primary focus:bg-primary focus:text-gray-300 focus:border-primary-dark">
        <div class="block w-full bg-primary text-white hover:bg-none " @click="handleLogout" >
            <LogOut class="mr-2 h-4 w-4 text-white " />
            Log out
        </div>        
    </DropdownMenuItem>
</template>
