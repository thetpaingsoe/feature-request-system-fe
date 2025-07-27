<script setup lang="ts">
import AppContent from '@/components/AppContent.vue'
</script>

<template>
  <AppContent class="overflow-x-hidden min-h-screen bg-background">
    <slot />
  </AppContent>
</template>
