<template>
  <div class="flex justify-between content-between mt-20 mb-30">
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

    <button
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

    <div v-if="currentSection == totalSections - 1" class="basis-1/6"></div>
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
</template>

<script setup lang="ts">
defineProps({
  currentSection: {
    type: Number,
    default: 0
  },
  totalSections: {
    type: Number,
    default: 0
  },
})

defineEmits(['back', 'next', 'save'])
</script>
