<script setup lang="ts">
import { useSubmissionStore } from '@/stores/submissionStore';
import { LoaderCircle } from 'lucide-vue-next';
import Button from './ui/button/Button.vue';
import InputError from './InputError.vue';

defineProps({
  currentSection: {
    type: Number,
    default: 0
  },
  totalSections: {
    type: Number,
    default: 0
  },
  id: {
    type: String || null,
    default: null
  },
})

defineEmits(['back', 'next', 'save', 'submit'])

const store = useSubmissionStore();

</script>

<template>
  <div class="mt-14 mb-30 w-full flex flex-col  ">
    <div class="w-full flex justify-end">
    <InputError
        :message="store.formError.server"
        class="mb-6 w-2/3 py-4 bg-red-100 px-3 content-center rounded font-normal"
      />
    </div>
    <div class="flex justify-between content-between h-18 ">
      <div v-if="currentSection === 0" class="basis-1/6"></div>
      <button
        v-else
        class="bg-background border-half-px border-gray-200 w-auto text-white rounded-sm hover:bg-gray-800 py-2 px-8 basis-1/6"
        :disabled="currentSection === 0"
        @click="$emit('back', currentSection - 1)"
      >
        <i class="me-2 fa-solid fa-arrow-left-long"></i>
        BACK
      </button>
      <div v-if="id != null && id != ''" class=" basis-1/6 w-fit"></div>
      <button
        v-else
        class="bg-background border-half-px border-gray-200 text-white rounded-sm hover:bg-gray-800 py-2 px-8 cursor-pointer basis-1/3 w-fit"
        @click="$emit('save')"
      >
        <span class="text-[11px] text-gray-400">
          I know the form autosaved but,<br /><span class="font-bold text-[13px] text-white"
            >SAVE & EXIT</span
          >
          i wish to anyways. ;)</span
        >
      </button>

      <Button
        id="submitForm"
        class="bg-primary text-white rounded-sm hover:bg-primary-light py-2 px-8 cursor-pointer basis-1/6 w-fit h-full"
        @click="$emit('submit')"
        :disabled="store.processing"
        :class="{
          'cursor-not-allowed': store.processing,
          'cursor-pointer': !store.processing // Only apply cursor-pointer when not processing
        }"
        v-if="currentSection == totalSections - 1"
      >
        <div class="flex  justify-center">      
          SUBMIT
          <LoaderCircle v-if="store.processing" class="ms-2 animate-spin" />
        </div>      
      </button>
      
      <button
        v-else
        id="nextForm"
        class="bg-primary text-white rounded-sm hover:bg-primary-light py-2 px-8 cursor-pointer basis-1/6 w-fit"
        @click="$emit('next', currentSection + 1)"
      >
        NEXT
        <i class="ms-2 fa-solid fa-arrow-right-long"></i>
      </button>
    </div>
  </div>
</template>


