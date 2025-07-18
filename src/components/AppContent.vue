<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'header' | 'sidebar'
  class?: string
}

const props = defineProps<Props>()
const className = computed(() => props.class)
</script>

<template>
  <main class="h-full w-full" :class="className">
    <div class="max-w-5xl mx-auto w-full flex flex-1 flex-col gap-4">
      <slot />
    </div>
  </main>
</template>
