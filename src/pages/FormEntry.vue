<script setup lang="ts">
import Actions from '@/components/Actions.vue'
import FormHeader from '@/components/FormHeader.vue'
import SectionForm from '@/components/SectionForm.vue'
import SectionNavigation from '@/components/SectionNavigation.vue'
import { ref } from 'vue'

const sections = ['Company Details', 'Shareholders', 'Beneficial Owner', 'Director']
const currentSection = ref(0)

const sectionFormRef = ref()

const formData = ref<FormDataStructure>({
  company_detail: {
    // fullName: 'Jeff',
    // selectedDesignation: 'CEO',
  },
  shareholders: {},
  beneficial_owners: {},
  directors: {},
})

function handleSectionChange(index : number) {
  if (index < 0 || index >= sections.length) return false

  if (index < currentSection.value) {
    currentSection.value = index
  }

  if (sectionFormRef?.value?.validate()) {
    currentSection.value = index
  }
}

function handleNext() {}
</script>

<template>
  <main class="flex flex-col bg-background">
    <!-- Form Header -->
    <FormHeader />

    <!-- Section Navigation -->
    <SectionNavigation
      :sections="sections"
      :current-section="currentSection"
      @navigate="handleSectionChange"
    />

    <!-- Form Detail Screen -->
    <SectionForm :current-section="currentSection" v-model="formData" ref="sectionFormRef" />

    <!-- Actions -->
    <Actions
      @next="(data) => handleSectionChange(data)"
      :current-section="currentSection"
      :total-sections="sections.length"
      @back="(data) => handleSectionChange(data)"
    />
  </main>
</template>
