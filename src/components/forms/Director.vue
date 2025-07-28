<script setup lang="ts">
import { reactive } from 'vue';
import KInput from '../common/KInput.vue';
import { onMounted } from 'vue';
import { Director } from '@/types/SubmissionTypes';

const directors = defineModel<Director[]>({
    required: true,    
    default: () => []
});

const getNextDirectorId = () => {
    if (directors.value.length === 0) {
        return 1;
    }
    const maxId = Math.max(...directors.value.map(s => s.id));
    return maxId + 1;
};

const addDirector = () => {
  console.log("adding more owner");
  directors.value.push({ id: getNextDirectorId(), name: '', email: '' } as Director);
};

const removeDirector = (idToRemove: number) => {
  directors.value = directors.value.filter(s => s.id !== idToRemove);
};

const getNameValidationRule = {
    validate: (value : string) => {
      if (!value.trim()) {
        return false; 
      }

      return true
    },
    message: 'Please input valid name.',

};
const nameValidationStates = reactive<Record<number, Object>>({});
const getNameValidationState = (directorId: number): Object => {
  return nameValidationStates[directorId] || {}; 
};

const getEmailValidationRule = {
    validate: (value : string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        return false // Empty or whitespace only
      }      
      if (!emailRegex.test(value)) {
        return false // Invalid format
      }

      return true
    },
    message: 'Please input valid email.',
};
const emailValidationStates = reactive<Record<number, Object>>({});
const getEmailValidationState = (directorId: number): Object => {
  return emailValidationStates[directorId] || {}; // Return empty string if not set
};


function validate() {
  let isValid = true;
  directors.value.forEach((director, index) => {

    // Name
    const isNameValid = getNameValidationRule.validate(director.name);
    if (!isNameValid) {
      nameValidationStates[director.id] = {
        status: true,
        message: '',
      }; 
      isValid = false;
    }

    // Email
    const isEmailValid = getEmailValidationRule.validate(director.email);
    if (!isEmailValid) {
      emailValidationStates[director.id] = {
        status: true,
        message: '',
      }; 
      isValid = false;
    }

  });
  return isValid;
}

defineExpose({ validate });

onMounted(() => {
  
  if (directors.value.length === 0) {
    addDirector(); // Add an initial director if none exist
  }else {
    for(var i=0; i< directors.value.length; i++) {
      directors.value[i].id = i
    }
  }
});

</script>

<template>
  <div class="mt-8 font-bold text-white">Director</div>
  <div class="h-0.5 bg-primary-light ms-2"></div>

  <div class="flex flex-row mt-8">
    <div class="text-gray-300 basis-2/6 ms-4 text-sm">
      Please provide the details for each director of the company. Directors are responsible for the day-to-day management, strategic direction, and legal compliance of the company. This information is vital for corporate governance and accountability.
    </div>
    <div class="flex flex-col basis-4/7 ms-12 text-white">

      <div v-for="(director, index) in directors" :key="director.id" class="px-4">
        <label :for="`director-${director.id}-name`" class="text-white text-lg font-semibold block mb-2 ">Director {{ index + 1 }}</label>

        <KInput
          :id="`director-${director.id}-name`"
          :cid="`director-${director.id}-name`"
          label="Full Name"
          type="text"
          placeholder="Enter full name"
          v-model="director.name"   
          :validation-rule="getNameValidationRule"   
          :validation-state="getNameValidationState(director.id)"               
        />

        <KInput
          :id="`director-${director.id}-email`"
          :cid="`director-${director.id}-email`"
          label="Email"
          type="email"
          placeholder="Enter email address"
          v-model="director.email" 
          :validation-rule="getEmailValidationRule"
          :validation-state="getEmailValidationState(director.id)"
          class="mt-4"
        />
        
        <button
          v-if="directors.length > 1"
          @click="removeDirector(director.id)"
          class="text-red-400 text-sm mt-2 mb-4 hover:underline block w-full text-right cursor-pointer"
        >
          - Remove Director
        </button>
      </div>

      <p @click="addDirector" class="mt-6 ms-4 text-primary-light cursor-pointer hover:underline text-lg font-normal">
        + Add More Director
      </p>

    </div>
  </div>
</template>
