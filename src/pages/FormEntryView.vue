<script setup lang="ts">
import Actions from '@/components/Actions.vue'
import FormHeader from '@/components/FormHeader.vue'
import SectionForm from '@/components/SectionForm.vue'
import SectionNavigation from '@/components/SectionNavigation.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';

interface Props {
  id?: string;
}
const props = defineProps<Props>();

const currentSection = ref(0);
const sections = ref<string[]>(['Company Details', 'Shareholders', 'Beneficial Owner', 'Director']);

onMounted(() => {
  if (props.id) {
    currentSection.value = 0;
    
  } else {
    formData.value = JSON.parse(localStorage.getItem('formData') || JSON.stringify({
      company_detail: {},
      shareholders: [],
      beneficial_owners: [],
      directors: [],
    }))
    currentSection.value = parseInt(localStorage.getItem('currentSection') || '0', 10);
  }
})

console.log(props);


watch(currentSection, (newVal) => {
  if(!props.id){
    // Save currentSection to localStorage whenever it changes
    localStorage.setItem('currentSection', newVal.toString());
  }
});

const router = useRouter();

const sectionFormRef = ref()

const formData = ref(
  {
      company_detail: {},
      shareholders: [],
      beneficial_owners: [],
      directors: [],
    }
  // JSON.parse(localStorage.getItem('formData') || JSON.stringify({
  //   company_detail: {},
  //   shareholders: [],
  //   beneficial_owners: [],
  //   directors: [],
  // }))
)

watch(formData, (newVal) => {
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

function handleSubmit() {
  alert("submit");
}

function handleSave() {
  // Data Sets
  // formData.value.company_detail
  // formData.value.shareholders
  // formData.value.beneficial_owners
  // formData.value.directors
  localStorage.setItem('formData', JSON.stringify(formData.value))
  router.push({ name: "dashboard" });
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
      @submit="() => handleSubmit()"
      :id="props.id"
    />
  </main>
</template>
