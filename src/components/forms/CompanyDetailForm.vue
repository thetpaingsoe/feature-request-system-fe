<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import KDropdown from '@/components/common/KDropdown.vue'
import KMultiSelectDropdown from '@/components/common/KMultiSelectDropdown.vue'
import KNumberInput from '@/components/common/KNumberInput.vue'
import KRadio from '@/components/common/KRadio.vue'
import KInput from '@/components/common/KInput.vue'
import type { DropdownOptionType, Submission } from '@/types/SubmissionTypes';
import { useCountryStore } from '@/stores/countryStore'
import { useCompanyDesignationStore } from '@/stores/companyDesignationStore'
import { userShareValueStore } from '@/stores/shareValuesStore'
import { ShareValue } from '@/types/ShareValueTypes'

// Receive the v-model from parent
const modelValue = defineModel<Submission>({
    required: true, 
})

const countryStore = useCountryStore();
const designationStore = useCompanyDesignationStore();
const shaerValueStore = userShareValueStore();

onMounted(() => {
  countryStore.fetch();
  designationStore.fetch();
  shaerValueStore.fetch();
});
// Full Name
const fullNameValidateionState = ref({})
const fullNameValidationRule = {
  validate: (value : string) => {
    if (!value.trim()) {
      return false // Empty or whitespace only
    }
    if (value.toLowerCase() === 'korporatio') {
      return false // Specific disallowed name
    }

    return true
  },
  message: 'Full name is required and "Korporatio" is not allowed.',
}

// Email
const emailValidateionState = ref({})
const emailValidationRule = {
  validate: (value : string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value.trim()) {
      return false // Empty or whitespace only
    }
    if (value.toLowerCase() === 'korporatio@email.com') {
      return false // Specific disallowed email
    }
    if (!emailRegex.test(value)) {
      return false // Invalid format
    }

    return true
  },
  message: 'Email is required and must be a valid format. "korporatio@email.com" is not allowed.',
}

// Company Name
const companyNameValidateionState = ref({})
const companyNameValidationRule = {
  validate: (value : string) => {
    if (!value.trim()) {
      return false // Empty or whitespace only
    }
    if (value.toLowerCase() === 'korporatio') {
      return false // Specific disallowed name
    }

    return true
  },
  message: 'Company name is required and "Korporatio" is not allowed.',
}

// Alternative Company Name
const altCompanyNameValidateionState = ref({})
const altCompanyNameValidationRule = {
  validate: (value : string) => {
    if (!value.trim()) {
      return false // Empty or whitespace only
    }
    if (value.toLowerCase() === modelValue.value?.company_name.toLowerCase()) {
      return false
    }
    return true
  },
  message: 'Alternative Company name is required and cannot be same with company name.',
}

// Company Designation
const designationValidateionState = ref({})
const designationOptions = computed(() =>
  designationStore.data.map((designation: { id: number; name: string; }) => ({
    id: designation.id,
    value: designation.name,    
  }))
)
const designationValidationRule = {
  validate: (value : string) => {
    return value !== null && value !== ''
  },
  message: 'Please select a designation from the list.',
}

// Jurisdiction of operation
const operationCountryValidateionState = ref({})
const operationCountryOptions = computed(() =>
  countryStore.data.map((country: { id: number; name: string; code: string }) => ({
    id: country.id,
    value: country.name,
    code: country.code,
  }))
)
const operationCountryValidationRule = {
  validate: (value : string) => {
    return value !== null && value !== ''
  },
  message: 'Please select a operation country from the list.',
}

// Target Jurisdictions
const targetCountryValidateionState = ref({})
const targetCountryOptions = computed(() =>
  countryStore.data.map((country: { id: number; name: string; code: string }) => ({
    id: country.id,
    value: country.name,
    code: country.code,
  }))
)
const targetCountryValidation = {
  validate: (val : Array<string>) => val.length >= 1 && val.length <= 3,
  message: 'Please select 1 to 3 target jurisdictions',
}

// Number of shares
const numOfSharesValidateionState = ref({})
const numOfSharesValidationRule = {
  validate: (value : number) => {
    if (!value) {
      return false // Empty or whitespace only
    }
    if (value < 1) {
      return false // Specific disallowed name
    }

    return true
  },
  message: 'Please enter number of shares at least 1 share.',
}

// Are all shares issued?
const areAllSharedIssuedValidateionState = ref({})
const areAllSharedIssuedValidation = {
  validate: (val : boolean) => {
    console.log(val)
    if (val === true) {
      if (modelValue.value) {
        modelValue.value.number_of_issued_shares = modelValue.value.number_of_shares
      }
      issuedSharesValidateionState.value = {
        status: true,
        message: '',
      }
    }
    return val !== null
  },
  message: 'Please choose Yes or No.',
}

// Number of Issued Shares
const issuedSharesValidateionState = ref({})
const issuedSharesValidationRule = {
  validate: (value : number) => {
    if (!value) {
      return false // Empty or whitespace only
    }
    if (value < 1) {
      return false // Specific disallowed name
    }
    // if (modelValue.value) {
      if (value > Number(modelValue.value.number_of_shares | 0)) {
        return false
      }
      if (
        (modelValue.value.are_all_shares_issued != null) &&
          (modelValue.value.are_all_shares_issued != true) &&
        value == Number(modelValue.value.number_of_shares | 0)
      ) {
        return false
      }
    

      if (
        (modelValue.value.are_all_shares_issued != null) &&
          (modelValue.value.are_all_shares_issued == true) &&
        value != Number(modelValue.value.number_of_shares | 0)
      ) {
        return false
      }
    // }else {
    //   return false
    // }

    return true
  },
  message: 'Please input the valid issued shares.',
}

// Value Per Shares
const valuePerSharesValidateionState = ref({})
const valuePerSharesOptions = computed(() =>
  shaerValueStore.data.map((shareValue: ShareValue) => {
    const { id, currency, amount } = shareValue; 
    return {
      id: id,
      value: `${currency} ${amount}`
    };
  })
)
const valuePerSharesValidationRule = {
  validate: (value : string) => {
    return value !== null && value !== ''
  },
  message: 'Please select a how much each share is worth.',
}

function validate() {
  
  var status = true
  if (!modelValue.value.full_name) {
    fullNameValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.email) {
    emailValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.company_name) {
    companyNameValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.company_designation_id) {
    designationValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.jurisdiction_of_operation_id) {
    operationCountryValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.alternative_company_name) {
    altCompanyNameValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.target_jurisdictions) {
    targetCountryValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.number_of_shares) {
    numOfSharesValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (modelValue.value.are_all_shares_issued != false 
      && modelValue.value.are_all_shares_issued != true) {
    
    areAllSharedIssuedValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.number_of_issued_shares) {
    
    issuedSharesValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if(!issuedSharesValidationRule.validate(modelValue.value.number_of_issued_shares)) {
    issuedSharesValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }

  if (!modelValue.value.share_value_id) {
    
    valuePerSharesValidateionState.value = {
      status: true,
      message: '',
    }
    status = false
  }
  // modelValue.value.selectedValuePerShares = modelValue.value.selectedValuePerShares

  return status
}

// Expose it to parent
defineExpose({ validate })
</script>

<template>
  
  <div class="mt-8 font-bold text-white">Point of contact</div>
  <div class="h-0.5 bg-primary-light ms-2"></div>
  <div class="flex flex-row mt-8">
    <div class="text-gray-300 basis-2/6 ms-4 text-sm">
      This is the individual that we will communicate with. Communications related to this form but
      also to the company once incorporated will be sent to the same email address. You can change
      it later on if required.
    </div>
    <div class="flex flex-col basis-4/7 ms-12 text-white">
      <KInput
        id="full-name"
        label="Full Name"
        type="text"
        placeholder="Enter full name"
        v-model="modelValue.full_name"
        :validation-rule="fullNameValidationRule"
        :validation-state="fullNameValidateionState"
      />

      <KInput
        id="email"
        label="Email"
        type="text"
        placeholder="Enter email"
        v-model="modelValue.email"
        :validation-rule="emailValidationRule"
        :validation-state="emailValidateionState"
        class="mt-4"
      />
    </div>
  </div>

  <!-- Company Information-->
  <div class="mt-8 font-bold text-white">Company Information</div>
  <div class="h-0.5 bg-primary-light ms-2"></div>
  <div class="flex flex-row mt-8">
    <div class="text-gray-300 basis-2/6 ms-4 text-sm">
      Every company must have a name and a designation. For the company name you can use both
      letters and numbers, but not special symbols. For the designations, there is no actual
      different between one or another.
    </div>
    <div class="flex flex-col basis-4/7 ms-12 text-white">
      <KInput
        id="company-name"
        label="Company Name"
        type="text"
        placeholder="The name you want your company to have"
        v-model="modelValue.company_name"
        :validation-rule="companyNameValidationRule"
        :validation-state="companyNameValidateionState"
      />

      <KInput
        id="alt-company-name"
        label="Alternative company name"
        type="text"
        placeholder="The name to use if the first name is not available"
        v-model="modelValue.alternative_company_name"
        :validation-rule="altCompanyNameValidationRule"
        :validation-state="altCompanyNameValidateionState"
        class="mt-4"
      />

      <KDropdown
        id="company-designation"
        cid="company-designation"
        label="Company designation"
        placeholder="Select the option that you prefer"
        v-model="modelValue.company_designation_id"
        :options="designationOptions"
        :validation-rule="designationValidationRule"
        :validation-state="designationValidateionState"
        class="mt-4"
      />
    </div>
  </div>

  <!-- Countries of interest -->
  <div class="mt-8 font-bold text-white">Countries of interest</div>
  <div class="h-0.5 bg-primary-light ms-2"></div>
  <div class="flex flex-row mt-8">
    <div class="text-gray-300 basis-2/6 ms-4 text-sm">
      We are required to check that the company will not be interacting with forbidden locations.
      For 'jurisdiction of operation' if you are alone, select your country of residency. If you
      have more shareholders, pick the most relevant. For 'target jurisdiction' select 1-3 countries
      that are relevant. Even if you will have clients from other counties, it's ok.
    </div>
    <div class="flex flex-col basis-4/7 ms-12 text-white">
      <KDropdown
        id="operation-country"
        cid="operation-country"
        label="Jurisdiction of operation"
        placeholder="Select the country where you are located"
        v-model="modelValue.jurisdiction_of_operation_id"
        :options= "operationCountryOptions"
        :validation-rule="operationCountryValidationRule"
        :validation-state="operationCountryValidateionState"
        class="mt-4"
      />
      <!-- //"operationCountryOptions" -->

      <KMultiSelectDropdown
        id="target-country"
        cid="target-country"
        label="Target Jurisdictions"
        v-model="modelValue.target_jurisdictions"
        :options="targetCountryOptions"
        :validation-rule="targetCountryValidation"
        :validation-state="targetCountryValidateionState"
        placeholder="Select the countries where your clients are located"
        class="mt-4"
      />
    </div>
  </div>

  <!-- Shares structure -->
  <div class="mt-8 font-bold text-white">Shares structure</div>
  <div class="h-0.5 bg-primary-light ms-2"></div>
  <div class="flex flex-row mt-8">
    <div class="text-gray-300 basis-2/6 ms-4 text-sm">
      All companies must have at least 1 share. Apart from that, you can structure things in
      whatever way you like. Issued shares are shares that will be distributed from day 1. Unissued
      shares are shares that you can distribute later on, i.e. to future team members or investors.
      The value per shares represents your personal liabiity. So, if you wish to reduce risks, just
      pick the smallest number.
    </div>
    <div class="flex flex-col basis-4/7 ms-12 text-white">
      <KNumberInput
        id="num-of-shares"
        cid="num-of-shares"
        label="Number of Shares"
        type="text"
        placeholder="Select how many shares you wish to have"
        v-model="modelValue.number_of_shares"
        :validation-rule="numOfSharesValidationRule"
        :validation-state="numOfSharesValidateionState"
        class="mt-4"
      />

      <KRadio
        id="are-all-shared-issued"
        label="Are all shares issued?"
        v-model="modelValue.are_all_shares_issued"
        :validation-rule="areAllSharedIssuedValidation"
        :validation-state="areAllSharedIssuedValidateionState"
        class="mt-4"
      />

      <KNumberInput
        id="issued-shares"
        cid="issued-shares"
        label="Number of issued shares"
        type="text"
        placeholder="Write how many shares you wish to issue on day 1"
        v-model="modelValue.number_of_issued_shares"
        :validation-rule="issuedSharesValidationRule"
        :validation-state="issuedSharesValidateionState"
        class="mt-4"
        v-if="!modelValue.are_all_shares_issued"
      />

      <KDropdown
        id="value-per-shares"
        cid="value-per-shares"
        label="Value per shares"
        placeholder="Write how many shares you wish to issue on day 1"
        v-model="modelValue.share_value_id"
        :options="valuePerSharesOptions"
        :validation-rule="valuePerSharesValidationRule"
        :validation-state="valuePerSharesValidateionState"
        class="mt-4"
      />
    </div>
  </div>
</template>
