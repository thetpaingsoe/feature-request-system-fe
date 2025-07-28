<script setup lang="ts">
import Actions from '@/components/Actions.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import KDialog from '@/components/common/KDialog.vue'
import FormHeader from '@/components/FormHeader.vue'
import SectionForm from '@/components/SectionForm.vue'
import SectionNavigation from '@/components/SectionNavigation.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useSubmissionStore } from '@/stores/submissionStore'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';

interface Props {
    id?: string;
}
const props = defineProps<Props>();

const currentSection = ref(0);
const sections = ref<string[]>(['Company Details', 'Shareholders', 'Beneficial Owner', 'Director']);
const router = useRouter();
const submissionStore = useSubmissionStore();
const sectionFormRef = ref()
const breadcrumbs = ref<any[]>([]);

function callbackItemLoadError() {
    submissionStore.resetDialog();
    router.push({ name: "dashboard" });  
}
async function initData() {

    // Only load data from server, where there is submission id
    if(props.id) {
        await submissionStore.fetchSubmission(props.id );
            submissionStore.formData = {
            company_detail: submissionStore.getData.data,
            shareholders: submissionStore.getData.data.shareholders,
            beneficial_owners: submissionStore.getData.data.beneficial_owners,
            directors: submissionStore.getData.data.directors,
        };

        // If loading got error, show dialog and redirect to dashboard
        if(submissionStore.getData.error != null && submissionStore.getData.error.trim() != '') {
            submissionStore.showDialog("Error!", submissionStore.getData.error, callbackItemLoadError, "OK", false);
            
        }else if(submissionStore.getData.data.status != 'pending' && submissionStore.getData.data.status != 'feedback') {
            submissionStore.showDialog("Not Allowed!", 
                "Your submission in the processing, you can't edit now.", 
                callbackItemLoadError,
                "OK",
                false
            );
        }
    }
}

onMounted(() => {
    if (props.id) {
        breadcrumbs.value = [
            {
                title: 'Dashboard',
                name: 'dashboard',
                options : {}
            },
            {
                title: 'Detail',
                name: 'submission',
                options : { id : props.id }
            },
            {
                title: 'Edit',
                name: '/',
                options : {}
            },
        ];

        currentSection.value = 0;
        initData();
        
    } else {
        submissionStore.formData = JSON.parse(localStorage.getItem('formData') || JSON.stringify({
            company_detail: {},
            shareholders: [],
            beneficial_owners: [],
            directors: [],
        }));
        currentSection.value = parseInt(localStorage.getItem('currentSection') || '0', 10);
    }
})

watch(currentSection, (newVal) => {
    if(!props.id){
        // Save currentSection to localStorage whenever it changes
        localStorage.setItem('currentSection', newVal.toString());
    }
});

watch(() => submissionStore.formData, (newVal) => {
    if(!props.id){
        localStorage.setItem('formData', JSON.stringify(newVal))
    }
}, { deep: true })

function handleSectionChange(index : number) {
    if (index < 0 || index >= sections.value.length) return false

    if (index < currentSection.value) {
        currentSection.value = index
    }

    if (sectionFormRef?.value?.validate()) {
        currentSection.value = index
    }
}

function callbackRedirectToDashboard() {
    submissionStore.resetDialog();
    router.push({name : 'dashboard'});
}

async function handleSubmit() {
  if (sectionFormRef?.value?.validate()) {

    if(props.id) {
        // Edit
        const data = await submissionStore.putSubmission(props.id);
        
        if(data != null) {
            submissionStore.showDialog(
                "Successfully Update!",
                "Your submission has been successfully updated.",
                callbackRedirectToDashboard,
                "OK",
                false
            );
        }
    }else {
        // Create
        const data = await submissionStore.postSubmission();
        if(data != null) {
            localStorage.removeItem('formData'); 
            localStorage.removeItem('currentSection');
            submissionStore.showDialog(
                "Successfully Created!",
                "Your submission has been successfully created.",
                callbackRedirectToDashboard,
                "OK",
                false
            );
        }
    }
  }
}

// This will only save in the local storage.
// And it will not work for the edit mode with id.
function handleSave() {
  if(!props.id){
    // Data Sets
    // formData.value.company_detail
    // formData.value.shareholders
    // formData.value.beneficial_owners
    // formData.value.directors
    localStorage.setItem('formData', JSON.stringify(submissionStore.formData))
    router.push({ name: "dashboard" });
  }
}

</script>

<template>
    <DashboardLayout>
    
        <Breadcrumbs :breadcrumbs="breadcrumbs" class="text-white mt-8"/>

        <!-- Form Header -->
        <FormHeader />

        <!-- Form Detail Screen -->
        <div v-if="submissionStore.getData.isLoading" class="w-full mt-8 text-white text-center ">
            Loading...
        </div>
        <div v-else>

            <!-- Section Navigation -->
            <SectionNavigation
                :sections="sections"
                :current-section="currentSection"
                @navigate="handleSectionChange"
            />
            
            <SectionForm  :current-section="currentSection" v-model="submissionStore.formData" ref="sectionFormRef" />

            <!-- Actions -->
            <Actions
                @next="(data) => handleSectionChange(data)"
                :current-section="currentSection"
                :total-sections="sections.length"
                @back="(data) => handleSectionChange(data)"
                @save="() => handleSave()"
                @submit="() => handleSubmit()"
                :id="props.id"
            />
        </div>

        <KDialog 
            :title="submissionStore.dialog.title"
            :message="submissionStore.dialog.message"
            :button="submissionStore.dialog.button"
            :open="submissionStore.dialog.open"
            @close="submissionStore.dialog.action"
            :cancellable="submissionStore.dialog.cancellable"
        />
    
    </DashboardLayout>
</template>
