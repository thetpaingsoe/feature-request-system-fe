<script setup lang="ts">
import Actions from '@/components/Actions.vue'
import FormHeader from '@/components/FormHeader.vue'
import SectionForm from '@/components/SectionForm.vue'
import SectionNavigation from '@/components/SectionNavigation.vue'
import { ref, watch } from 'vue'

const sections = ref<string[]>(['Company Details', 'Shareholders', 'Beneficial Owner', 'Director']);
const currentSection = ref(0)

const sectionFormRef = ref()

const formData = ref(
  JSON.parse(localStorage.getItem('formData') || JSON.stringify({
    company_detail: {},
    shareholders: [],
    beneficial_owners: [],
    directors: [],
  }))
)

watch(formData, (newVal) => {
  localStorage.setItem('formData', JSON.stringify(newVal))
}, { deep: true })

function handleSectionChange(index : number) {
  
  if (index < 0 || index >= sections.value.length) return false

  if (index < currentSection.value) {
    currentSection.value = index
  }

  if (sectionFormRef?.value?.validate()) {
    currentSection.value = index
  }
}

function handleSave() {
  console.info(formData.value.company_detail);
  console.info(formData.value.shareholders);
  console.info(formData.value.beneficial_owners);
  console.info(formData.value.directors);
}
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
      @save="() => handleSave()"
    />
  </main>
</template>
