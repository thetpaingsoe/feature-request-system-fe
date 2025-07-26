<script setup lang="ts">
import { ref, watch, computed } from 'vue'

type OptionType = {
  label: string;
  value: boolean;  
};

const props = defineProps({
  modelValue: {
    type: [String, Boolean, Number],
    default: null,
  },
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array as () => OptionType[],
    default: () => [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ] as OptionType[],
  },
  validationRule: {
    type: Object,
    default: () => ({
      validate: () => true,
      message: '',
    }),
  },
  validationState: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const touched = ref(false)

const validationState = computed(() => {
  const isValid = props.validationRule.validate(props.modelValue)
  return {
    status: isValid,
    message: isValid ? '' : props.validationRule.message,
  }
})

const selectOption = (value : any) => {
  emit('update:modelValue', value)
  touched.value = true
}

watch(
  () => props.validationState,
  (newVal) => {
    if (newVal && typeof newVal === 'object' && newVal.status === true) {
      touched.value = true
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (newVal) => {
    if ((newVal === null || newVal === '') && touched.value) {
      touched.value = false
    }
  },
)
</script>

<template>
  <div class="flex flex-col">
    <label :for="id" class="text-white font-medium mb-1">{{ label }}</label>

    <div class="flex">
      <div role="radiogroup" :aria-labelledby="id" :data-test="id" class="flex flex-col w-full">
        <label
          v-for="option in options"
          :key="option.label"
          :for="`${id}-${option.value}`"
          class="mt-2 flex-1 flex items-center cursor-pointer px-4 py-2 rounded-md text-sm font-medium border-half-px text-gray-400 focus-within:outline-none"
          :class="[
            modelValue === option.value
              ? ' border-green-500'
              : touched && !validationState.status
                ? 'bg-background border-red-400 hover:border-white'
                : 'bg-background border-gray-300 hover:border-white',
          ]"
        >
          <input
            type="radio"
            :id="`${id}-${option.value}`"
            :name="id"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="selectOption(option.value)"
            class="mr-2 accent-green-500"
          />
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="touched && !validationState.status" class="mt-1 text-sm text-red-400">
      {{ validationState.message }}
    </p>
  </div>
</template>
