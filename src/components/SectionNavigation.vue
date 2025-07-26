<script setup lang="ts">

interface Props {
  sections: string[]; // Assuming sections is an array of strings (e.g., section titles)
  currentSection: number;
}

const props = defineProps<Props>();

// defineProps({
//   sections: {
//     type : [] as String[], // Use the JavaScript 'Array' constructor
//     required: true, // Example: make it required
//     default: () => []
//   },
//   currentSection: {
//     type : Number,
//     default : 0
//   },
// })


defineEmits(['navigate'])
</script>
<template>
  <div class="flex gap-6 mt-12 items-center text-white">
    
    <div
      v-for="(section, index) in sections"
      :key="index"
      class="flex items-center cursor-pointer"
      @click="$emit('navigate', index)"
    >
      <div
        class="rounded-full w-12 h-12 flex items-center justify-center text-white border-8 transition-all duration-300"
        :class="{
          'bg-primary-light border-primary-light': index === currentSection,
          ' border-gray-500 bg-gray-500': index !== currentSection,
          'opacity-70': index !== currentSection,
        }"
      >
        {{ index + 1 }}
      </div>
      <div
        class="ms-2 transition-all"
        :class="index === currentSection ? 'text-primary-light ' : 'text-gray-500'"
      >
        {{ section }}
      </div>
    </div>
  </div>
</template>
