<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null], // Allow null for initial state
    default: null,
  },
  cid: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  options: {
    type: Array as () => DropdownOptionType[],    
    required: true,
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

const isOpen = ref(false)
const touched = ref(false)

// Computed property to display the text of the selected option
const selectedOptionText = computed(() => {
  const selected = props.options.find((option) => option.value === props.modelValue)
  return selected ? selected.text : ''
})

// Computed property for validation state
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
      // props.modelValue = props.modelValue
      // validationState.value = newVal
      // validationState.value.status = newVal.status
      // validationState.value.message = newVal.message
      // validationState()
    }
  },
  { immediate: true },
)

// Method to toggle dropdown visibility
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // When opening, mark as touched if not already
    touched.value = true
  }
}

// Method to select an option
const selectOption = (value? : string | number | null) => {
  emit('update:modelValue', value)
  isOpen.value = false // Close dropdown after selection
  touched.value = true // Mark as touched on selection
}

// Method to mark the dropdown as touched (on blur)
const markAsTouched = () => {
  // Delay setting touched to allow click event on options to fire first
  setTimeout(() => {
    if (!isOpen.value) {
      // Only mark as touched if dropdown is closed
      touched.value = true
    }
  }, 100)
}

// Close dropdown when clicking outside
const handleClickOutside = (event : any) => {
  const dropdownElement = document.getElementById(props.cid)?.closest('.relative')
  if (dropdownElement && !dropdownElement.contains(event.target)) {
    isOpen.value = false
    touched.value = true // Mark as touched when clicking outside
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Reset touched state if modelValue becomes null/empty after having content
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
    <label :for="cid" class="text-white font-medium mb-1">{{ label }}</label>
    <div class="relative">
      <div
        :id="cid"
        :data-test="cid"
        @click="toggleDropdown"
        @blur="markAsTouched"
        tabindex="0"
        class="mt-1 block w-full border-half-px border-gray-200 rounded-md px-4 py-2.5 pr-10 cursor-pointer focus:outline-none focus:ring-2 sm:text-sm"
        :class="[
          touched && !validationState.status
            ? !isOpen
              ? 'border-red-400 text-red-400'
              : 'border-gray-300  focus:ring-blue-200 text-gray-400'
            : modelValue != null
              ? 'border-green-400  focus:ring-gren-400  text-white'
              : 'border-gray-300  focus:ring-blue-200 text-gray-400',
          // Add background color for the dropdown display area
          'bg-background',
        ]"
      >
        {{ selectedOptionText || placeholder }}
      </div>

      <!-- Dropdown Arrow Icon -->
      <span
        class="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 pointer-events-none"
      >
        <i
          :class="[
            isOpen ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down',
            touched && !validationState.status
              ? !isOpen
                ? ' text-red-400'
                : ' text-gray-400'
              : modelValue != null
                ? ' text-green-400'
                : ' text-gray-400',
          ]"
        ></i>
      </span>

      <!-- Dropdown Options List -->
      <ul
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full bg-background border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option.text"
          @click="selectOption(option.value)"
          class="px-4 py-2 cursor-pointer hover:bg-primary text-white"
          :class="{ 'bg-primary text-white': modelValue === option.value }"
          role="option"
          :aria-selected="modelValue === option.value"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>

    <!-- Error Message -->
    <p v-if="touched && !validationState.status" class="mt-1 text-sm text-red-400">
      {{ validationState.message }}
    </p>
  </div>
</template>
