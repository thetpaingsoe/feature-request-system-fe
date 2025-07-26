<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
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
    default: 'Select options',
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

const selectedOptionText = computed(() => {
  const selectedTexts = props.options
    .filter((option) => props.modelValue.includes(option.value))
    .map((option) => option.text)
  return selectedTexts.join(', ')
})

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

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) touched.value = true
}

const selectOption = (value? : string | number | null) => {
  const current = [...props.modelValue]
  const index = current.indexOf(value)

  if (index > -1) {
    current.splice(index, 1) // remove
  } else if (current.length < 3) {
    current.push(value) // add if under 3
  }
  emit('update:modelValue', current)
}

const markAsTouched = () => {
  setTimeout(() => {
    if (!isOpen.value) touched.value = true
  }, 100)
}

const handleClickOutside = (event : any) => {
  const dropdownElement = document.getElementById(props.cid)?.closest('.relative')
  if (dropdownElement && !dropdownElement.contains(event.target)) {
    isOpen.value = false
    touched.value = true
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => props.modelValue,
  (newVal) => {
    if ((!newVal || newVal.length === 0) && touched.value) {
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
        @click="toggleDropdown"
        @blur="markAsTouched"
        :data-test="cid"
        tabindex="0"
        class="mt-1 block w-full border-half-px rounded-md px-4 py-2.5 pr-10 cursor-pointer focus:outline-none focus:ring-0 sm:text-sm text-sm"
        :class="[
          touched && !validationState.status
            ? !isOpen
              ? 'border-red-400 text-red-400'
              : ' border-gray-400 text-gray-400'
            : modelValue.length
              ? 'border-green-400 text-white'
              : 'border-gray-300 text-gray-400',
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
              : modelValue.length > 0
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
          class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-primary text-white"
          :class="{ 'bg-primary text-white': modelValue.includes(option.value) }"
          role="option"
          :aria-selected="modelValue.includes(option.value)"
        >
          {{ option.text }}
          <input
            type="checkbox"
            :checked="modelValue.includes(option.value)"
            class="form-checkbox text-primary"
          />
        </li>
      </ul>
    </div>

    <!-- Error Message -->
    <p v-if="touched && !validationState.status" class="mt-1 text-sm text-red-400">
      {{ validationState.message }}
    </p>
  </div>
</template>
