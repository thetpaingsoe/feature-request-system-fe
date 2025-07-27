<script setup lang="ts">

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; 

// Define props for the dialog's title and message
interface Props {
  title: string;
  message: string;
  button: string;
}
const props = defineProps<Props>();

// Use defineModel for two-way binding of the dialog's open state.
// The parent component can use v-model:open="isDialogOpen"
const open = defineModel<boolean>('open', {
  required: true,
  default: false,
});

const emit = defineEmits(['close']);

const closeModal = () => {
  open.value = false; 
  emit('close'); 
};
</script>

<template>
  <!-- The 'open' prop is bound to the defineModel, allowing two-way control from parent -->
  <Dialog :open="open" @update:open="open = $event">
    <DialogContent class="sm:max-w-[425px] p-6 rounded-lg shadow-lg bg-gray-900 text-white border-gray-700">
      <form class="space-y-6" @submit.prevent>
        <!-- Dialog Header with Title and Description -->
        <DialogHeader class="space-y-3 text-center">
          <!-- Bind DialogTitle to the 'title' prop -->
          <DialogTitle class="text-xl font-bold text-primary-light">{{ props.title }}</DialogTitle>
          <!-- Bind DialogDescription to the 'message' prop -->
          <DialogDescription class="text-gray-300 text-base">
            {{ props.message }}
          </DialogDescription>
        </DialogHeader>

        <!-- Dialog Footer with OK Button -->
        <DialogFooter class="flex justify-center gap-2 pt-4">
          <DialogClose as-child>
            <Button
              variant="secondary"
              id="dialog-ok-button"
              @click="closeModal"
              class="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
            >
              {{ props.button || "OK" }}
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
