<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  // validationRule prop:
  // Expects an object with:
  // - validate: a function that takes the value and returns true/false
  // - message: a string for the default error message
  validationRule: {
    type: Object,
    default: () => ({
      validate: () => true, // Default to always valid if no rule provided
      message: '',
    }),
  },
  validationState: {
    type: Object,
    default: null,
  },
  highlight : {
    type : Boolean,
    default : true
  }
})

const emit = defineEmits(['update:modelValue'])

const touched = ref(props.modelValue != '' ? true : false)

// Computed property to determine the current validation state based on the rule
const validationState = computed(() => {
  const isValid = props.validationRule.validate(props.modelValue)
  return {
    status: isValid,
    message: isValid ? '' : props.validationRule.message,
  }
})

watch(
  () => props.validationState,
  (newVal) => {
    if (newVal && typeof newVal === 'object' && newVal.status == true) {
      touched.value = true
      // validationState.value.status = newVal.status
      // validationState.value.message = newVal.message
    }
  },
  { immediate: true },
)

// Handle input event to update v-model
const handleInput = (event:any) => {
  emit('update:modelValue', event.target.value)
}

// Mark the input as touched when it loses focus
const markAsTouched = () => {
  touched.value = true
}

// Reset touched state if modelValue becomes empty after having content
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === '' && touched.value) {
      touched.value = false
    }
  },
)
</script>

<template>
  <div class="flex flex-col">
    <label :for="id" class="text-white font-medium mb-1">{{ label }}</label>
    <div class="relative">
      <input
        :type="type"
        :id="id"
        :data-test="id"
        :value="modelValue"
        @input="handleInput"
        @blur="markAsTouched"
        class="mt-2 border-half-px border-gray-200 rounded px-4 py-2 text-white focus:outline-none w-full text-sm placeholder-gray-400"
        :class="[
          touched && !validationState.status
            ? 'border-red-400  focus:ring-red-200 text-red-400'
            : modelValue != '' && highlight
              ? 'border-green-400  focus:ring-gren-400 text-gray-800'
              : 'border-gray-300  focus:ring-blue-200 text-gray-800',
        ]"
        :placeholder="placeholder"
      />
      <!-- Validation Icon -->
      <span
        v-if="touched && highlight"
        :class="[
          'absolute right-3 top-1/2 -translate-y-1/2 text-lg mt-1',
          validationState.status ? 'text-green-500' : 'text-red-400',
        ]"
      >
        <i :class="validationState.status ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
      </span>
    </div>
    <!-- Error Message -->
    <p v-if="touched && !validationState.status" class="mt-1 text-sm text-red-400">
      {{ validationState.message }}
    </p>
  </div>
</template>
