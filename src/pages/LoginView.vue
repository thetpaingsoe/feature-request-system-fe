<script setup lang="ts">
import InputError from '@/components/InputError.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import { LoaderCircle } from 'lucide-vue-next'
import { useFeatureRequestStore } from '@/stores/featureRequestStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import KInput from '@/components/common/KInput.vue'
import { useLoginStore } from '@/stores/loginStore'

const store = useLoginStore()
const router = useRouter();
const isDialogOpen = ref(false);

const closeModal = () => {    
    isDialogOpen.value = false;
};

async function submit() {
    try {
        await store.login();
        store.goTo(router);
    } catch (err) {
        store.formError.server = 'Invalid email or password';
    }
//   store.startProcessing()

//   if (store.validate()) {
//     // console.log('success')
//     const data = await store.submitFeatureRequest()
//     if(data != null) {
//       isDialogOpen.value = true;
//     }
//   }

//   store.endProcessing()
}
</script>

<template>
  
    <div class="w-[500px] px-4 py-8 md:p-8 mx-auto mt-40 ">
        
        <!-- Header -->
        <h2 class="mt-8 font-bold text-white text-4xl text-center">Login</h2>
        <!-- <div class="h-0.5 bg-primary-light ms-2"></div> -->


        <!-- email -->
        <div class="grid gap-2 mt-12">
            
            <KInput
                id="email"
                label="Email"
                type="text"
                placeholder="Enter email"    
                v-model="store.form.email"        
            />
        <!-- 
            :validation-rule="fullNameValidationRule"
            :validation-state="fullNameValidateionState" -->
            
            <InputError :message="store.formError.email" />
        </div>

        <!-- Password -->
        <div class="grid gap-2 mt-4">
            
            <KInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter password"    
                    v-model="store.form.password"        
                />
            <InputError :message="store.formError.password" />
        </div>

        <InputError
            :message="store.formError.server"
            class="mt-4 h-10 bg-red-100 px-3 content-center rounded font-normal"
        />
      
        <!-- Submit Button -->
        <div class="my-6 flex items-center justify-start mt-8">
            <Button class="w-full" :disabled="store.processing" @click="submit">
            <LoaderCircle v-if="store.processing" class="h-4 w-4 animate-spin" />
            SUBMIT
            </Button>
        </div>
    
  </div>

  <!-- Success Dialog -->
  <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
    <DialogContent>
        <form class="space-y-6" @submit="">
            <DialogHeader class="space-y-3">
                <DialogTitle class=" text-lg/8">Successfully Sent!</DialogTitle>
                <DialogDescription>
                    Your request has been successfully sent to the company. Thanks for your valuable time.
                </DialogDescription>
            </DialogHeader>


            <DialogFooter class="gap-2">
                <DialogClose as-child>
                    <Button variant="secondary" id="dialog-ok-button" @click="closeModal"> OK </Button>
                </DialogClose>                
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>
</template>
