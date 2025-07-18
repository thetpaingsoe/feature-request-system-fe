<script setup lang="ts">
import AppContent from '@/components/AppContent.vue'
</script>

<template>
  <AppContent class="overflow-x-hidden min-h-screen bg-blue-950">
    <slot />
  </AppContent>
</template>
