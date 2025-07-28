<script setup lang="ts">
import { reactive } from 'vue';
import KInput from '../common/KInput.vue';
import { Shareholder } from '@/types/SubmissionTypes';
import { onMounted } from 'vue';
import KNumberInput from '../common/KNumberInput.vue';

const shareholders = defineModel<Shareholder[]>({
    required: true,    
    default: () => []
});

const getNextShareholderId = () => {
    if (shareholders.value.length === 0) {
        return 1;
    }
    const maxId = Math.max(...shareholders.value.map(s => s.id));
    return maxId + 1;
};

const addShareholder = () => {
  shareholders.value.push({ id: getNextShareholderId(), name: '', email: '', percentage: 0 } as Shareholder);
};

const removeShareholder = (idToRemove: number) => {
  shareholders.value = shareholders.value.filter(s => s.id !== idToRemove);
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
const getNameValidationState = (shareholderId: number): Object => {
  return nameValidationStates[shareholderId] || {}; 
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
const getEmailValidationState = (shareholderId: number): Object => {
  return emailValidationStates[shareholderId] || {}; // Return empty string if not set
};

const getPercentValidationRule = {
    validate: (value : number) => {
      if (!value) {
      return false // Empty or whitespace only
      }
      if (value < 1 || value > 100) {
        return false // Specific disallowed name
      }

      return true
    },
    message: 'Please input valid percent.',
};
const percentValidationStates = reactive<Record<number, Object>>({});
const getPercentValidationState = (shareholderId: number): Object => {
  return percentValidationStates[shareholderId] || {}; // Return empty string if not set
};

function validate() {
  let isValid = true;
  shareholders.value.forEach((shareholder, index) => {

    // Name
    const isNameValid = getNameValidationRule.validate(shareholder.name);
    if (!isNameValid) {
      nameValidationStates[shareholder.id] = {
        status: true,
        message: '',
      }; 
      isValid = false;
    }

    // Email
    const isEmailValid = getEmailValidationRule.validate(shareholder.email);
    if (!isEmailValid) {
      emailValidationStates[shareholder.id] = {
        status: true,
        message: '',
      }; 
      isValid = false;
    }

    // Percent
    const isPercentValid = getEmailValidationRule.validate(shareholder.email);
    if (!isPercentValid) {
      percentValidationStates[shareholder.id] = {
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
  console.log("shareholder mount");
  console.log(shareholders);
  if (shareholders.value.length === 0) {
    addShareholder(); // Add an initial shareholder if none exist
  }else {
    for(var i=0; i< shareholders.value.length; i++) {
      shareholders.value[i].id = i
    }
  }
});

</script>

<template>
  <div class="mt-8 font-bold text-white">Shareholders</div>
  <div class="h-0.5 bg-primary-light ms-2"></div>

  <div class="flex flex-row mt-8">
    <div class="text-gray-300 basis-2/6 ms-4 text-sm">
      Please provide the details for each shareholder. This information is crucial for establishing ownership structure and for any future legal or financial communications regarding the company.
    </div>
    <div class="flex flex-col basis-4/7 ms-12 text-white">

      <div v-for="(shareholder, index) in shareholders" :key="shareholder.id" class="px-4">
        <label :for="`shareholder-${shareholder.id}-name`" class="text-white text-lg font-semibold block mb-2 ">Shareholder {{ index + 1 }}</label>

        <KInput
          :id="`shareholder-${shareholder.id}-name`"
          :cid="`shareholder-${shareholder.id}-name`"
          label="Full Name"
          type="text"
          placeholder="Enter full name"
          v-model="shareholder.name"   
          :validation-rule="getNameValidationRule"   
          :validation-state="getNameValidationState(shareholder.id)"               
        />

        <KInput
          :id="`shareholder-${shareholder.id}-email`"
          :cid="`shareholder-${shareholder.id}-email`"
          label="Email"
          type="email"
          placeholder="Enter email address"
          v-model="shareholder.email" 
          :validation-rule="getEmailValidationRule"
          :validation-state="getEmailValidationState(shareholder.id)"
          class="mt-4"
        />

        <KNumberInput
          :id="`shareholder-${shareholder.id}-percent`"
          :cid="`shareholder-${shareholder.id}-email`"
          label="Percent %"
          placeholder="Enter percent ( Number Only )"
          v-model="shareholder.percentage" 
          :validation-rule="getPercentValidationRule"
          :validation-state="getPercentValidationState(shareholder.id)"
          class="mt-4"
        />
        
        <button
          v-if="shareholders.length > 1"
          @click="removeShareholder(shareholder.id)"
          class="text-red-400 text-sm mt-2 mb-4 hover:underline block w-full text-right cursor-pointer"
        >
          - Remove Shareholder
        </button>
      </div>

      <p @click="addShareholder" class="mt-6 ms-4 text-primary-light cursor-pointer hover:underline text-lg font-normal">
        + Add More Shareholder
      </p>

    </div>
  </div>
</template>
