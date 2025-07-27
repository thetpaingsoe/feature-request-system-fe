<script setup lang="ts">
import { computed } from 'vue';

// Define the props for the KTag component
interface Props {
  status: string; // The full submission object
}
const props = defineProps<Props>();

// Computed property to determine the tag's text and color classes
const tagInfo = computed(() => {
  const status = props.status;
  let text = '';
  let classes = '';

  switch (status) {
    case 'pending':
      text = 'Pending';
      classes = 'text-blue-200 bg-blue-900 dark:bg-blue-900 dark:text-blue-200'; 
      break;
    case 'reviewing':
      text = 'In Review';
      classes = 'text-purple-200 bg-purple-900 dark:bg-purple-900 dark:text-purple-200'; 
      break;
    case 'feedback':
      text = 'Feedback';
      classes = 'text-amber-200 bg-amber-900 dark:bg-amber-900 dark:text-amber-200'; 
      break;
    case 'approved':
      text = 'Approved';
      classes = 'text-green-200 bg-green-900 dark:bg-green-900 dark:text-green-200'; 
      break;
    case 'rejected':
      text = 'Rejected';
      classes = 'text-red-200 bg-red-900 dark:bg-red-900 dark:text-red-200'; 
      break;
    default:
      text = 'Unknown';
      classes = 'bg-gray-100 text-gray-800 border-gray-300'; 
      break;
  }

  return { text, classes };
});
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium "
    :class="tagInfo.classes"
  >
    {{ tagInfo.text }}
  </span>
</template>

