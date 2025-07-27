<script setup lang="ts">
import Actions from '@/components/Actions.vue'
import FormHeader from '@/components/FormHeader.vue'
import SectionForm from '@/components/SectionForm.vue'
import SectionNavigation from '@/components/SectionNavigation.vue'
import { useSubmissionStore } from '@/stores/submissionStore'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';

interface Props {
  id?: string;
}
const props = defineProps<Props>();

const currentSection = ref(0);
const sections = ref<string[]>(['Company Details', 'Shareholders', 'Beneficial Owner', 'Director']);
const router = useRouter();
const submissionStore = useSubmissionStore();

const sectionFormRef = ref()

onMounted(() => {
  if (props.id) {
    currentSection.value = 0;
    
  } else {
    submissionStore.formData = JSON.parse(localStorage.getItem('formData') || JSON.stringify({
      company_detail: {},
      shareholders: [],
      beneficial_owners: [],
      directors: [],
    }))
    currentSection.value = parseInt(localStorage.getItem('currentSection') || '0', 10);
  }
})

watch(currentSection, (newVal) => {
  if(!props.id){
    // Save currentSection to localStorage whenever it changes
    localStorage.setItem('currentSection', newVal.toString());
  }
});

watch(submissionStore.formData, (newVal) => {
  if(!props.id){
    localStorage.setItem('formData', JSON.stringify(newVal))
  }
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

async function handleSubmit() {
  if (sectionFormRef?.value?.validate()) {
    const data = await submissionStore.postSubmission();
    if(data != null) {
      localStorage.removeItem('formData'); 
      localStorage.removeItem('currentSection');
      router.push({ name: "dashboard" });
    }
  }
}

// This will only save in the local storage.
// And it will not work for the edit mode with id.
function handleSave() {
  if(!props.id){
    // Data Sets
    // formData.value.company_detail
    // formData.value.shareholders
    // formData.value.beneficial_owners
    // formData.value.directors
    localStorage.setItem('formData', JSON.stringify(submissionStore.formData))
    router.push({ name: "dashboard" });
  }
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
    <SectionForm :current-section="currentSection" v-model="submissionStore.formData" ref="sectionFormRef" />

    <!-- Actions -->
    <Actions
      @next="(data) => handleSectionChange(data)"
      :current-section="currentSection"
      :total-sections="sections.length"
      @back="(data) => handleSectionChange(data)"
      @save="() => handleSave()"
      @submit="() => handleSubmit()"
      :id="props.id"
    />
  </main>
</template>
