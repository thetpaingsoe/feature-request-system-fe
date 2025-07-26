<script setup lang="ts">
import { ref } from 'vue'; // ref might still be useful for internal logic, but not for the model itself
import KInput from '../common/KInput.vue';
import { Shareholder } from '@/types/SubmissionTypes';

// Define the interface for a single shareholder
// interface Shareholder {
//   id: number;
//   name: string; // Changed from fullName to name to match your default object
//   email: string;
// }

// Use defineModel for the shareholders array
// The 'required: true' means the parent MUST pass a 'shareholders' prop.
// The 'default' is a factory function that returns an array with one initial shareholder.
const shareholders = defineModel<Shareholder[]>({
    required: true,
    // Provide a factory function for array/object defaults
    default: () => [{ name: '', email: '' }]
});

// A counter to generate unique IDs for new shareholders
// Initialize it based on the current highest ID in the modelValue, or 1 if empty.
// We use a computed property or a function to get the next ID to ensure reactivity
const getNextShareholderId = () => {
    if (shareholders.value.length === 0) {
        return 1;
    }
    // Find the maximum existing ID and add 1
    const maxId = Math.max(...shareholders.value.map(s => s.id));
    return maxId + 1;
};


// Function to add a new shareholder
const addShareholder = () => {
  // Push a new shareholder object onto the reactive array
  shareholders.value.push({ id: getNextShareholderId(), name: '', email: '' } as Shareholder);
};

// Function to remove a shareholder (optional, but usually good practice)
const removeShareholder = (idToRemove: number) => {
  shareholders.value = shareholders.value.filter(s => s.id !== idToRemove);
};

// --- Validation Placeholder (similar to previous example) ---
const getNameValidationRule = (index: number) => [];
const getNameValidationState = (index: number) => '';
const getEmailValidationRule = (index: number) => [];
const getEmailValidationState = (index: number) => '';

function validate() {
  let isValid = true;
  shareholders.value.forEach((shareholder, index) => {
    if (shareholder.name.trim() === '') {
      console.warn(`Shareholder ${index + 1} Name is empty`);
      isValid = false;
    }
    // Add more validation for email if needed
  });
  return isValid;
}

defineExpose({ validate });

import { onMounted } from 'vue';
onMounted(() => {
  if (shareholders.value.length === 0) {
    addShareholder(); // Add an initial shareholder if none exist
  }
});

</script>

<template>
  <div class="mt-8 font-bold text-white">Shareholders</div>
  <div class="h-0.5 bg-primary-light ms-2"></div>

  <div class="flex flex-row mt-8">
    <div class="text-gray-300 basis-2/6 ms-4 text-sm">
      This is the individual that we will communicate with. Communications related to this form but
      also to the company once incorporated will be sent to the same email address. You can change
      it later on if required.
    </div>
    <div class="flex flex-col basis-4/7 ms-12 text-white">

      <div v-for="(shareholder, index) in shareholders" :key="shareholder.id" class="mt-4 border p-4 rounded-lg bg-gray-800 border-gray-700">
        <label :for="`shareholder-${shareholder.id}-name`" class="text-white text-lg font-semibold block mb-2">Shareholder {{ index + 1 }}</label>

        <KInput
          :id="`shareholder-${shareholder.id}-name`"
          :cid="`shareholder-${shareholder.id}-name`"
          label="Full Name"
          type="text"
          placeholder="Enter full name"
          v-model="shareholder.name" 
          
          class="mb-4"
        />
        <!-- :validation-rule="getNameValidationRule(index)" -->
        <!-- :validation-state="getNameValidationState(index)" -->

        <KInput
          :id="`shareholder-${shareholder.id}-email`"
          :cid="`shareholder-${shareholder.id}-email`"
          label="Email"
          type="email"
          placeholder="Enter email address"
          v-model="shareholder.email" 

        />
        <!-- :validation-rule="getEmailValidationRule(index)" -->
                  <!-- :validation-state="getEmailValidationState(index)" -->

        <button
          v-if="shareholders.length > 1"
          @click="removeShareholder(shareholder.id)"
          class="text-red-400 text-sm mt-4 hover:underline block w-full text-right"
        >
          Remove Shareholder
        </button>
      </div>

      <p @click="addShareholder" class="mt-6 text-primary-light cursor-pointer hover:underline text-lg font-medium">
        + Add More Shareholder
      </p>

    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here */
</style>