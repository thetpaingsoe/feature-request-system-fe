<script setup lang="ts">
import { computed, ref } from 'vue'
import CompanyDetailForm from '@/components/forms/CompanyDetailForm.vue'
import BeneficialOwner from '@/components/forms/BeneficialOwner.vue'
import Director from '@/components/forms/Director.vue'
import SharedHolders from '@/components/forms/SharedHolders.vue'

const props = defineProps({
  currentSection: {
    type : Number,
    default : 0
  },
  modelValue: {
    type : Object,
    required : true
  },
})

const childRef = ref()
const emit = defineEmits(['update:modelValue'])

const components = [CompanyDetailForm, SharedHolders, BeneficialOwner, Director]
const sectionKeyMap = ['company_detail', 'shareholders', 'beneficial_owner', 'director']

const currentComponent = computed(() => components[props.currentSection])
const sectionKey = computed(() => sectionKeyMap[props.currentSection])

function validate() {
  return childRef?.value?.validate()
}

// Expose it to parent
defineExpose({ validate })
</script>

<template>
  <component :is="currentComponent" v-model="modelValue[sectionKey]" ref="childRef" />
</template>
