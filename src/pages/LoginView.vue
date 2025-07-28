<script setup lang="ts">
import BaseLayout from '@/layouts/BaseLayout.vue';
import InputError from '@/components/InputError.vue'
import Button from '@/components/ui/button/Button.vue'
import { LoaderCircle } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import KInput from '@/components/common/KInput.vue'
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
const router = useRouter();

// Email
const emailValidateionState = ref({})
const emailValidationRule = {
    validate: (value : string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
            return false // Empty or whitespace only
        }
        if (!emailRegex.test(value)) {
            return false // Invalid format
        }

        return true
    },
    message: 'Please enter valid email.',
}

// Password
const passwordValidateionState = ref({})
const passwordValidationRule = {
  validate: (value : string) => {
    if (!value.trim()) {
      return false // Empty or whitespace only
    }
    
    return true
  },
  message: 'Please enter valid password.',
}

async function handleLogin() {

    if(!emailValidationRule.validate(userStore.form.email)) {
        emailValidateionState.value = {
            status: true,
            message:'',
        }
        return false;
    }

    if(!passwordValidationRule.validate(userStore.form.password)) {
        passwordValidateionState.value = {
            status: true,
            message:'',
        }
        return false;
    }

    const data = await userStore.login();
    if(data != null) {
        router.push({ name: 'dashboard' });
    }

}
</script>

<template>
    <BaseLayout>        
        <div class="w-[500px] px-4 py-8 md:p-8 mx-auto mt-40 ">
                
            <!-- Header -->
            <h2 class="mt-8 font-bold text-white text-4xl text-center">Login</h2>
            
            <!-- email -->
            <div class="grid gap-2 mt-12">                
                <KInput
                    id="email"
                    label="Email"
                    type="text"
                    placeholder="Enter email"    
                    v-model="userStore.form.email"  
                    :highlight="false"  
                    :validation-rule="emailValidationRule"    
                    :validation-state="emailValidateionState"
                />                
                <InputError :message="userStore.formError.email" />
            </div>

            <!-- Password -->
            <div class="grid gap-2 mt-4">                
                <KInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter password"    
                    v-model="userStore.form.password"       
                    :highlight="false" 
                    :validation-rule="passwordValidationRule"
                    :validation-state="passwordValidateionState"
                />
                <InputError :message="userStore.formError.password" />
            </div>

            <InputError
                :message="userStore.formError.server"
                class="mt-4 h-10 bg-red-100 px-3 content-center rounded font-normal"
            />
        
            <!-- Submit Button -->
            <div class="my-6 flex items-center justify-start mt-8">
                <Button class="w-full" :disabled="userStore.processing" @click="handleLogin">
                    <LoaderCircle v-if="userStore.processing" class="h-4 w-4 animate-spin" />
                    SUBMIT
                </Button>
            </div>            
        </div>
    </BaseLayout>
</template>
