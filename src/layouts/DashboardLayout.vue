<script setup lang="ts">

import AppLayout from '@/layouts/AppLayout.vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { ChevronsUpDownIcon } from 'lucide-vue-next'
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';

const userRef = ref('');
const router = useRouter();
onMounted(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if(user) {
        userRef.value = user.name;
    }
});

</script>

<template>
    <AppLayout >
        <template v-slot:header >
            <div class="flex justify-between items-center">
                <h1 class="text-white text-lg cursor-pointer" @click="router.push({name: 'dashboard'})">Home</h1>
                
                <DropdownMenu>
                        <DropdownMenuTrigger :as-child="true">
                            <Button
                                variant="ghost"
                                size="icon"
                                class="relative text-white hover:bg-transparent hover:text-primary-light size-10 w-auto rounded-full p-1 focus-within:ring-primary "
                            >
                            <div class="flex justify-center items-center">
                                {{ userRef }} <ChevronsUpDownIcon class="size-5 ms-2" />                            
                            </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56 bg-primary border-primary-light hover:bg-none">
                            <UserMenuContent />
                        </DropdownMenuContent>
                    </DropdownMenu>                    
            </div>
        </template>

        <template v-slot="" >
            <slot />
        </template>
    </AppLayout>
    
</template>