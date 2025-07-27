<script setup lang="ts">
import AppContent from '@/components/AppContent.vue'
</script>

<template >
  <div class="min-h-screen bg-primary-dark overflow-x-hidden">
    <div class=" border-b border-primary-light w-full h-16"> 
      <AppContent class="flex justify-between items-center ">
        <slot name="header" />
      </AppContent>
    </div>
    <AppContent class="overflow-x-hidden ">
      <slot />
    </AppContent>
  </div>
</template>
