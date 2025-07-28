<script setup lang="ts">
import { reactive } from 'vue';
import KInput from '../common/KInput.vue';
import { BeneficialOwner } from '@/types/SubmissionTypes';
import { onMounted } from 'vue';

const beneficial_owners = defineModel<BeneficialOwner[]>({
    required: true,    
    default: () => []
});

const getNextBeneficialOwnerId = () => {
    if (beneficial_owners.value.length === 0) {
        return 1;
    }
    const maxId = Math.max(...beneficial_owners.value.map(s => s.id));
    return maxId + 1;
};

const addBeneficialOwner = () => {
    beneficial_owners.value.push({ id: getNextBeneficialOwnerId(), name: '', email: '' } as BeneficialOwner);
};

const removeBeneficialOwner = (idToRemove: number) => {
    beneficial_owners.value = beneficial_owners.value.filter(s => s.id !== idToRemove);
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
const getNameValidationState = (beneficialOwnerId: number): Object => {
    return nameValidationStates[beneficialOwnerId] || {}; 
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
const getEmailValidationState = (beneficialOwnerId: number): Object => {
  return emailValidationStates[beneficialOwnerId] || {}; // Return empty string if not set
};

function validate() {
    let isValid = true;
    beneficial_owners.value.forEach((beneficialOwner, index) => {

    // Name
    const isNameValid = getNameValidationRule.validate(beneficialOwner.name);
    if (!isNameValid) {
        nameValidationStates[beneficialOwner.id] = {
            status: true,
            message: '',
        }; 
        isValid = false;
    }

    // Email
    const isEmailValid = getEmailValidationRule.validate(beneficialOwner.email);
    if (!isEmailValid) {
        emailValidationStates[beneficialOwner.id] = {
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
  
    if (beneficial_owners.value.length === 0) {
        addBeneficialOwner(); // Add an initial beneficialOwner if none exist
    }else {
        for(var i=0; i< beneficial_owners.value.length; i++) {
            beneficial_owners.value[i].id = i
        }
    }
});

</script>

<template>
    <!-- Title -->
    <div class="mt-8 font-bold text-white">Beneficial Owner</div>
    <div class="h-0.5 bg-primary-light ms-2"></div>

    <!-- Dynamic Entry -->
    <div class="flex flex-row mt-8"> 
        <div class="text-gray-300 basis-2/6 ms-4 text-sm"> 
            Please provide details for all beneficial owners of the company. This information is essential for regulatory compliance and to identify individuals who ultimately own, control, or have significant influence over the company, even if their ownership is not direct. This helps ensure transparency and prevents illicit activities.
        </div>
        <div class="flex flex-col basis-4/7 ms-12 text-white">

            <div v-for="(beneficialOwner, index) in beneficial_owners" :key="beneficialOwner.id" class="px-4">
                <label :for="`beneficialOwner-${beneficialOwner.id}-name`" class="text-white text-lg font-semibold block mb-2 ">BeneficialOwner {{ index + 1 }}</label>

                <KInput
                    :id="`beneficialOwner-${beneficialOwner.id}-name`"
                    :cid="`beneficialOwner-${beneficialOwner.id}-name`"
                    label="Full Name"
                    type="text"
                    placeholder="Enter full name"
                    v-model="beneficialOwner.name"   
                    :validation-rule="getNameValidationRule"   
                    :validation-state="getNameValidationState(beneficialOwner.id)"               
                />

                <KInput
                    :id="`beneficialOwner-${beneficialOwner.id}-email`"
                    :cid="`beneficialOwner-${beneficialOwner.id}-email`"
                    label="Email"
                    type="email"
                    placeholder="Enter email address"
                    v-model="beneficialOwner.email" 
                    :validation-rule="getEmailValidationRule"
                    :validation-state="getEmailValidationState(beneficialOwner.id)"
                    class="mt-4"
                />
                
                <button
                    v-if="beneficial_owners.length > 1"
                    @click="removeBeneficialOwner(beneficialOwner.id)"
                    class="text-red-400 text-sm mt-2 mb-4 hover:underline block w-full text-right cursor-pointer"
                >
                    - Remove BeneficialOwner
                </button>
            </div>

            <p @click="addBeneficialOwner" class="mt-6 ms-4 text-primary-light cursor-pointer hover:underline text-lg font-normal">
                + Add More BeneficialOwner
            </p>

        </div>
    </div>
</template>
